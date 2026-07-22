Deployed website: [Click Here!](https://portfolio-puce-theta-18.vercel.app/)

# Arielle Revis Portfolio

I built this portfolio in the style of a developer workspace, instead of a traditional personal site. Visitors can move through my background like they would through a IDE: open sections from a file explorer, use the activity bar for quick actions, navigate through a terminal-style interface, view projects, download my resume, and ask resume-specific questions through an AI Retreival-Augmented Generation (RAG) interface, **Ask Arielle AI**.

## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS, custom dark workspace theme
- **UI:** Lucide icons, Base UI, reusable component utilities
- **AI Integration:** Groq - LLM, Jina - embeddings
- **Data:** Supabase Vector Database (pgvector)
- **Backend:** Server-side API route for assistant requests
- **Deployment:** Vercel
- **QA:** ESLint, MCP browser inspection, desktop/mobile 2-pass screenshot loop

## What I Built

- An IDE-inspired shell with an activity bar, file explorer, main editor area, terminal, status bar, and assistant panel.
- Responsive desktop and mobile layouts with dedicated mobile assistant and terminal sheets.
- Search and navigation patterns that make the portfolio feel browsable rather than linear.
- A public resume flow with a stable PDF link.
- **Ask Arielle AI**, a resume-scoped RAG model that answers questions from embedded resume context (see the [RAG Architecture](## RAG Architecture) section for further details)

## Agentic Development Workflow

I used an agent-assisted workflow throughout the project, with manual review as the final gate. The process was especially helpful for coordinating design, copy, asset updates, and verification across multiple components. All commits and PRs were mannually inspected and approved before implementation.

My workflow included (but was not limited to):

1. Pulling the latest branch state before making changes.
2. Using Plan Mode for scoping and sequencing larger edits.
3. Using MCP browser tooling to inspect the rendered site instead of relying only on code.
4. Capturing desktop and mobile screenshots before and after visual changes using a 2-pass screenshot loop.
5. Reviewing generated edits manually for tone, accuracy, accessibility, and security.
6. Running lint and targeted searches to catch stale labels, links, or assistant copy.
7. Utilizing SKILL.md and AGENT.md files as accelerating tools.


## RAG Architecture

**Ask Arielle AI** is a small RAG system built around my resume. It is intentionally narrow: it answers resume-related questions and declines when the answer is not supported by the available context.

At a high level:

1. I converted my resume into a markdown format.
2. The text is split into meaningful chunks based on resume sections (Education, Leadership, Skills, etc).
3. Chunks are embedded using Jina and stored for vector search in Supabase.
4. User's question is embedded at request time.
5. Retrieves the top 4-6 most relevant chunks from Supabase.
6. The LLM (Groq) receives only the retrieved resume context and the user question.
7. The UI reports whether the answer came from RAG, a static fallback, or a refusal path.

I also added static answers for common resume questions so the assistant remains useful if model services are unavailable or rate-limited.

## Security Considerations

Since this is a public portfolio, I kept the assistant scoped and conservative.

- The assistant is limited to resume-grounded answers.
- Sensitive or off-topic requests are refused.
- Provider calls happen server-side, away from the browser.
- Retrieved content is treated as data, not as instructions.
- User input is bounded before retrieval or generation.
- The assistant is instructed not to invent dates, roles, projects, education details, or skills.
- Failure states return controlled fallback messages instead of internal details.


## Repository Map

- `components/ide/` - workspace UI components
- `app/api/assistant/` - assistant request handling
- `app/rag/` - curated resume source content
- `public/` - static assets, icons, and resume PDF
