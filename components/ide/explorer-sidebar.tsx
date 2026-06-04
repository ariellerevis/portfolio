"use client";

import { FileTree, type FileItem } from "./file-tree";

interface ExplorerSidebarProps {
  activeFile: string | null;
  onFileClick: (fileId: string) => void;
}

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

export function ExplorerSidebar({ activeFile, onFileClick }: ExplorerSidebarProps) {
  return (
    <div className="w-56 bg-explorer border-r border-border flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-border">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-accent-blue">
          Portfolio
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <FileTree
          items={portfolioTree}
          activeFile={activeFile}
          onFileClick={onFileClick}
        />
      </div>
    </div>
  );
}
