"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, FileText, Files, Globe, Search, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityBarProps {
  activeIcon: string;
  onIconClick: (icon: string) => void;
}

const portfolioUrl = "https://github.com/ariellerevis/portfolio";
const linkedInUrl = "https://www.linkedin.com/in/arielle-revis/";
const resumeUrl = "/Arielle-Revis-Resume.pdf";

type SearchItem =
  | { id: string; title: string; path: string; route: string; href?: never; keywords?: string }
  | { id: string; title: string; path: string; href: string; route?: never; keywords?: string };

const searchItems: SearchItem[] = [
  { id: "about", title: "About", path: "~/portfolio/about.md", route: "about", keywords: "RPI ITWS Business Analytics GPA Founders White Key CISSE RC3TF" },
  { id: "projects", title: "Projects", path: "~/portfolio/projects/", route: "projects", keywords: "PathAI Rent Buy Housing Tool Schedule Sync" },
  { id: "pathai", title: "PathAI", path: "~/portfolio/projects/pathai.tsx", route: "project-workflow", keywords: "academic advising scheduling career planning Next.js TypeScript FastAPI PostgreSQL Supabase RAG Upstash Vector" },
  { id: "rent-vs-buy", title: "Rent vs. Buy Housing Tool", path: "~/portfolio/projects/rent-vs-buy.r", route: "project-automation", keywords: "Bloomberg Zillow FRED real estate financial model analytics" },
  { id: "schedule-sync", title: "Schedule Sync", path: "~/portfolio/projects/schedule-sync.php", route: "project-design", keywords: "PHP MySQL AJAX JSON University ID calendar course planning 300 students" },
  { id: "projects-json", title: "Projects Index", path: "~/portfolio/projects/projects.json", route: "case-studies", keywords: "all projects case studies PathAI Rent Buy Schedule Sync" },
  { id: "experience", title: "Experience", path: "~/portfolio/experience/roles.md", route: "experience", keywords: "Deloitte RPI Cybersecurity Collaboratory Voorhees Help Desk ACM James Fund Alpha Phi Ski Snowboard" },
  { id: "deloitte-it-assurance", title: "Deloitte Discovery II - IT Assurance", path: "~/portfolio/experience/roles.md#deloitte-it-assurance", route: "role-deloitte-ii", keywords: "June 2026 SAP SOD SM20 change management audit logs automated agent Fortune 500 aerospace defense" },
  { id: "deloitte-rfa", title: "Deloitte Discovery I - Risk & Financial Advisory", path: "~/portfolio/experience/roles.md#deloitte-risk-financial-advisory", route: "role-deloitte-i", keywords: "July 2025 August 2025 acquisition targets Leukemia Lymphoma Society LLS engagement roadmap" },
  { id: "research", title: "Generative AI + Cybersecurity Research", path: "~/portfolio/experience/roles.md#rpi-cybersecurity-research", route: "role-research", keywords: "Rensselaer Cybersecurity Collaboratory human subjects ISC2 CISSE pedagogy datasets" },
  { id: "help-desk", title: "Help Desk Technician", path: "~/portfolio/experience/roles.md#help-desk", route: "role-help-desk", keywords: "Voorhees Computing Center tickets hardware software network support 300 activities" },
  { id: "leadership", title: "Leadership & Activities", path: "~/portfolio/experience/impact.md", route: "impact", keywords: "ACM Women James Fund Head of Risk Alpha Phi Director Finance Ski Snowboard Vice President" },
  { id: "james-fund", title: "James Fund - Head of Risk", path: "~/portfolio/experience/impact.md#james-fund", route: "leadership-james-fund", keywords: "$243K student-managed investment fund S&P 500 risk monitoring Excel performance tracking" },
  { id: "skills", title: "Skills", path: "~/portfolio/skills/", route: "skills", keywords: "Python R C++ C LaTeX SQL Assembly JavaScript React Node.js AWS Azure Vercel MongoDB Supabase PostgreSQL MySQL" },
  { id: "software", title: "Software Skills", path: "~/portfolio/skills/software.py", route: "skill-product", keywords: "Python R C++ C LaTeX SQL Assembly JavaScript" },
  { id: "databases", title: "Databases", path: "~/portfolio/skills/databases.sql", route: "skill-design", keywords: "MongoDB Supabase PostgreSQL MySQL" },
  { id: "stack", title: "Libraries & Cloud", path: "~/portfolio/skills/stack.ts", route: "skill-engineering", keywords: "React Node.js AWS Azure Vercel" },
  { id: "interests", title: "Interests", path: "~/portfolio/skills/interests.md", route: "interests", keywords: "AI Skiing Reading Marvel Weightlifting Game of Thrones Crocheting" },
  { id: "contact", title: "Contact", path: "~/portfolio/contact.md", route: "contact", keywords: "email arielle.a.revis@gmail.com NJ NY Miami LinkedIn" },
  { id: "portfolio", title: "Portfolio Repo", path: "ariellerevis/portfolio", href: portfolioUrl },
  { id: "linkedin", title: "LinkedIn", path: "linkedin.com/in/arielle-revis", href: linkedInUrl },
  { id: "resume", title: "Resume", path: "Arielle-Revis-Resume.pdf", href: resumeUrl },
];

