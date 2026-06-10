import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project } from '../types/dashboard';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (p: Project) => void;
  onDeleteProject: (id: string) => void;
  onRenameProject: (id: string, name: string) => void;
  onNewProject: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  userName: string;
  credits: number;
  onSignOut: () => void;
  projectsLoading?: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function ProjectItem({
  project,
  active,
  onSelect,
  onDelete,
  onRename,
}: {
  project: Project;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (name: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState(project.name);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  function submitRename() {
    const trimmed = editVal.trim();
    if (trimmed && trimmed !== project.name) onRename(trimmed);
    else setEditVal(project.name);
    setEditing(false);
  }

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
    >
      <div
        onClick={onSelect}
        className={`flex items-center gap-2.5 px-3 py-2.5 cursor-none transition-colors duration-150 ${active ? 'bg-pitch text-paper' : 'hover:bg-pitch-5 text-pitch'
          }`}
      >
        {/* Status dot */}
        <div className={`w-1 h-1 rounded-full flex-shrink-0 ${active ? 'bg-blueprint' : 'bg-pitch-40'}`} />

        {/* Name */}
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              ref={inputRef}
              value={editVal}
              onChange={(e) => setEditVal(e.target.value)}
              onBlur={submitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitRename();
                if (e.key === 'Escape') { setEditVal(project.name); setEditing(false); }
              }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full bg-transparent font-mono text-[11px] outline-none border-b ${active ? 'border-paper/40 text-paper' : 'border-pitch-40 text-pitch'}`}
              style={{ cursor: 'none' }}
            />
          ) : (
            <p className={`font-mono text-[11px] truncate leading-tight ${active ? 'text-paper' : 'text-pitch'}`}>
              {project.name}
            </p>
          )}
          <p className={`font-mono text-[9px] mt-0.5 ${active ? 'text-paper/40' : 'text-pitch-40'}`}>
            {timeAgo(project.updatedAt)} · v{project.versionHistory.length}
          </p>
        </div>

        {/* Context menu trigger */}
        <AnimatePresence>
          {(hovered || menuOpen) && !editing && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
              className={`flex-shrink-0 w-5 h-5 flex items-center justify-center hover:bg-pitch-10 rounded-sm ${active ? 'text-paper/60 hover:bg-white/10' : ''}`}
              style={{ cursor: 'none' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <circle cx="2" cy="6" r="1" />
                <circle cx="6" cy="6" r="1" />
                <circle cx="10" cy="6" r="1" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            className="absolute right-2 top-full z-50 bg-paper border border-pitch-10 shadow-sm min-w-[140px] py-1"
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
          >
            <button
              className="w-full flex items-center gap-2.5 px-3 py-2 font-mono text-[10px] text-pitch hover:bg-pitch-5 text-left"
              onClick={(e) => { e.stopPropagation(); setMenuOpen(false); setEditing(true); }}
              style={{ cursor: 'none' }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M7 1.5l1.5 1.5L3 8.5H1.5V7L7 1.5z" />
              </svg>
              Rename
            </button>
            <div className="h-px bg-pitch-10 mx-2 my-1" />
            <button
              className="w-full flex items-center gap-2.5 px-3 py-2 font-mono text-[10px] hover:bg-pitch-5 text-left"
              style={{ color: '#FF4400', cursor: 'none' }}
              onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(); }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M1.5 3h7M4 3V1.5h2V3M2.5 3l.5 5.5h4l.5-5.5" />
              </svg>
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Sidebar({
  projects, activeProjectId, onSelectProject, onDeleteProject, onRenameProject,
  onNewProject, collapsed, onToggleCollapse, userName, credits, onSignOut, projectsLoading,
}: SidebarProps) {
  const [search, setSearch] = useState('');

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Group by date
  const now = Date.now();
  const today = filtered.filter((p) => now - new Date(p.updatedAt).getTime() < 86_400_000);
  const thisWeek = filtered.filter((p) => {
    const age = now - new Date(p.updatedAt).getTime();
    return age >= 86_400_000 && age < 7 * 86_400_000;
  });
  const older = filtered.filter((p) => now - new Date(p.updatedAt).getTime() >= 7 * 86_400_000);

  function renderGroup(label: string, list: Project[]) {
    if (!list.length) return null;
    return (
      <div key={label} className="mb-4">
        <div className="px-3 py-1.5 font-mono text-[9px] text-pitch-40 uppercase tracking-[0.15em]">
          {label}
        </div>
        {list.map((p) => (
          <ProjectItem
            key={p._id}
            project={p}
            active={p._id === activeProjectId}
            onSelect={() => onSelectProject(p)}
            onDelete={() => onDeleteProject(p._id)}
            onRename={(name) => onRenameProject(p._id, name)}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.aside
      className="flex flex-col h-full bg-paper border-r border-pitch-10 overflow-hidden flex-shrink-0"
      animate={{ width: collapsed ? 48 : 260 }}
      transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 h-14 border-b border-pitch-10 flex-shrink-0">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="relative w-4 h-4 flex-shrink-0">
                <div className="absolute inset-0 border border-pitch" />
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-blueprint -translate-x-1/2 -translate-y-1/2" />
              </div>
              <span className="font-mono text-[11px] tracking-[0.15em] uppercase text-pitch">Kairo</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onToggleCollapse}
          className="w-7 h-7 flex items-center justify-center hover:bg-pitch-5 transition-colors border border-pitch-10 ml-auto"
          style={{ cursor: 'none' }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            width="10" height="10" viewBox="0 0 10 10"
            fill="none" stroke="#0A0A0A" strokeWidth="1.5"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
          >
            <path d="M7 2L3 5l4 3" />
          </svg>
        </button>
      </div>

      {/* Collapsed state: just icons */}
      {collapsed ? (
        <div className="flex flex-col items-center gap-2 pt-3 px-2">
          <button
            onClick={onNewProject}
            className="w-8 h-8 flex items-center justify-center border border-pitch-10 hover:bg-pitch hover:border-pitch hover:text-paper text-pitch transition-all"
            title="New project"
            style={{ cursor: 'none' }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5.5 1v9M1 5.5h9" />
            </svg>
          </button>
        </div>
      ) : (
        <>
          {/* New project button */}
          <div className="px-3 pt-4 pb-2 flex-shrink-0">
            <button
              onClick={onNewProject}
              className="btn-swiss w-full justify-center py-2.5 text-[10px]"
              style={{ cursor: 'none' }}
            >
              <span className="flex items-center gap-2">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4.5 0.5v8M0.5 4.5h8" />
                </svg>
                New Project
              </span>
            </button>
          </div>

          {/* Search */}
          <div className="px-3 pb-3 flex-shrink-0">
            <div className="relative border border-pitch-10 focus-within:border-pitch-40 transition-colors">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-pitch-40" width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.3">
                <circle cx="4" cy="4" r="3" />
                <path d="M7 7l2 2" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full bg-transparent pl-7 pr-3 py-2 font-mono text-[10px] text-pitch placeholder:text-pitch-40 outline-none"
                style={{ cursor: 'none' }}
              />
            </div>
          </div>

          {/* Project list */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {projectsLoading ? (
              // Loading skeleton
              <div className="px-3 pt-2 flex flex-col gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-2.5 px-0 py-2.5">
                    <div className="w-1 h-1 rounded-full bg-pitch-10 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-2 bg-pitch-10 rounded-sm mb-1.5" style={{ width: `${55 + i * 10}%` }} />
                      <div className="h-1.5 bg-pitch-5 rounded-sm" style={{ width: '40%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="px-3 py-6 text-center">
                <p className="font-mono text-[10px] text-pitch-40 leading-relaxed">
                  No projects yet.
                  <br />Start building above.
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-3 py-4">
                <p className="font-mono text-[10px] text-pitch-40">No results for "{search}"</p>
              </div>
            ) : (
              <>
                {renderGroup('Today', today)}
                {renderGroup('This Week', thisWeek)}
                {renderGroup('Older', older)}
              </>
            )}
          </div>

          {/* Bottom user bar */}
          <div className="border-t border-pitch-10 px-3 py-3 flex-shrink-0">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-6 h-6 bg-pitch flex items-center justify-center flex-shrink-0">
                <span className="font-mono text-[9px] text-paper uppercase">
                  {userName.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] text-pitch truncate">{userName}</p>
                <p className="font-mono text-[9px] text-pitch-40">{credits} credits</p>
              </div>
            </div>
            <button
              onClick={onSignOut}
              className="w-full text-left font-mono text-[10px] text-pitch-40 hover:text-pitch transition-colors py-1 flex items-center gap-2"
              style={{ cursor: 'none' }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M3.5 2H2a.5.5 0 00-.5.5v5A.5.5 0 002 8h1.5M6 3.5L8 5m0 0L6 6.5M8 5H4" />
              </svg>
              Sign out
            </button>
          </div>
        </>
      )}
    </motion.aside>
  );
}
