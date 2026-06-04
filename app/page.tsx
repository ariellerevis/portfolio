"use client";

import { useState, useCallback } from "react";
import { MessageCircle } from "lucide-react";
import { ActivityBar } from "@/components/ide/activity-bar";
import { ExplorerSidebar } from "@/components/ide/explorer-sidebar";
import { MainWorkspace } from "@/components/ide/main-workspace";
import { AssistantPanel } from "@/components/ide/assistant-panel";
import { Terminal } from "@/components/ide/terminal";
import { MobileHeader, MobileDrawer, MobileAssistantSheet } from "@/components/ide/mobile-components";
import { MobileAssistantContent } from "@/components/ide/mobile-assistant";
import { MobileTerminalSheet } from "@/components/ide/mobile-terminal";
import { FileTree, type FileItem } from "@/components/ide/file-tree";

// File ID to section mapping
const fileToSection: Record<string, string> = {
  about: "about",
  "project-workflow": "projects",
  "project-automation": "projects",
  "project-design": "projects",
  "case-studies": "projects",
  projects: "projects",
  roles: "experience",
  impact: "experience",
  experience: "experience",
  "skill-product": "skills",
  "skill-design": "skills",
  "skill-engineering": "skills",
  skills: "skills",
  notes: "writing",
  writing: "writing",
  contact: "contact",
  resume: "contact",
};

// Section to file ID mapping (reverse lookup for first file in section)
const sectionToFile: Record<string, string> = {
  about: "about",
  projects: "projects",
  experience: "experience",
  skills: "skills",
  writing: "writing",
  contact: "contact",
  home: "",
};

// File ID to terminal path mapping
const fileToTerminalPath: Record<string, string[]> = {
  home: [],
  about: [],
  projects: ["projects"],
  "project-workflow": ["projects"],
  "project-automation": ["projects"],
  "project-design": ["projects"],
  "case-studies": ["projects"],
  experience: ["experience"],
  roles: ["experience"],
  impact: ["experience"],
  skills: ["skills"],
  "skill-product": ["skills"],
  "skill-design": ["skills"],
  "skill-engineering": ["skills"],
  writing: ["writing"],
  notes: ["writing"],
  contact: [],
  resume: [],
};

// File ID to path mapping for status bar
const fileToPaths: Record<string, string> = {
  home: "~/portfolio",
  about: "~/portfolio/about.md",
  projects: "~/portfolio/projects/",
  "project-workflow": "~/portfolio/projects/workflow-dashboard.tsx",
  "project-automation": "~/portfolio/projects/automation-engine.tsx",
  "project-design": "~/portfolio/projects/design-system.tsx",
  "case-studies": "~/portfolio/projects/case-studies.json",
  experience: "~/portfolio/experience/",
  roles: "~/portfolio/experience/roles.md",
  impact: "~/portfolio/experience/impact.md",
  skills: "~/portfolio/skills/",
  "skill-product": "~/portfolio/skills/product.ts",
  "skill-design": "~/portfolio/skills/design.css",
  "skill-engineering": "~/portfolio/skills/engineering.js",
  writing: "~/portfolio/writing/",
  notes: "~/portfolio/writing/notes.md",
  contact: "~/portfolio/contact.md",
  resume: "~/portfolio/resume.pdf",
};

const portfolioTree: FileItem[] = [
  { id: "about", name: "about.md", type: "file", extension: "md" },
  {
    id: "projects",
    name: "projects",
    type: "folder",
    children: [
      { id: "project-workflow", name: "workflow-dashboard.tsx", type: "file", extension: "tsx" },
      { id: "project-automation", name: "automation-engine.tsx", type: "file", extension: "tsx" },
      { id: "project-design", name: "design-system.tsx", type: "file", extension: "tsx" },
      { id: "case-studies", name: "case-studies.json", type: "file", extension: "json" },
    ],
  },
  {
    id: "experience",
    name: "experience",
    type: "folder",
    children: [
      { id: "roles", name: "roles.md", type: "file", extension: "md" },
      { id: "impact", name: "impact.md", type: "file", extension: "md" },
    ],
  },
  {
    id: "skills",
    name: "skills",
    type: "folder",
    children: [
      { id: "skill-product", name: "product.ts", type: "file", extension: "ts" },
      { id: "skill-design", name: "design.css", type: "file", extension: "css" },
      { id: "skill-engineering", name: "engineering.js", type: "file", extension: "js" },
    ],
  },
  {
    id: "writing",
    name: "writing",
    type: "folder",
    children: [
      { id: "notes", name: "notes.md", type: "file", extension: "md" },
    ],
  },
  { id: "contact", name: "contact.md", type: "file", extension: "md" },
  { id: "resume", name: "resume.pdf", type: "file", extension: "pdf" },
];

