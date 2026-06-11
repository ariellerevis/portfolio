"use client";

import { useCallback, useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { ActivityBar } from "./activity-bar";
import { AssistantPanel } from "./assistant-panel";
import { ExplorerSidebar } from "./explorer-sidebar";
import { MainWorkspace } from "./main-workspace";
import { MobileAssistantContent } from "./mobile-assistant";
import { MobileAssistantSheet } from "./mobile-components";
import { MobileTerminalSheet } from "./mobile-terminal";
import { StatusBar } from "./status-bar";
import { Terminal } from "./terminal";

const sectionByFile: Record<string, string> = {
  about: "about",
  projects: "projects",
  "project-workflow": "projects",
  "project-automation": "projects",
  "project-design": "projects",
  "case-studies": "projects",
  experience: "experience",
  roles: "experience",
  impact: "experience",
  skills: "skills",
  "skill-product": "skills",
  "skill-design": "skills",
  "skill-engineering": "skills",
  contact: "contact",
};

const pathBySection: Record<string, string> = {
  home: "~/portfolio/about.md",
  about: "~/portfolio/about.md",
  projects: "~/portfolio/projects/",
  experience: "~/portfolio/experience/roles.md",
  skills: "~/portfolio/skills/",
  contact: "~/portfolio/contact.md",
};

function openResume() {
  window.open("/Arielle-Revis-Resume.pdf", "_blank", "noopener,noreferrer");
}

export function PortfolioShell() {
  const [activeSection, setActiveSection] = useState("about");
  const [activeFile, setActiveFile] = useState<string | null>("about");
  const [activeIcon, setActiveIcon] = useState("about");
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [explorerCollapsed, setExplorerCollapsed] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [mobileAssistantOpen, setMobileAssistantOpen] = useState(false);
  const [terminalMinimized, setTerminalMinimized] = useState(true);
  const [mobileTerminalOpen, setMobileTerminalOpen] = useState(false);

  const activePath = useMemo(() => {
    return pathBySection[activeSection] ?? pathBySection.about;
  }, [activeSection]);

  const navigateToSection = useCallback((section: string) => {
    const nextSection = section === "home" ? "about" : section;

    if (nextSection === "resume") {
      openResume();
      return;
    }

    setActiveSection(nextSection);
    setActiveFile(nextSection === "about" ? "about" : nextSection);
    setActiveIcon(nextSection);
  }, []);

  const handleFileClick = useCallback((fileId: string) => {
    if (fileId === "resume") {
      openResume();
      return;
    }

    const section = sectionByFile[fileId] ?? "about";
    setActiveFile(fileId);
    setActiveSection(section);
    setActiveIcon(section);
  }, []);

  const handleIconClick = useCallback((icon: string) => {
    if (icon === "explorer") {
      setExplorerCollapsed((current) => {
        const nextCollapsed = !current;
        setActiveIcon(nextCollapsed ? activeSection : "explorer");
        return nextCollapsed;
      });
      return;
    }

    setActiveIcon(icon);

    if (icon === "about" || icon === "profile") {
      setActiveSection("about");
      setActiveFile("about");
      return;
    }

    if (icon === "resume") {
      openResume();
      return;
    }

    if (sectionByFile[icon]) {
      setActiveSection(sectionByFile[icon]);
      setActiveFile(icon);
    }
  }, [activeSection]);

  const toggleExplorer = useCallback(() => {
    setExplorerCollapsed((current) => {
      const nextCollapsed = !current;
      setActiveIcon(nextCollapsed ? activeSection : "explorer");
      return nextCollapsed;
    });
  }, [activeSection]);

  const isAssistantVisible = assistantOpen || mobileAssistantOpen;
  const isTerminalVisible = !terminalMinimized || mobileTerminalOpen;

  const toggleAssistant = useCallback(() => {
    const nextOpen = !isAssistantVisible;

    setAssistantOpen(nextOpen);
    setMobileAssistantOpen(nextOpen);
  }, [isAssistantVisible]);

  const closeAssistant = useCallback(() => {
    setAssistantOpen(false);
    setMobileAssistantOpen(false);
  }, []);

  const toggleTerminal = useCallback(() => {
    const nextOpen = !isTerminalVisible;

    setTerminalMinimized(!nextOpen);
    setMobileTerminalOpen(nextOpen);
  }, [isTerminalVisible]);

  return (
    <div className="flex h-screen overflow-hidden bg-workspace text-foreground">
      <ActivityBar activeIcon={activeIcon} onIconClick={handleIconClick} />

      <div className="fixed inset-y-0 left-14 z-40 lg:static lg:z-auto">
        <ExplorerSidebar
          activeFile={activeFile}
          onFileClick={handleFileClick}
          isCollapsed={explorerCollapsed}
          onCollapsedChange={setExplorerCollapsed}
        />
      </div>

      {!explorerCollapsed && (
        <button
          className="fixed inset-0 left-14 z-30 bg-black/50 lg:hidden"
          aria-label="Close explorer"
          onClick={() => setExplorerCollapsed(true)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <MainWorkspace
          activeSection={activeSection}
          onNavigate={navigateToSection}
          onToggleExplorer={toggleExplorer}
          onToggleAssistant={toggleAssistant}
          onToggleTerminal={toggleTerminal}
          isExplorerOpen={!explorerCollapsed}
          isAssistantOpen={isAssistantVisible}
          isTerminalOpen={isTerminalVisible}
        />
        <div className="hidden lg:block">
          <Terminal
            currentPath={currentPath}
            onPathChange={setCurrentPath}
            onNavigate={navigateToSection}
            onOpenFile={handleFileClick}
            isMinimized={terminalMinimized}
            onMinimizedChange={(nextMinimized) => {
              setTerminalMinimized(nextMinimized);
              if (nextMinimized) {
                setMobileTerminalOpen(false);
              }
            }}
          />
        </div>
        <StatusBar activeSection={activeSection} activePath={activePath} />
      </div>

      <div className="hidden lg:flex">
        <AssistantPanel
          isOpen={assistantOpen || mobileAssistantOpen}
          onOpen={() => {
            setAssistantOpen(true);
            setMobileAssistantOpen(true);
          }}
          onClose={closeAssistant}
        />
      </div>

      {!mobileAssistantOpen && (
        <button
          onClick={() => setMobileAssistantOpen(true)}
          className="fixed bottom-20 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-accent-blue/70 bg-panel text-accent-blue shadow-[0_16px_44px_rgba(0,0,0,0.42)] ring-1 ring-accent-blue/25 transition-all hover:-translate-y-0.5 hover:border-accent-blue hover:text-accent-blue-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/70 lg:hidden"
          aria-label="Open assistant"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      <MobileAssistantSheet
        isOpen={mobileAssistantOpen}
        onClose={closeAssistant}
      >
        <MobileAssistantContent onClose={closeAssistant} />
      </MobileAssistantSheet>

      <MobileTerminalSheet
        isOpen={mobileTerminalOpen}
        onClose={() => {
          setMobileTerminalOpen(false);
          setTerminalMinimized(true);
        }}
        currentPath={currentPath}
        onPathChange={setCurrentPath}
        onNavigate={navigateToSection}
        onOpenFile={handleFileClick}
      />
    </div>
  );
}
