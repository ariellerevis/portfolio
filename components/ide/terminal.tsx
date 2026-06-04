"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { Minus, Square, X, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Virtual File System Structure
export type NodeType = "file" | "directory";

export interface FileSystemNode {
  name: string;
  type: NodeType;
  route?: string;
  children?: FileSystemNode[];
}

// The virtual file system - mirrors the portfolio structure
export const virtualFileSystem: FileSystemNode = {
  name: "arielle",
  type: "directory",
  route: "home",
  children: [
    { name: "about.md", type: "file", route: "about" },
    {
      name: "projects",
      type: "directory",
      route: "projects",
      children: [
        { name: "workflow-dashboard.tsx", type: "file", route: "project-workflow" },
        { name: "automation-engine.tsx", type: "file", route: "project-automation" },
        { name: "design-system.tsx", type: "file", route: "project-design" },
        { name: "case-studies.json", type: "file", route: "case-studies" },
      ],
    },
    {
      name: "experience",
      type: "directory",
      route: "experience",
      children: [
        { name: "roles.md", type: "file", route: "roles" },
        { name: "impact.md", type: "file", route: "impact" },
      ],
    },
    {
      name: "skills",
      type: "directory",
      route: "skills",
      children: [
        { name: "product.ts", type: "file", route: "skill-product" },
        { name: "design.css", type: "file", route: "skill-design" },
        { name: "engineering.js", type: "file", route: "skill-engineering" },
      ],
    },
    {
      name: "writing",
      type: "directory",
      route: "writing",
      children: [
        { name: "notes.md", type: "file", route: "notes" },
      ],
    },
    { name: "contact.md", type: "file", route: "contact" },
    { name: "resume.pdf", type: "file", route: "resume" },
  ],
};

// Terminal history entry type
interface HistoryEntry {
  type: "input" | "output" | "error" | "system";
  content: string;
  path?: string;
}

interface TerminalProps {
  currentPath: string[];
  onPathChange: (path: string[]) => void;
  onNavigate: (route: string) => void;
  onOpenFile: (fileId: string) => void;
  className?: string;
}

// Utility functions for file system navigation
function getNodeAtPath(path: string[]): FileSystemNode | null {
  let current: FileSystemNode = virtualFileSystem;
  
  for (const segment of path) {
    if (segment === "arielle" || segment === "~") continue;
    if (!current.children) return null;
    const child = current.children.find(c => c.name === segment);
    if (!child) return null;
    current = child;
  }
  
  return current;
}

function pathToString(path: string[]): string {
  if (path.length === 0 || (path.length === 1 && path[0] === "arielle")) {
    return "~/arielle";
  }
  return "~/arielle/" + path.filter(p => p !== "arielle").join("/");
}

function resolvePath(currentPath: string[], targetPath: string): string[] | null {
  // Handle absolute paths
  if (targetPath === "~" || targetPath === "~/arielle" || targetPath === "/") {
    return [];
  }
  
  if (targetPath.startsWith("~/arielle/")) {
    const parts = targetPath.slice(10).split("/").filter(Boolean);
    return parts;
  }
  
  if (targetPath.startsWith("~/")) {
    const parts = targetPath.slice(2).split("/").filter(Boolean);
    if (parts[0] === "arielle") parts.shift();
    return parts;
  }
  
  // Handle relative paths
  const parts = targetPath.split("/").filter(Boolean);
  const newPath = [...currentPath];
  
  for (const part of parts) {
    if (part === "..") {
      if (newPath.length > 0) newPath.pop();
    } else if (part === ".") {
      continue;
    } else {
      newPath.push(part);
    }
  }
  
  return newPath;
}

