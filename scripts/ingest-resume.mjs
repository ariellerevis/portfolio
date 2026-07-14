import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT_DIR = process.cwd();
const RESUME_PATH = path.join(ROOT_DIR, "app", "rag", "resume.md");
const SOURCE_URL = "app/rag/resume.md";
const SOURCE = "resume";
const JINA_MODEL = "jina-embeddings-v3";
const MAX_CHUNK_CHARS = 1800;
const BATCH_SIZE = 12;

async function loadEnvFile(filename) {
  const envPath = path.join(ROOT_DIR, filename);
  let contents;

  try {
    contents = await fs.readFile(envPath, "utf8");
  } catch (error) {
    if (error?.code === "ENOENT") return;
    throw error;
  }

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function cleanHeading(value) {
  return value
    .replace(/\*\*/g, "")
    .replace(/\\\|/g, "|")
    .replace(/\s+/g, " ")
    .trim();
}

function getSectionTitle(block, currentSection) {
  const trimmed = block.trim();
  const headingMatch = trimmed.match(/^\*\*([^*\n]{3,120})\*\*$/);

  if (headingMatch) {
    return cleanHeading(headingMatch[1]);
  }

  return currentSection;
}

function chunkResume(markdown) {
  const blocks = markdown
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  const chunks = [];
  let currentSection = "Resume";
  let currentChunk = "";
  let currentChunkSection = currentSection;

  function pushChunk() {
    const content = currentChunk.trim();
    if (!content) return;

    chunks.push({
      content,
      section: currentChunkSection,
    });
    currentChunk = "";
  }

  for (const block of blocks) {
    currentSection = getSectionTitle(block, currentSection);

    if (!currentChunk) {
      currentChunkSection = currentSection;
    }

    const nextChunk = currentChunk ? `${currentChunk}\n\n${block}` : block;

    if (nextChunk.length > MAX_CHUNK_CHARS && currentChunk) {
      pushChunk();
      currentChunkSection = currentSection;
      currentChunk = block;
    } else {
      currentChunk = nextChunk;
    }
  }

  pushChunk();

  return chunks.map((chunk, index) => ({
    ...chunk,
    chunk_index: index,
    content_hash: crypto
      .createHash("sha256")
      .update(`${SOURCE}:${index}:${chunk.section}:${chunk.content}`)
      .digest("hex"),
  }));
}

async function embedBatch(texts, jinaApiKey) {
  const response = await fetch("https://api.jina.ai/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jinaApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: JINA_MODEL,
      task: "retrieval.passage",
      input: texts,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Jina embedding failed with ${response.status}: ${body.slice(0, 500)}`);
  }

  const payload = await response.json();
  const embeddings = payload.data?.map((item) => item.embedding);

  if (!Array.isArray(embeddings) || embeddings.length !== texts.length) {
    throw new Error("Jina did not return one embedding per chunk.");
  }

  return embeddings;
}

async function upsertRows(rows, supabaseUrl, serviceRoleKey) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/portfolio_resume_chunks?on_conflict=content_hash`,
    {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(rows),
    },
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Supabase upsert failed with ${response.status}: ${body.slice(0, 500)}`);
  }
}

async function deleteStaleRows(hashes, supabaseUrl, serviceRoleKey) {
  if (!hashes.length) return;

  const hashFilter = hashes.join(",");
  const response = await fetch(
    `${supabaseUrl}/rest/v1/portfolio_resume_chunks?source=eq.${SOURCE}&content_hash=not.in.(${hashFilter})`,
    {
      method: "DELETE",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: "return=minimal",
      },
    },
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Supabase stale-row cleanup failed with ${response.status}: ${body.slice(0, 500)}`);
  }
}

async function main() {
  await loadEnvFile(".env.local");
  await loadEnvFile(".env");

  const supabaseUrl = requireEnv("SUPABASE_URL").replace(/\/+$/, "");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const jinaApiKey = requireEnv("JINA_API_KEY");

  const resumeMarkdown = await fs.readFile(RESUME_PATH, "utf8");
  const chunks = chunkResume(resumeMarkdown);

  console.log(`Preparing ${chunks.length} resume chunks from ${SOURCE_URL}`);

  for (let start = 0; start < chunks.length; start += BATCH_SIZE) {
    const batch = chunks.slice(start, start + BATCH_SIZE);
    const embeddings = await embedBatch(batch.map((chunk) => chunk.content), jinaApiKey);
    const rows = batch.map((chunk, index) => ({
      content: chunk.content,
      section: chunk.section,
      source: SOURCE,
      source_url: SOURCE_URL,
      chunk_index: chunk.chunk_index,
      content_hash: chunk.content_hash,
      embedding: embeddings[index],
      updated_at: new Date().toISOString(),
    }));

    await upsertRows(rows, supabaseUrl, serviceRoleKey);
    console.log(`Upserted chunks ${start + 1}-${start + batch.length}`);
  }

  await deleteStaleRows(chunks.map((chunk) => chunk.content_hash), supabaseUrl, serviceRoleKey);
  console.log("Resume RAG ingest complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
