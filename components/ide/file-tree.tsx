"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, File, FileText, FileCode, FileJson, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileItem[];
  extension?: string;
}

interface FileTreeProps {
  items: FileItem[];
  activeFile: string | null;
  onFileClick: (fileId: string) => void;
}

function getExtensionColor(extension?: string) {
  switch (extension) {
    case "tsx":
    case "ts":
      return "text-blue-400";
    case "js":
      return "text-yellow-400";
    case "css":
      return "text-purple-400";
    case "json":
      return "text-amber-400";
    case "md":
      return "text-gray-400";
    case "pdf":
      return "text-red-400";
    default:
      return "text-muted-foreground";
  }
}

function FileItemIcon({
  item,
  isOpen,
}: {
  item: FileItem;
  isOpen: boolean;
}) {
  const className = cn(
    "w-4 h-4 flex-shrink-0",
    item.type === "folder" ? "text-amber-400" : getExtensionColor(item.extension)
  );

  if (item.type === "folder") {
    return isOpen ? <FolderOpen className={className} /> : <Folder className={className} />;
  }

  switch (item.extension) {
    case "md":
      return <FileText className={className} />;
    case "tsx":
    case "ts":
    case "js":
    case "css":
      return <FileCode className={className} />;
    case "json":
      return <FileJson className={className} />;
    default:
      return <File className={className} />;
  }
}

interface TreeNodeProps {
  item: FileItem;
  depth: number;
  activeFile: string | null;
  onFileClick: (fileId: string) => void;
  openFolders: Set<string>;
  toggleFolder: (folderId: string) => void;
}

function TreeNode({ item, depth, activeFile, onFileClick, openFolders, toggleFolder }: TreeNodeProps) {
  const isOpen = openFolders.has(item.id);
  const isActive = activeFile === item.id;

  return (
    <div>
      <button
        onClick={() => {
          if (item.type === "folder") {
            toggleFolder(item.id);
          } else {
            onFileClick(item.id);
          }
        }}
        className={cn(
          "w-full flex items-center gap-1.5 py-1 px-2 text-sm hover:bg-white/5 rounded transition-colors",
          isActive && "bg-accent-blue-soft text-accent-blue-bright"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {item.type === "folder" && (
          <span className="text-muted-foreground">
            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </span>
        )}
        {item.type === "file" && <span className="w-3.5" />}
        <FileItemIcon item={item} isOpen={isOpen} />
        <span className={cn(
          "truncate",
          isActive ? "text-foreground" : "text-sidebar-foreground"
        )}>
          {item.name}
        </span>
      </button>
      {item.type === "folder" && isOpen && item.children && (
        <div>
          {item.children.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              depth={depth + 1}
              activeFile={activeFile}
              onFileClick={onFileClick}
              openFolders={openFolders}
              toggleFolder={toggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileTree({ items, activeFile, onFileClick }: FileTreeProps) {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  return (
    <div className="py-2">
      {items.map((item) => (
        <TreeNode
          key={item.id}
          item={item}
          depth={0}
          activeFile={activeFile}
          onFileClick={onFileClick}
          openFolders={openFolders}
          toggleFolder={toggleFolder}
        />
      ))}
    </div>
  );
}