export default function Portfolio() {
  const [activeIcon, setActiveIcon] = useState("explorer");
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("home");
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAssistantOpen, setMobileAssistantOpen] = useState(false);
  const [mobileTerminalOpen, setMobileTerminalOpen] = useState(false);
  const [terminalPath, setTerminalPath] = useState<string[]>([]);

  const handleFileClick = useCallback((fileId: string) => {
    setActiveFile(fileId);
    const section = fileToSection[fileId] || "home";
    setActiveSection(section);
    // Update terminal path to match
    const newPath = fileToTerminalPath[fileId] || [];
    setTerminalPath(newPath);
    setMobileMenuOpen(false);
  }, []);

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section);
    // Find first file that matches this section
    const fileId = sectionToFile[section] || Object.entries(fileToSection).find(([, s]) => s === section)?.[0];
    if (fileId) {
      setActiveFile(fileId);
      // Update terminal path
      const newPath = fileToTerminalPath[fileId] || [];
      setTerminalPath(newPath);
    }
  }, []);

  const handleOpenAssistant = useCallback(() => {
    // On mobile, open the mobile sheet
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileTerminalOpen(false); // Close terminal if open
      setMobileAssistantOpen(true);
    } else {
      setAssistantOpen(true);
    }
  }, []);

  const handleOpenMobileTerminal = useCallback(() => {
    setMobileAssistantOpen(false); // Close assistant if open
    setMobileTerminalOpen(true);
  }, []);

  // Terminal navigation handlers
  const handleTerminalPathChange = useCallback((newPath: string[]) => {
    setTerminalPath(newPath);
  }, []);

  const handleTerminalNavigate = useCallback((route: string) => {
    // Map terminal route to section
    const section = fileToSection[route] || route;
    setActiveSection(section);
    const fileId = sectionToFile[section] || route;
    if (fileId) {
      setActiveFile(fileId);
    }
  }, []);

  const handleTerminalOpenFile = useCallback((fileId: string) => {
    setActiveFile(fileId);
    const section = fileToSection[fileId] || "home";
    setActiveSection(section);
  }, []);

  const activePath = fileToPaths[activeFile || "home"] || "~/portfolio";

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Mobile Header */}
      <MobileHeader
        onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        onAssistantClick={() => {
          setMobileTerminalOpen(false);
          setMobileAssistantOpen(true);
        }}
        onTerminalClick={handleOpenMobileTerminal}
        menuOpen={mobileMenuOpen}
      />

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <div className="p-3 border-b border-border">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-accent-blue">
            Portfolio
          </h2>
        </div>
        <div className="overflow-y-auto flex-1">
          <FileTree
            items={portfolioTree}
            activeFile={activeFile}
            onFileClick={handleFileClick}
          />
        </div>
      </MobileDrawer>

      {/* Mobile Assistant Sheet */}
      <MobileAssistantSheet isOpen={mobileAssistantOpen} onClose={() => setMobileAssistantOpen(false)}>
        <MobileAssistantContent onClose={() => setMobileAssistantOpen(false)} />
      </MobileAssistantSheet>

      {/* Mobile Terminal Sheet */}
      <MobileTerminalSheet
        isOpen={mobileTerminalOpen}
        onClose={() => setMobileTerminalOpen(false)}
        currentPath={terminalPath}
        onPathChange={handleTerminalPathChange}
        onNavigate={handleTerminalNavigate}
        onOpenFile={handleTerminalOpenFile}
      />

      {/* Desktop Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar - hidden on mobile */}
        <div className="hidden lg:block">
          <ActivityBar activeIcon={activeIcon} onIconClick={setActiveIcon} />
        </div>

        {/* Explorer Sidebar - hidden on mobile */}
        <div className="hidden lg:block">
          <ExplorerSidebar activeFile={activeFile} onFileClick={handleFileClick} />
        </div>

        {/* Main content area with workspace and terminal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Main Workspace */}
          <MainWorkspace 
            activeSection={activeSection} 
            onNavigate={handleNavigate}
            onOpenAssistant={handleOpenAssistant}
          />

          {/* Terminal - desktop only */}
          <div className="hidden lg:block">
            <Terminal
              currentPath={terminalPath}
              onPathChange={handleTerminalPathChange}
              onNavigate={handleTerminalNavigate}
              onOpenFile={handleTerminalOpenFile}
            />
          </div>
        </div>

        {/* Assistant Panel - desktop only */}
        <div className="hidden lg:block">
          <AssistantPanel isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />
        </div>

        {/* Floating Assistant Button when panel is closed - desktop only */}
        {!assistantOpen && (
          <button
            onClick={() => setAssistantOpen(true)}
            className="hidden lg:flex fixed bottom-48 right-6 w-12 h-12 bg-accent-blue rounded-full items-center justify-center shadow-lg hover:bg-accent-blue-bright transition-colors z-50"
            aria-label="Open assistant"
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
