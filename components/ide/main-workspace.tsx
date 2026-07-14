"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Sparkles, ExternalLink } from "lucide-react";
import InteractiveDots from "@/components/ui/dots-pattern";

interface MainWorkspaceProps {
  activeSection: string;
  activeFile: string | null;
  onNavigate: (section: string) => void;
  onToggleExplorer: () => void;
  onToggleAssistant: () => void;
  onToggleTerminal: () => void;
  isExplorerOpen: boolean;
  isAssistantOpen: boolean;
  isTerminalOpen: boolean;
}

const typewriterPhrases = [
  "AI + cybersecurity",
  "IT assurance",
  "full-stack apps",
  "financial analytics",
  "student leadership",
];

function useLoopingTypewriter(phrases: string[]) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIndex];
    const isAtEnd = characterIndex === phrase.length;
    const isAtStart = characterIndex === 0;
    const delay = isDeleting ? 38 : isAtEnd ? 1300 : 68;

    const timeout = window.setTimeout(() => {
      if (!isDeleting && isAtEnd) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && isAtStart) {
        setIsDeleting(false);
        setPhraseIndex((current) => (current + 1) % phrases.length);
        return;
      }

      setCharacterIndex((current) => current + (isDeleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [characterIndex, isDeleting, phraseIndex, phrases]);

  return phrases[phraseIndex].slice(0, characterIndex);
}

function scrollWorkspaceTo(targetId: string) {
  const target = document.getElementById(targetId);
  const scroller = document.querySelector("main");

  if (!target || !(scroller instanceof HTMLElement)) return;

  const targetTop =
    target.getBoundingClientRect().top -
    scroller.getBoundingClientRect().top +
    scroller.scrollTop -
    24;

  scroller.scrollTo({
    top: Math.max(targetTop, 0),
    behavior: "smooth",
  });
}

export function MainWorkspace({
  activeSection,
  activeFile,
  onNavigate,
  onToggleExplorer,
  onToggleAssistant,
  onToggleTerminal,
  isExplorerOpen,
  isAssistantOpen,
  isTerminalOpen,
}: MainWorkspaceProps) {
  return (
    <main className="flex-1 bg-workspace overflow-y-auto">
      <div className="min-h-full flex flex-col">
        {(activeSection === "home" || activeSection === "about") && (
          <HomeSection
            onToggleExplorer={onToggleExplorer}
            onToggleAssistant={onToggleAssistant}
            onToggleTerminal={onToggleTerminal}
            isExplorerOpen={isExplorerOpen}
            isAssistantOpen={isAssistantOpen}
            isTerminalOpen={isTerminalOpen}
          />
        )}
        {activeSection === "projects" && <ProjectsSection activeFile={activeFile} />}
        {activeSection === "experience" && <ExperienceSection activeFile={activeFile} />}
        {activeSection === "skills" && <SkillsSection activeFile={activeFile} />}
        {activeSection === "contact" && <ContactSection />}
      </div>
    </main>
  );
}

function HomeSection({
  onToggleExplorer,
  onToggleAssistant,
  onToggleTerminal,
  isExplorerOpen,
  isAssistantOpen,
  isTerminalOpen,
}: {
  onToggleExplorer: () => void;
  onToggleAssistant: () => void;
  onToggleTerminal: () => void;
  isExplorerOpen: boolean;
  isAssistantOpen: boolean;
  isTerminalOpen: boolean;
}) {
  const typedText = useLoopingTypewriter(typewriterPhrases);
  const promptBaseClass =
    "flex items-center justify-center gap-2 rounded-lg border px-3 py-2 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60";
  const promptIdleClass =
    "border-transparent hover:border-accent-blue/30 hover:bg-accent-blue-soft hover:text-accent-blue-bright";
  const promptActiveClass =
    "border-accent-blue/35 bg-accent-blue-soft text-accent-blue-bright";

  return (
    <div className="relative flex-1 overflow-hidden bg-workspace px-4 py-10 sm:p-8 md:p-12">
      <InteractiveDots
        backgroundColor="#11141a"
        dotColor="#4aa8ff"
        gridSpacing={28}
        animationSpeed={0.005}
        removeWaveLine
        className="opacity-90"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(74,168,255,0.08),transparent_32rem),linear-gradient(180deg,rgba(17,20,26,0.12),rgba(17,20,26,0.72))]" />
      <section className="relative z-10 min-h-[calc(100vh-7rem)] max-w-5xl mx-auto flex flex-col justify-center">
        <div className="px-2 py-8 text-center sm:px-6 sm:py-10 md:px-10">
          <div className="mx-auto max-w-4xl">
            <div className="font-mono text-xs text-muted-foreground mb-4">~/portfolio/about.md</div>
            <h1 className="whitespace-nowrap text-[2.75rem] sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6 leading-none">
              <span className="text-accent-blue">~/</span>
              <span className="text-foreground">arielle</span>
            </h1>
            <p className="mx-auto max-w-3xl font-mono text-sm leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              <span className="text-muted-foreground/60">{`/*`}</span>
              {" "}building useful systems across AI, finance, and student life{" "}
              <span className="text-muted-foreground/60">{`*/`}</span>
            </p>
            <div
              className="mt-6 inline-flex max-w-full items-center font-mono text-sm text-foreground"
              aria-label={`Currently focused on ${typedText || typewriterPhrases[0]}`}
            >
              <span className="text-muted-foreground">{`const focus = "`}</span>
              <span className="text-accent-blue-bright">{typedText}</span>
              <span className="text-muted-foreground">{`"`}</span>
              <span className="ml-1 inline-block h-4 w-2 bg-accent-blue animate-blink" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 text-accent-blue font-mono text-sm md:text-base sm:grid-cols-2">
          <button
            onClick={onToggleExplorer}
            className={`${promptBaseClass} ${isExplorerOpen ? promptActiveClass : promptIdleClass}`}
            aria-pressed={isExplorerOpen}
          >
            <span>explore folders</span>
            {isExplorerOpen ? (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            ) : (
              <ArrowLeft className="w-4 h-4 -order-1 group-hover:-translate-x-1 transition-transform" />
            )}
          </button>

          <button
            onClick={onToggleAssistant}
            className={`${promptBaseClass} ${isAssistantOpen ? promptActiveClass : promptIdleClass}`}
            aria-pressed={isAssistantOpen}
          >
            <span>ask questions</span>
            {isAssistantOpen ? (
              <ArrowLeft className="w-4 h-4 -order-1 group-hover:-translate-x-1 transition-transform" />
            ) : (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </button>

          <button
            onClick={onToggleTerminal}
            className={`${promptBaseClass} ${isTerminalOpen ? promptActiveClass : promptIdleClass} sm:col-span-2`}
            aria-pressed={isTerminalOpen}
          >
            <span>navigate using terminal</span>
            {isTerminalOpen ? (
              <ChevronUp className="w-4 h-4 -order-1 group-hover:-translate-y-1 transition-transform" />
            ) : (
              <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            )}
          </button>
        </div>

        <div className="mt-14 grid gap-5 text-left lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <div className="rounded-lg border border-border bg-elevated/70 p-5 shadow-[0_16px_52px_rgba(0,0,0,0.18)] backdrop-blur-[1px] sm:p-6">
            <h2 className="text-2xl font-bold mb-5 text-foreground">About</h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                {`I'm an RPI student studying Information Technology Web Science and Business Analytics. My work
                spans full-stack software, generative AI and cybersecurity research, investment analysis,
                technical support, and campus leadership.`}
              </p>
              <p>
                I like building tools around real information: course planning data, financial market data,
                student workflows, and cybersecurity learning signals. I care about making technical systems
                easier to understand and use.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-panel/75 p-5 shadow-[0_16px_52px_rgba(0,0,0,0.16)] backdrop-blur-[1px] sm:p-6">
            <h3 className="text-foreground font-semibold mb-4">Education & Honors</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="shrink-0 text-accent-blue font-mono">-&gt;</span>
                <span>Rensselaer Polytechnic Institute, B.S. expected May 2028</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 text-accent-blue font-mono">-&gt;</span>
                <span>Information Technology Web Science and Business Analytics; GPA 3.96/4.00</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 text-accent-blue font-mono">-&gt;</span>
                <span>Founders Award, White Key Award, and Dean&apos;s List</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 text-accent-blue font-mono">-&gt;</span>
                <span>Co-author of RC3TF: an Augmented Reality CTF, published in The Journal of CISSE</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

const projectTargetByFile: Record<string, string> = {
  projects: "projects-overview",
  "project-workflow": "project-pathai",
  "project-automation": "project-rent-vs-buy",
  "project-design": "project-schedule-sync",
  "case-studies": "projects-overview",
};

function ProjectsSection({ activeFile }: { activeFile: string | null }) {
  const projects = [
    {
      id: "project-pathai",
      name: "PathAI",
      file: "pathai.tsx",
      role: "Team Lead + Full Stack",
      stack: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Supabase", "Upstash Vector"],
      description: "Directed a 5-person team to develop and deploy a containerized academic advising web application that centralizes student scheduling and career planning.",
      impact: "Built with a custom RAG pipeline for advising support",
    },
    {
      id: "project-rent-vs-buy",
      name: "Rent vs. Buy Housing Tool",
      file: "rent-vs-buy.r",
      role: "Analytics + Finance",
      stack: ["Bloomberg", "Zillow", "FRED", "Financial Modeling"],
      description: "Developed a full-stack analytics tool that delivers location-specific real estate insights from market and economic data implemented in a financial model.",
      impact: "Combines real estate data with rent-vs-buy analysis",
    },
    {
      id: "project-schedule-sync",
      name: "Schedule Sync",
      file: "schedule-sync.php",
      role: "Full Stack",
      stack: ["PHP", "MySQL", "AJAX", "JSON"],
      description: "Built a course planning app with University ID login, AJAX-powered scheduling, interactive calendars, and automated JSON pipelines for live course information.",
      impact: "Served 300+ students",
    },
  ];

  useEffect(() => {
    const targetId = activeFile ? projectTargetByFile[activeFile] : undefined;
    if (!targetId) return;

    window.requestAnimationFrame(() => scrollWorkspaceTo(targetId));
  }, [activeFile]);

  return (
    <div id="projects-overview" className="max-w-4xl mx-auto p-8 md:p-12">
      <div className="font-mono text-xs text-muted-foreground mb-4">~/portfolio/projects/</div>
      <h2 className="text-3xl font-bold mb-8">Projects</h2>
      <div className="space-y-6">
        {projects.map((project) => (
          <div
            id={project.id}
            key={project.name}
            className="scroll-mt-8 bg-elevated rounded-lg border border-border p-6 hover:border-accent-blue/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{project.name}</h3>
                <span className="font-mono text-xs text-muted-foreground">{project.file}</span>
              </div>
              <span className="text-xs bg-accent-blue-soft text-accent-blue px-2 py-1 rounded font-mono">
                {project.role}
              </span>
            </div>
            <p className="text-muted-foreground mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.stack.map((tech) => (
                <span key={tech} className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground font-mono">
                  {tech}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-accent-blue" />
              <span className="text-accent-blue">{project.impact}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const experienceTargetByFile: Record<string, string> = {
  experience: "experience-overview",
  roles: "experience-deloitte-discovery-ii",
  impact: "experience-acm",
  "role-deloitte-ii": "experience-deloitte-discovery-ii",
  "role-deloitte-i": "experience-deloitte-discovery-i",
  "role-research": "experience-research",
  "role-help-desk": "experience-help-desk",
  "leadership-acm": "experience-acm",
  "leadership-james-fund": "experience-james-fund",
};

function ExperienceSection({ activeFile }: { activeFile: string | null }) {
  const experiences = [
    {
      id: "experience-deloitte-discovery-ii",
      title: "Discovery II Intern - IT Assurance",
      company: "Deloitte",
      period: "June 2026 - Present",
      description: "Collaborates with a globally distributed team on IT systems and workflow audits for a Fortune 500 aerospace and defense client.",
      highlights: ["Enterprise SAP risk and compliance evaluation", "SOD conflicts, change management, and SM20 security audit logs", "Automated agent for unstructured audit data and risk anomaly detection"],
    },
    {
      id: "experience-deloitte-discovery-i",
      title: "Discovery Intern - Risk & Financial Advisory",
      company: "Deloitte",
      period: "July 2025 - August 2025",
      description: "Conducted financial analysis, market research, and strategic analysis on 2 acquisition targets for a social media platform.",
      highlights: ["2 acquisition targets", "LLS software solution projected to increase engagement by 30%", "7-person team delivered 25% ahead of timeline"],
    },
    {
      id: "experience-research",
      title: "Generative AI and Cybersecurity Research Assistant",
      company: "Rensselaer Cybersecurity Collaboratory, RPI",
      period: "August 2024 - May 2025",
      description: "Studied how AI performs in cybersecurity education by organizing human-subject data and analyzing cybersecurity learning datasets.",
      highlights: ["90+ data points organized", "5+ large datasets analyzed", "Research shared for ISC2 2024 and CISSE 2025"],
    },
    {
      id: "experience-help-desk",
      title: "Help Desk Technician",
      company: "Voorhees Computing Center, RPI",
      period: "January 2025 - Present",
      description: "Diagnoses hardware, software, and network issues for students and staff while maintaining ticketing records and clear support communication.",
      highlights: ["30+ technical issues resolved", "300+ support activities documented", "Technical concepts explained to non-technical users"],
    },
    {
      id: "experience-acm",
      title: "President",
      company: "Association for Computing Machinery - Women's Chapter",
      period: "April 2025 - April 2026",
      description: "Led programs, collaborations, and curriculum-driven workshops designed to strengthen technical readiness and community engagement.",
      highlights: ["Member engagement up 90%", "15+ industry and research collaborations", "10-member executive board"],
    },
    {
      id: "experience-james-fund",
      title: "Head of Risk",
      company: "James Fund",
      period: "December 2025 - Present",
      description: "Monitors risk metrics and portfolio allocation for a $243K student-managed investment fund while developing a real-time risk monitoring system.",
      highlights: ["Fund up 8.78% Jan-Sept 2025", "Outperformed S&P 500 by ~1%", "Replacing Excel-based performance tracking"],
    },
    {
      id: "experience-alpha-phi",
      title: "Director of Finance",
      company: "Alpha Phi - Theta Tau Chapter",
      period: "October 2025 - Present",
      description: "Manages chapter billing, payments, and budget tracking while participating in service, fundraising, sisterhood, and women's leadership initiatives.",
      highlights: ["Member billing", "Payments", "Budget tracking"],
    },
    {
      id: "experience-ski-club",
      title: "Vice President",
      company: "Ski and Snowboard Club",
      period: "August 2025 - December 2025",
      description: "Directed a 15-member executive board and coordinated partnerships with 10+ ski resorts for RPI's largest student organization.",
      highlights: ["15-member executive board", "10+ resort partnerships", "Membership growth up 10%"],
    },
  ];

  useEffect(() => {
    const targetId = activeFile ? experienceTargetByFile[activeFile] : undefined;
    if (!targetId) return;

    window.requestAnimationFrame(() => scrollWorkspaceTo(targetId));
  }, [activeFile]);

  return (
    <div id="experience-overview" className="max-w-3xl mx-auto p-8 md:p-12">
      <div className="font-mono text-xs text-muted-foreground mb-4">~/portfolio/experience/roles.md</div>
      <h2 className="text-3xl font-bold mb-8">Experience & Leadership</h2>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
        <div className="space-y-8 pl-6">
          {experiences.map((exp) => (
            <div id={exp.id} key={`${exp.company}-${exp.title}`} className="relative scroll-mt-8">
              <div className="absolute -left-6 top-2 w-3 h-3 rounded-full bg-accent-blue border-2 border-background" />
              <div className="font-mono text-xs text-muted-foreground mb-1">{exp.period}</div>
              <h3 className="text-lg font-semibold text-foreground">{exp.title}</h3>
              <div className="text-accent-blue text-sm mb-2">{exp.company}</div>
              <p className="text-muted-foreground mb-3">{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.highlights.map((highlight) => (
                  <span key={highlight} className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const skillsTargetByFile: Record<string, string> = {
  skills: "skills-overview",
  "skill-product": "skills-software",
  "skill-design": "skills-databases",
  "skill-engineering": "skills-stack",
  interests: "skills-interests",
};

function SkillsSection({ activeFile }: { activeFile: string | null }) {
  const skillGroups = [
    {
      id: "skills-software",
      name: "Software",
      file: "software.py",
      skills: ["Python", "R", "C++", "C", "LaTeX", "SQL", "Assembly", "JavaScript"],
    },
    {
      id: "skills-stack",
      name: "Libraries & Cloud",
      file: "stack.ts",
      skills: ["React", "Node.js", "AWS", "Azure", "Vercel"],
    },
    {
      id: "skills-databases",
      name: "Databases",
      file: "databases.sql",
      skills: ["MongoDB", "Supabase", "PostgreSQL", "MySQL"],
    },
    {
      id: "skills-tools",
      name: "Tools",
      file: "tools.md",
      skills: ["Bloomberg", "WRDS", "GitHub", "Excel", "Word", "PowerPoint"],
    },
    {
      id: "skills-ai",
      name: "AI",
      file: "ai-tools.md",
      skills: ["Codex", "Claude", "Gemini", "Copilot"],
    },
    {
      id: "skills-communication",
      name: "Interpersonal",
      file: "communication.md",
      skills: ["Detail-oriented", "Public speaking", "Technical writing"],
    },
    {
      id: "skills-languages",
      name: "Languages",
      file: "languages.md",
      skills: ["English - native fluency", "Hebrew - conversational fluency"],
    },
    {
      id: "skills-interests",
      name: "Interests",
      file: "interests.md",
      skills: ["AI", "Skiing", "Reading", "Marvel", "Weightlifting", "Game of Thrones", "Crocheting"],
    },
  ];

  useEffect(() => {
    const targetId = activeFile ? skillsTargetByFile[activeFile] : undefined;
    if (!targetId) return;

    window.requestAnimationFrame(() => scrollWorkspaceTo(targetId));
  }, [activeFile]);

  return (
    <div id="skills-overview" className="max-w-4xl mx-auto p-8 md:p-12">
      <div className="font-mono text-xs text-muted-foreground mb-4">~/portfolio/skills/</div>
      <h2 className="text-3xl font-bold mb-8">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillGroups.map((group) => (
          <div id={group.id} key={group.name} className="scroll-mt-8 bg-elevated rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-foreground">{group.name}</h3>
              <span className="font-mono text-xs text-muted-foreground">{group.file}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <span key={skill} className="text-sm bg-accent-blue-soft text-accent-blue-bright px-3 py-1.5 rounded-md">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactSection() {
  return (
    <div className="max-w-2xl mx-auto p-8 md:p-12">
      <div className="font-mono text-xs text-muted-foreground mb-4">~/portfolio/contact.md</div>
      <h2 className="text-3xl font-bold mb-8">Contact</h2>
      <div className="space-y-6">
        <p className="text-muted-foreground leading-relaxed">
          Arielle is based around NJ, NY, and Miami. The best ways to reach her are email,
          LinkedIn, and her portfolio repo.
        </p>
        <div className="space-y-4">
          <a 
            href="mailto:arielle.a.revis@gmail.com" 
            className="flex items-center gap-3 p-4 bg-elevated rounded-lg border border-border hover:border-accent-blue/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-accent-blue-soft flex items-center justify-center">
              <span className="text-accent-blue">@</span>
            </div>
            <div>
              <div className="text-foreground font-medium group-hover:text-accent-blue transition-colors">Email</div>
              <div className="text-sm text-muted-foreground">arielle.a.revis@gmail.com</div>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
          </a>
          <a
            href="https://github.com/ariellerevis/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-elevated rounded-lg border border-border hover:border-accent-blue/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-accent-blue-soft flex items-center justify-center">
              <span className="text-accent-blue font-mono">www</span>
            </div>
            <div>
              <div className="text-foreground font-medium group-hover:text-accent-blue transition-colors">Portfolio Repo</div>
              <div className="text-sm text-muted-foreground">ariellerevis/portfolio</div>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
          </a>
          <a
            href="https://www.linkedin.com/in/arielle-revis/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-elevated rounded-lg border border-border hover:border-accent-blue/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-accent-blue-soft flex items-center justify-center">
              <span className="text-accent-blue font-mono">in</span>
            </div>
            <div>
              <div className="text-foreground font-medium group-hover:text-accent-blue transition-colors">LinkedIn</div>
              <div className="text-sm text-muted-foreground">/in/arielle-revis</div>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
          </a>
        </div>
        <div className="pt-6 border-t border-border">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-full text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            RPI Class of 2028
          </span>
        </div>
      </div>
    </div>
  );
}
