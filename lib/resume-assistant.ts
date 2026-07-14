export type AssistantMode = "rag" | "static" | "refusal" | "quota_fallback";

export interface AssistantSource {
  section: string;
  sourceUrl: string;
}

export interface AssistantApiResponse {
  answer: string;
  sources: AssistantSource[];
  mode: AssistantMode;
  retryAfter?: string;
  fallbackQuestions?: string[];
}

export const RESUME_SOURCE_URL = "app/rag/resume.md";

export const STATIC_RESUME_QA = [
  {
    question: "What technical skills are on Arielle's resume?",
    source: "Skills",
    answer:
      "Preanswered from resume: Arielle's resume lists Python, R, C++, C, LaTeX, SQL, Assembly, JavaScript, React, Node.js, MongoDB, Supabase, PostgreSQL, MySQL, AWS, Azure, Vercel, Bloomberg, WRDS, GitHub, Excel, Word, PowerPoint, Codex, Claude, Gemini, and Copilot.",
  },
  {
    question: "What education is listed on Arielle's resume?",
    source: "Education & Honors",
    answer:
      "Preanswered from resume: Arielle is pursuing a Bachelor of Science at Rensselaer Polytechnic Institute, expected May 2028. Her major is Information Technology Web Science and Business Analytics, and her listed GPA is 3.96/4.00.",
  },
  {
    question: "What experience is listed on Arielle's resume?",
    source: "Professional Experiences",
    answer:
      "Preanswered from resume: Arielle's resume lists experience as a Deloitte Discovery Intern in Risk & Financial Advisory, a Generative AI and Cybersecurity Research Assistant at the Rensselaer Cybersecurity Collaboratory, and a Help Desk Technician at RPI's Voorhees Computing Center.",
  },
  {
    question: "What projects are listed on Arielle's resume?",
    source: "Projects",
    answer:
      "Preanswered from resume: Arielle's resume lists PathAI, a containerized academic advising web app; a Rent vs. Buy Housing Tool using Bloomberg, Zillow, and FRED data; and Schedule Sync, a PHP/MySQL course planning app serving 300+ students.",
  },
  {
    question: "What leadership roles are on Arielle's resume?",
    source: "Leadership & Activities",
    answer:
      "Preanswered from resume: Arielle's resume lists ACM Women's Chapter President, James Fund Head of Risk, Alpha Phi Theta Tau Chapter Director of Finance, and Ski and Snowboard Club Vice President.",
  },
  {
    question: "What honors and publications are listed?",
    source: "Education & Honors",
    answer:
      "Preanswered from resume: Arielle's resume lists the Founders Award, White Key Award, Dean's List, and co-authorship of RC3TF: an Augmented Reality CTF, published in The Journal of CISSE.",
  },
  {
    question: "What does Arielle's resume say about Deloitte?",
    source: "Professional Experiences",
    answer:
      "Preanswered from resume: Arielle was a Deloitte Discovery Intern in Risk & Financial Advisory from July 2025 to August 2025, where she worked on financial analysis, market research, strategic analysis for two acquisition targets, an LLS software solution, and an integration roadmap with a 7-person team.",
  },
] as const;

export const RESUME_SUGGESTED_QUESTIONS = STATIC_RESUME_QA.map((item) => item.question);

function normalizeQuestion(question: string) {
  return question
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getStaticResumeAnswer(question: string) {
  const normalized = normalizeQuestion(question);

  return STATIC_RESUME_QA.find((item) => normalizeQuestion(item.question) === normalized);
}