export function ActivityBar({ activeIcon, onIconClick }: ActivityBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return searchItems;
    }

    return searchItems.filter((item) => {
      return `${item.title} ${item.path} ${item.keywords ?? ""}`
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [query]);

  useEffect(() => {
    if (!isSearchOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isSearchOpen]);

  const handleSearchSelect = (item: SearchItem) => {
    setIsSearchOpen(false);

    if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }

    const route = item.route;
    if (!route) return;

    onIconClick(route);
  };

  const buttonClass = (isActive: boolean) =>
    cn(
      "relative w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-150",
      "hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60",
      isActive
        ? "text-accent-blue border-l-2 border-accent-blue bg-accent-blue-soft"
        : "text-muted-foreground hover:text-foreground"
    );

  return (
    <div className="relative w-14 bg-activity-bar flex flex-col items-center py-2 border-r border-border">
      <div className="flex flex-col gap-1 flex-1">
        <button
          onClick={() => onIconClick("explorer")}
          className={buttonClass(activeIcon === "explorer")}
          aria-label="Toggle explorer"
          aria-pressed={activeIcon === "explorer"}
        >
          <Files className="w-5 h-5" />
        </button>

        <button
          onClick={() => {
            setIsSearchOpen((open) => !open);
            onIconClick("search");
          }}
          className={buttonClass(isSearchOpen || activeIcon === "search")}
          aria-label="Search portfolio"
          aria-expanded={isSearchOpen}
          aria-controls="portfolio-search-panel"
        >
          <Search className="w-5 h-5" />
        </button>

        <a
          href={portfolioUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onIconClick("portfolio")}
          className={buttonClass(activeIcon === "portfolio")}
          aria-label="Open portfolio repo"
        >
          <Globe className="w-5 h-5" />
        </a>
      </div>

      <div className="flex flex-col gap-1">
        <button
          onClick={() => {
            onIconClick("contact");
          }}
          className={buttonClass(activeIcon === "contact" || activeIcon === "profile")}
          aria-label="Open contact page"
        >
          <User className="w-5 h-5" />
        </button>

        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onIconClick("linkedin")}
          className={buttonClass(activeIcon === "linkedin")}
          aria-label="Open LinkedIn profile"
        >
          <span className="font-mono text-sm font-semibold">in</span>
        </a>

        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onIconClick("resume")}
          className={buttonClass(activeIcon === "resume")}
          aria-label="Open resume PDF"
        >
          <FileText className="w-5 h-5" />
        </a>
      </div>

      {isSearchOpen && (
        <div
          ref={searchRef}
          id="portfolio-search-panel"
          className="absolute left-14 top-2 z-50 w-[min(22rem,calc(100vw-4.5rem))] rounded-lg border border-border bg-panel/95 p-3 shadow-2xl shadow-black/40 backdrop-blur"
          role="dialog"
          aria-label="Search portfolio"
        >
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Search className="w-4 h-4 text-accent-blue" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoFocus
              placeholder="Search files, links, sections..."
              className="min-w-0 flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60 rounded"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 max-h-72 overflow-y-auto">
            {filteredItems.length > 0 ? (
              <div className="space-y-1">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSearchSelect(item)}
                    className="group w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent-blue-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/60"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-foreground group-hover:text-accent-blue-bright">
                        {item.title}
                      </span>
                      {item.href && (
                        <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent-blue" />
                      )}
                    </div>
                    <div className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                      {item.path}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-elevated/50 px-3 py-4 text-sm text-muted-foreground">
                No matching files.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
