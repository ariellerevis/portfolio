"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { ChevronUp, X, Terminal as TerminalIcon } from "lucide-react";
import { virtualFileSystem, type FileSystemNode } from "./terminal";

// Terminal history entry type
interface HistoryEntry {
  type: "input" | "output" | "error" | "system";
  content: string;
  path?: string;
}

interface MobileTerminalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string[];
  onPathChange: (path: string[]) => void;
  onNavigate: (route: string) => void;
  onOpenFile: (fileId: string) => void;
}

// Utility functions (same as in terminal.tsx)
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

const quickCommands = [
  { label: "ls", command: "ls" },
  { label: "cd projects", command: "cd projects" },
  { label: "cd skills", command: "cd skills" },
  { label: "cd ..", command: "cd .." },
  { label: "help", command: "help" },
  { label: "clear", command: "clear" },
];

export function MobileTerminalSheet({ 
  isOpen, 
  onClose, 
  currentPath,
  onPathChange,
  onNavigate,
  onOpenFile
}: MobileTerminalSheetProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: "system", content: "Arielle Portfolio Terminal" },
    { type: "system", content: 'type "ls" to explore or use quick commands below' },
    { type: "system", content: "" },
  ]);
  const [internalOpen, setInternalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const sheetIsOpen = isOpen || internalOpen;
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);
  
  // Focus input when opened
  useEffect(() => {
    if (sheetIsOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [sheetIsOpen]);

  useEffect(() => {
    const handleOpen = () => setInternalOpen(true);
    const handleToggle = () => setInternalOpen((current) => !current);

    window.addEventListener("portfolio:open-terminal", handleOpen);
    window.addEventListener("portfolio:toggle-terminal", handleToggle);

    return () => {
      window.removeEventListener("portfolio:open-terminal", handleOpen);
      window.removeEventListener("portfolio:toggle-terminal", handleToggle);
    };
  }, []);

  const handleClose = () => {
    setInternalOpen(false);
    onClose();
  };
  
  // List directory contents (mobile-friendly vertical format)
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
    
    // Stack vertically on mobile
    return items.join("\n");
  }, []);
  
  // Process commands
  const processCommand = useCallback((input: string) => {
    const trimmed = input.trim();
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0]?.toLowerCase();
    const args = parts.slice(1).join(" ");
    
    const currentPathStr = pathToString(currentPath);
    
    setHistory(prev => [...prev, { 
      type: "input", 
      content: trimmed,
      path: currentPathStr
    }]);
    
    if (trimmed) {
      setCommandHistory(prev => [...prev, trimmed]);
    }
    
    if (!cmd) return;
    
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
          setHistory(prev => [...prev, { type: "output", content: `opening ${node.name}` }]);
          if (node.route) {
            onOpenFile(node.route);
          }
          return;
        }
        
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
  cd       change directory
  pwd      print current path
  clear    clear terminal
  help     show commands
  whoami   about arielle`;
        setHistory(prev => [...prev, { type: "output", content: helpText }]);
        break;
      }
      
      case "whoami": {
        setHistory(prev => [...prev, { 
          type: "output", 
          content: "Arielle - RPI ITWS and Business Analytics student building across AI, finance, and full-stack systems."
        }]);
        break;
      }
      
      default: {
        setHistory(prev => [...prev, { 
          type: "error", 
          content: `command not found: ${cmd}\ntype "help" for commands` 
        }]);
      }
    }
  }, [currentPath, listDirectory, onPathChange, onNavigate, onOpenFile]);
  
  const handleSubmit = useCallback(() => {
    processCommand(inputValue);
    setInputValue("");
  }, [inputValue, processCommand]);
  
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }, [handleSubmit]);
  
  const handleQuickCommand = useCallback((command: string) => {
    processCommand(command);
  }, [processCommand]);
  
  const currentPathStr = pathToString(currentPath);

  if (!sheetIsOpen) {
    return null;
  }
  
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity opacity-100"
        onClick={handleClose}
      />
      
      {/* Sheet */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 lg:hidden transition-transform duration-200 flex flex-col bg-terminal rounded-t-2xl max-h-[85vh] translate-y-0"
        role="dialog"
        aria-label="Portfolio terminal"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-terminal-muted/40 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-terminal-border">
          <div>
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-4 h-4 text-terminal-accent" />
              <span className="text-sm font-medium text-terminal-text uppercase tracking-wider">Terminal</span>
            </div>
            <button
              onClick={handleClose}
              className="mt-2 inline-flex items-center gap-2 rounded-md border border-terminal-accent/25 bg-terminal-accent/10 px-2 py-1.5 font-mono text-xs text-terminal-accent transition-colors hover:border-terminal-accent/45 hover:text-accent-blue-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terminal-accent/60"
              aria-pressed="true"
            >
              <ChevronUp className="h-3.5 w-3.5" />
              <span>navigate using terminal</span>
            </button>
          </div>
          <button
            onClick={handleClose}
            className="p-2 -mr-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close terminal"
          >
            <X className="w-5 h-5 text-terminal-muted" />
          </button>
        </div>
        
        {/* Terminal Content */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[13px] leading-relaxed min-h-[200px] sm:text-sm"
        >
          {history.map((entry, i) => (
            <div key={i} className="whitespace-pre-wrap mb-1">
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
          
          {/* Current prompt */}
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-1">
            <span className="max-w-full break-all text-terminal-accent">{currentPathStr}</span>
            <span className="text-terminal-muted">$</span>
            <span className="inline-block h-4 w-2 translate-y-0.5 bg-terminal-accent animate-pulse" aria-hidden="true" />
          </div>
        </div>
        
        {/* Quick Commands */}
        <div className="px-4 py-2 border-t border-terminal-border">
          <div className="flex flex-wrap gap-2">
            {quickCommands.map((qc) => (
              <button
                key={qc.command}
                onClick={() => handleQuickCommand(qc.command)}
                className="px-3 py-1.5 text-xs font-mono bg-terminal-header hover:bg-white/10 text-terminal-text rounded-lg transition-colors"
              >
                {qc.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Input Area */}
        <div className="px-4 py-3 border-t border-terminal-border">
          <div className="flex items-center gap-2 bg-terminal-header rounded-lg px-3 py-2">
            <span className="text-terminal-muted text-sm font-mono">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type command..."
              className="flex-1 bg-transparent text-terminal-text text-sm font-mono outline-none placeholder:text-terminal-muted/50"
              aria-label="Terminal command input"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <button
              onClick={handleSubmit}
              className="px-3 py-1 text-xs font-medium bg-terminal-accent text-white rounded transition-colors hover:bg-terminal-accent/80"
            >
              Run
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
