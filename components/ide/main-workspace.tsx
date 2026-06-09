"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, Sparkles, ExternalLink } from "lucide-react";
import InteractiveDots from "@/components/ui/dots-pattern";

interface MainWorkspaceProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onToggleExplorer: () => void;
  onToggleAssistant: () => void;
  onToggleTerminal: () => void;
}

const typewriterPhrases = [
  "product thinking",
  "design systems",
  "usable interfaces",
  "working prototypes",
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

export function MainWorkspace({
  activeSection,
  onNavigate,
  onToggleExplorer,
  onToggleAssistant,
  onToggleTerminal,
}: MainWorkspaceProps) {
  return (
    <div className="flex-1 bg-workspace overflow-y-auto">
      <div className="min-h-full flex flex-col">
        {(activeSection === "home" || activeSection === "about") && (
          <HomeSection
            onToggleExplorer={onToggleExplorer}
            onToggleAssistant={onToggleAssistant}
            onToggleTerminal={onToggleTerminal}
          />
        )}
        {activeSection === "projects" && <ProjectsSection />}
        {activeSection === "experience" && <ExperienceSection />}
        {activeSection === "skills" && <SkillsSection />}
        {activeSection === "contact" && <ContactSection />}
      </div>
    </div>
  );
}

function HomeSection({
  onToggleExplorer,
  onToggleAssistant,
  onToggleTerminal,
}: {
  onToggleExplorer: () => void;
  onToggleAssistant: () => void;
  onToggleTerminal: () => void;
}) {
  const typedText = useLoopingTypewriter(typewriterPhrases);

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
        <div className="relative overflow-hidden rounded-lg border border-border/70 bg-workspace/45 px-4 py-8 text-center shadow-[0_18px_80px_rgba(0,0,0,0.22)] backdrop-blur-[1px] sm:px-8 sm:py-10 md:px-12">
          <div className="relative z-10 mx-auto max-w-4xl">
            <div className="font-mono text-xs text-muted-foreground mb-4">~/portfolio/about.md</div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6 leading-none">
              <span className="text-accent-blue">~/</span>
              <span className="text-foreground">arielle</span>
            </h1>
            <p className="font-mono text-base sm:text-lg md:text-xl text-muted-foreground">
              <span className="text-muted-foreground/60">{`/*`}</span>
              {" "}turning ideas into working systems{" "}
              <span className="text-muted-foreground/60">{`*/`}</span>
            </p>
            <div
              className="mt-6 inline-flex max-w-full items-center rounded-lg border border-border bg-elevated/70 px-3 py-2 font-mono text-sm text-foreground shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
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
            className="flex items-center justify-center gap-2 rounded-lg border border-transparent px-3 py-2 hover:border-accent-blue/30 hover:bg-accent-blue-soft hover:text-accent-blue-bright transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>explore folders</span>
          </button>

          <button
            onClick={onToggleAssistant}
            className="flex items-center justify-center gap-2 rounded-lg border border-transparent px-3 py-2 hover:border-accent-blue/30 hover:bg-accent-blue-soft hover:text-accent-blue-bright transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60"
          >
            <span>ask questions</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onToggleTerminal}
            className="flex items-center justify-center gap-2 rounded-lg border border-transparent px-3 py-2 hover:border-accent-blue/30 hover:bg-accent-blue-soft hover:text-accent-blue-bright transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60 sm:col-span-2"
          >
            <span>navigate using terminal</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>

        <div className="mt-14 grid gap-5 text-left lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
          <div className="rounded-lg border border-border bg-elevated/70 p-5 shadow-[0_16px_52px_rgba(0,0,0,0.18)] backdrop-blur-[1px] sm:p-6">
            <h2 className="text-2xl font-bold mb-5 text-foreground">About</h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                {`I'm a systems-minded builder who turns vague ideas into working products. My approach blends
                product thinking, design intuition, and technical execution - I care about both the big picture
                and the implementation details.`}
              </p>
              <p>
                I work across the stack: defining problems, mapping user flows, designing interfaces, writing
                code, and shipping features. I thrive in environments where I can own outcomes end-to-end.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-panel/75 p-5 shadow-[0_16px_52px_rgba(0,0,0,0.16)] backdrop-blur-[1px] sm:p-6">
            <h3 className="text-foreground font-semibold mb-4">How I Work</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-accent-blue font-mono">-&gt;</span>
                <span>Start with the problem, not the solution</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-blue font-mono">-&gt;</span>
                <span>Prototype fast, iterate faster</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-blue font-mono">-&gt;</span>
                <span>Design systems that scale, not just features</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent-blue font-mono">-&gt;</span>
                <span>Ship early, learn continuously</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProjectsSection() {
  const projects = [
    {
      name: "Workflow Intelligence Dashboard",
      file: "workflow-dashboard.tsx",
      role: "Product + Frontend",
      stack: ["React", "TypeScript", "Supabase", "AI APIs"],
      description: "Transformed scattered team data into a searchable, AI-powered operating dashboard that surfaces insights automatically.",
      impact: "Reduced context-switching time by 40%",
    },
    {
      name: "Automation Engine",
      file: "automation-engine.tsx",
      role: "Full Stack",
      stack: ["Next.js", "Node.js", "PostgreSQL", "Temporal"],
      description: "Built a visual workflow builder that lets non-technical users create complex automation sequences without code.",
      impact: "Automated 200+ hours of manual work monthly",
    },
    {
      name: "Design System",
      file: "design-system.tsx",
      role: "Design + Engineering",
      stack: ["React", "Tailwind", "Storybook", "Figma"],
      description: "Created a comprehensive component library with design tokens, accessibility baked in, and full documentation.",
      impact: "Accelerated feature development by 3x",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 md:p-12">
      <div className="font-mono text-xs text-muted-foreground mb-4">~/portfolio/projects/</div>
      <h2 className="text-3xl font-bold mb-8">Projects</h2>
      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.name} className="bg-elevated rounded-lg border border-border p-6 hover:border-accent-blue/30 transition-colors">
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

function ExperienceSection() {
  const experiences = [
    {
      title: "Senior Product Engineer",
      company: "TechCorp",
      period: "2022 - Present",
      description: "Leading product development for internal tools platform. Shipping features end-to-end from user research to production.",
      highlights: ["Launched 3 major products", "Grew team from 2 to 8", "Established design system"],
    },
    {
      title: "Full Stack Developer",
      company: "StartupXYZ",
      period: "2020 - 2022",
      description: "Built and scaled customer-facing applications. Owned entire features from database design to UI implementation.",
      highlights: ["Scaled platform to 50k users", "Reduced load time by 60%", "Implemented CI/CD pipeline"],
    },
    {
      title: "Product Designer",
      company: "DesignStudio",
      period: "2018 - 2020",
      description: "Designed digital products for clients across fintech, healthcare, and e-commerce. Conducted user research and usability testing.",
      highlights: ["Designed 20+ products", "Led design workshops", "Created design documentation"],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-8 md:p-12">
      <div className="font-mono text-xs text-muted-foreground mb-4">~/portfolio/experience/roles.md</div>
      <h2 className="text-3xl font-bold mb-8">Experience</h2>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
        <div className="space-y-8 pl-6">
          {experiences.map((exp) => (
            <div key={exp.title} className="relative">
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

function SkillsSection() {
  const skillGroups = [
    {
      name: "Product",
      file: "product.ts",
      skills: ["Problem framing", "Roadmap thinking", "User flows", "Prototyping", "Prioritization", "Metrics"],
    },
    {
      name: "Design",
      file: "design.css",
      skills: ["Interface systems", "Interaction design", "Information architecture", "Visual polish", "Accessibility", "Motion"],
    },
    {
      name: "Engineering",
      file: "engineering.js",
      skills: ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "APIs", "Testing", "CI/CD"],
    },
    {
      name: "Systems",
      file: "systems.md",
      skills: ["Architecture", "Data modeling", "Automation", "Documentation", "Process design"],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 md:p-12">
      <div className="font-mono text-xs text-muted-foreground mb-4">~/portfolio/skills/</div>
      <h2 className="text-3xl font-bold mb-8">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillGroups.map((group) => (
          <div key={group.name} className="bg-elevated rounded-lg border border-border p-6">
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
          {`I'm currently open to select projects and opportunities. If you're building something 
          interesting or want to collaborate, let's talk.`}
        </p>
        <div className="space-y-4">
          <a 
            href="mailto:hello@arielle.dev" 
            className="flex items-center gap-3 p-4 bg-elevated rounded-lg border border-border hover:border-accent-blue/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-accent-blue-soft flex items-center justify-center">
              <span className="text-accent-blue">@</span>
            </div>
            <div>
              <div className="text-foreground font-medium group-hover:text-accent-blue transition-colors">Email</div>
              <div className="text-sm text-muted-foreground">hello@arielle.dev</div>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto" />
          </a>
          <a
            href="https://github.com/ariellerevis/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-elevated rounded-lg border border-border hover:border-accent-blue/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg bg-accent-blue-soft flex items-center justify-center">
              <span className="text-accent-blue font-mono">gh</span>
            </div>
            <div>
              <div className="text-foreground font-medium group-hover:text-accent-blue transition-colors">GitHub</div>
              <div className="text-sm text-muted-foreground">@ariellerevis</div>
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
            Available for select projects
          </span>
        </div>
      </div>
    </div>
  );
}
