"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, FileText, Files, GitBranch, Search, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityBarProps {
  activeIcon: string;
  onIconClick: (icon: string) => void;
}

const githubUrl = "https://github.com/ariellerevis/";
const linkedInUrl = "https://www.linkedin.com/in/arielle-revis/";
const resumeUrl = "/Arielle-Revis-Resume.pdf";

type SearchItem =
  | { id: string; title: string; path: string; route: string; href?: never }
  | { id: string; title: string; path: string; href: string; route?: never };

const searchItems: SearchItem[] = [
  { id: "about", title: "About", path: "~/portfolio/about.md", route: "about" },
  { id: "projects", title: "Projects", path: "~/portfolio/projects/", route: "projects" },
  { id: "experience", title: "Experience", path: "~/portfolio/experience/roles.md", route: "experience" },
  { id: "skills", title: "Skills", path: "~/portfolio/skills/", route: "skills" },
  { id: "contact", title: "Contact", path: "~/portfolio/contact.md", route: "contact" },
  { id: "github", title: "GitHub", path: "github.com/ariellerevis", href: githubUrl },
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
      return `${item.title} ${item.path}`.toLowerCase().includes(normalizedQuery);
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

  const emitExplorerToggle = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("portfolio:toggle-explorer"));
    }
  };

  const emitExplorerOpen = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("portfolio:open-explorer"));
    }
  };

  const handleSearchSelect = (item: SearchItem) => {
    setIsSearchOpen(false);

    if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }

    const route = item.route;
    if (!route) return;

    if (route === "about") {
      emitExplorerOpen();
    }

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
          onClick={() => {
            emitExplorerToggle();
            onIconClick("explorer");
          }}
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
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onIconClick("github")}
          className={buttonClass(activeIcon === "github")}
          aria-label="Open GitHub profile"
        >
          <GitBranch className="w-5 h-5" />
        </a>
      </div>

      <div className="flex flex-col gap-1">
        <button
          onClick={() => {
            emitExplorerOpen();
            onIconClick("about");
          }}
          className={buttonClass(activeIcon === "about" || activeIcon === "profile")}
          aria-label="Open about page"
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