export function Terminal({ 
  currentPath, 
  onPathChange, 
  onNavigate, 
  onOpenFile,
  className 
}: TerminalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: "system", content: "Arielle Portfolio Terminal" },
    { type: "system", content: 'type "ls" to explore, "cd projects" to view work, or "help" for commands.' },
    { type: "system", content: "" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);
  
  // Focus input when terminal is clicked
  const handleTerminalClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);
  
  // List directory contents
  const listDirectory = useCallback((path: string[]): string => {
    const node = getNodeAtPath(path);
    if (!node || node.type !== "directory" || !node.children) {
      return "ls: cannot access: Not a directory";
    }
    
    const items = node.children.map(child => {
      if (child.type === "directory") {
        return `<span class="text-accent-blue">${child.name}/</span>`;
      }
      return child.name;
    });
    
    return items.join("  ");
  }, []);
  
  // Process commands
  const processCommand = useCallback((input: string) => {
    const trimmed = input.trim();
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0]?.toLowerCase();
    const args = parts.slice(1).join(" ");
    
    const currentPathStr = pathToString(currentPath);
    
    // Add input to history
    setHistory(prev => [...prev, { 
      type: "input", 
      content: trimmed,
      path: currentPathStr
    }]);
    
    // Add to command history for arrow navigation
    if (trimmed) {
      setCommandHistory(prev => [...prev, trimmed]);
      setHistoryIndex(-1);
    }
    
    if (!cmd) {
      return;
    }
    
    switch (cmd) {
      case "ls": {
        const targetPath = args ? resolvePath(currentPath, args) : currentPath;
        if (targetPath === null) {
          setHistory(prev => [...prev, { type: "error", content: `ls: cannot access '${args}': No such file or directory` }]);
          return;
        }
        const output = listDirectory(targetPath);
        setHistory(prev => [...prev, { type: "output", content: output }]);
        break;
      }
      
      case "cd": {
        if (!args || args === "~" || args === "~/arielle") {
          onPathChange([]);
          onNavigate("home");
          return;
        }
        
        const newPath = resolvePath(currentPath, args);
        if (newPath === null) {
          setHistory(prev => [...prev, { type: "error", content: `cd: no such file or directory: ${args}` }]);
          return;
        }
        
        const node = getNodeAtPath(newPath);
        if (!node) {
          setHistory(prev => [...prev, { type: "error", content: `cd: no such file or directory: ${args}` }]);
          return;
        }
        
        if (node.type === "file") {
          // Opening a file
          setHistory(prev => [...prev, { type: "output", content: `opening ${node.name}` }]);
          if (node.route) {
            onOpenFile(node.route);
          }
          return;
        }
        
        // It's a directory
        onPathChange(newPath);
        if (node.route) {
          onNavigate(node.route);
        }
        break;
      }
      
      case "pwd": {
        setHistory(prev => [...prev, { type: "output", content: currentPathStr }]);
        break;
      }
      
      case "clear": {
        setHistory([]);
        break;
      }
      
      case "help": {
        const helpText = `commands:
  ls       list files and folders
  cd       change directory or open a section
  pwd      print current path
  clear    clear terminal
  help     show commands
  open     open a file
  whoami   about arielle`;
        setHistory(prev => [...prev, { type: "output", content: helpText }]);
        break;
      }
      
      case "open": {
        if (!args) {
          setHistory(prev => [...prev, { type: "error", content: "open: missing file argument" }]);
          return;
        }
        
        const targetPath = resolvePath(currentPath, args);
        if (targetPath === null) {
          setHistory(prev => [...prev, { type: "error", content: `open: no such file: ${args}` }]);
          return;
        }
        
        const node = getNodeAtPath(targetPath);
        if (!node) {
          setHistory(prev => [...prev, { type: "error", content: `open: no such file: ${args}` }]);
          return;
        }
        
        if (node.type === "directory") {
          setHistory(prev => [...prev, { type: "error", content: `open: ${args} is a directory` }]);
          return;
        }
        
        setHistory(prev => [...prev, { type: "output", content: `opening ${node.name}` }]);
        if (node.route) {
          onOpenFile(node.route);
        }
        break;
      }
      
      case "whoami": {
        setHistory(prev => [...prev, { 
          type: "output", 
          content: "Arielle — builder of useful systems, thoughtful interfaces, and working products." 
        }]);
        break;
      }
      
      default: {
        setHistory(prev => [...prev, { 
          type: "error", 
          content: `command not found: ${cmd}\ntype "help" to see available commands` 
        }]);
      }
    }
  }, [currentPath, listDirectory, onPathChange, onNavigate, onOpenFile]);
  
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processCommand(inputValue);
      setInputValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else {
        setHistoryIndex(-1);
        setInputValue("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Simple autocomplete
      const parts = inputValue.split(/\s+/);
      if (parts.length >= 2) {
        const partial = parts[parts.length - 1];
        const node = getNodeAtPath(currentPath);
        if (node?.children) {
          const matches = node.children.filter(c => c.name.startsWith(partial));
          if (matches.length === 1) {
            parts[parts.length - 1] = matches[0].name;
            setInputValue(parts.join(" "));
          } else if (matches.length > 1) {
            setHistory(prev => [...prev, { 
              type: "output", 
              content: matches.map(m => m.type === "directory" ? `${m.name}/` : m.name).join("  ")
            }]);
          }
        }
      }
    }
  }, [inputValue, commandHistory, historyIndex, processCommand, currentPath]);
  
  const currentPathStr = pathToString(currentPath);
  
  if (isMinimized) {
    return (
      <div className={cn("bg-terminal border-t border-terminal-border", className)}>
        <div className="h-8 bg-terminal-header flex items-center justify-between px-3">
          <span className="text-xs font-medium text-terminal-muted uppercase tracking-wider">Terminal</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Restore terminal"
            >
              <ChevronUp className="w-3.5 h-3.5 text-terminal-muted" />
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "bg-terminal border-t border-terminal-border flex flex-col transition-all duration-200",
        isExpanded ? "h-[280px]" : "h-[180px]",
        className
      )}
      onClick={handleTerminalClick}
      role="region"
      aria-label="Portfolio terminal"
    >
      {/* Terminal Header */}
      <div className="h-8 bg-terminal-header flex items-center justify-between px-3 shrink-0">
        <span className="text-xs font-medium text-terminal-muted uppercase tracking-wider">Terminal</span>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Minimize terminal"
          >
            <Minus className="w-3.5 h-3.5 text-terminal-muted" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label={isExpanded ? "Restore terminal size" : "Maximize terminal"}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-terminal-muted" /> : <Square className="w-3 h-3 text-terminal-muted" />}
          </button>
        </div>
      </div>
      
      {/* Terminal Content */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-2 font-mono text-sm leading-relaxed"
      >
        {history.map((entry, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {entry.type === "input" ? (
              <div>
                <span className="text-terminal-accent">{entry.path}</span>
                <span className="text-terminal-muted"> $ </span>
                <span className="text-terminal-text">{entry.content}</span>
              </div>
            ) : entry.type === "error" ? (
              <div className="text-terminal-error">{entry.content}</div>
            ) : entry.type === "system" ? (
              <div className="text-terminal-muted">{entry.content}</div>
            ) : (
              <div 
                className="text-terminal-text"
                dangerouslySetInnerHTML={{ __html: entry.content }}
              />
            )}
          </div>
        ))}
        
        {/* Current input line */}
        <div className="flex items-center">
          <span className="text-terminal-accent">{currentPathStr}</span>
          <span className="text-terminal-muted"> $ </span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-terminal-text outline-none caret-terminal-accent"
            aria-label="Terminal command input"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
