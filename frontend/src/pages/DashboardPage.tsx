import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../lib/api';
import CustomCursor from '../components/CustomCursor';
import Sidebar from '../components/Sidebar';
import { PromptBox, SampleCards } from '../components/PromptBox';
import type { Project } from '../types/dashboard';

/* ── Empty / Welcome State ─────────────────────────── */
function WelcomeState({ userName }: { userName: string }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="font-mono text-[10px] text-blueprint uppercase tracking-[0.2em] mb-4">
        ↳ New session
      </div>
      <h1
        className="font-sans font-black text-pitch mb-3"
        style={{ fontSize: 'clamp(32px, 4vw, 56px)', letterSpacing: '-0.05em', lineHeight: 1 }}
      >
        {greeting},{' '}
        <span className="text-pitch-40">{userName.split(' ')[0]}.</span>
      </h1>
      <p className="font-sans text-sm text-pitch-40 max-w-sm mx-auto leading-relaxed">
        Describe the website you want to build. Kairo generates it in seconds.
      </p>
    </motion.div>
  );
}

/* ── Active Project State ─────────────────────────── */
function ActiveProjectHeader({ project }: { project: Project }) {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      key={project._id}
      transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="font-mono text-[10px] text-blueprint uppercase tracking-[0.2em] mb-3">
        ↺ Iterating on project
      </div>
      <h1
        className="font-sans font-black text-pitch mb-2 truncate max-w-lg mx-auto"
        style={{ fontSize: 'clamp(24px, 3vw, 40px)', letterSpacing: '-0.04em', lineHeight: 1 }}
      >
        {project.name}
      </h1>
      <div className="flex items-center justify-center gap-4 mt-2">
        <span className="font-mono text-[9px] text-pitch-40">
          v{project.versionHistory.length} · {project.versionHistory.length} generation{project.versionHistory.length !== 1 ? 's' : ''}
        </span>
        {project.currentCode && (
          <span className="font-mono text-[9px] text-pitch-40">
            {(project.currentCode.length / 1000).toFixed(1)}k chars
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ── StreamOutput removed — streaming now happens in EditorPage ── */

/* ── Dashboard Page ────────────────────────────────── */
export default function DashboardPage() {
  const { user, token, isLoading, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Fetch projects once auth context has resolved and token exists
  useEffect(() => {
    if (!isLoading && token) {
      loadProjects();
    } else if (!isLoading && !token) {
      setProjectsLoading(false);
    }
  }, [isLoading, token]);

  async function loadProjects() {
    setProjectsLoading(true);
    try {
      const res = await fetchWithAuth('/project');
      const data = await res.json();
      if (res.ok && data.response) {
        setProjects(data.response.sort(
          (a: Project, b: Project) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ));
      }
    } catch (e) {
      console.error('Failed to load projects', e);
    } finally {
      setProjectsLoading(false);
    }
  }

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleSignOut() {
    logout();
    navigate('/');
  }

  function handleNewProject() {
    setActiveProject(null);
    setPrompt('');
    setError(null);
  }

  function handleSelectProject(p: Project) {
    setActiveProject(p);
    setPrompt('');
    setError(null);
  }

  async function handleDeleteProject(id: string) {
    try {
      const res = await fetchWithAuth(`/project/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((ps) => ps.filter((p) => p._id !== id));
        if (activeProject?._id === id) handleNewProject();
        showToast('Project deleted');
      } else {
        showToast('Failed to delete project', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
  }

  async function handleRenameProject(id: string, name: string) {
    try {
      const res = await fetchWithAuth(`/project/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        setProjects((ps) => ps.map((p) => p._id === id ? { ...p, name } : p));
        if (activeProject?._id === id) setActiveProject((p) => p ? { ...p, name } : p);
        showToast('Project renamed');
      }
    } catch {
      showToast('Failed to rename', 'error');
    }
  }

  async function handleGenerate() {
    if (!prompt.trim() || loading || (user?.credits ?? 0) < 2) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          projectId: activeProject?._id ?? undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || data.msg || 'Generation failed. Please try again.');
        return;
      }

      // TODO: navigate to /editor/:projectId — streaming will happen there
      // navigate(`/editor/${projectId}`);

    } catch {
      setError('Network error. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  const credits = user?.credits ?? 0;
  const showSamples = !activeProject && !loading;

  return (
    <>
      <CustomCursor />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed top-4 right-4 z-[9997] px-4 py-3 border font-mono text-[11px] flex items-center gap-3"
            style={{
              background: '#F4F4F2',
              borderColor: toast.type === 'error' ? '#FF4400' : '#0A0A0A',
              color: toast.type === 'error' ? '#FF4400' : '#0A0A0A',
            }}
            initial={{ opacity: 0, y: -8, x: 8 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className={`w-1.5 h-1.5 ${toast.type === 'error' ? 'bg-orange' : 'bg-blueprint'}`} />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layout */}
      <div className="flex h-screen overflow-hidden bg-paper">
        {/* Sidebar */}
        <Sidebar
          projects={projects}
          activeProjectId={activeProject?._id ?? null}
          onSelectProject={handleSelectProject}
          onDeleteProject={handleDeleteProject}
          onRenameProject={handleRenameProject}
          onNewProject={handleNewProject}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
          userName={user?.name ?? ''}
          credits={credits}
          onSignOut={handleSignOut}
          projectsLoading={projectsLoading}
        />

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Top bar */}
          <div className="flex items-center justify-between px-8 h-14 border-b border-pitch-10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-pitch-40 uppercase tracking-[0.2em]">
                {activeProject ? `PRJ / ${activeProject._id.slice(-6).toUpperCase()}` : 'DASHBOARD'}
              </span>
              {activeProject && (
                <>
                  <span className="font-mono text-[10px] text-pitch-40">/</span>
                  <span className="font-mono text-[10px] text-pitch truncate max-w-[200px]">
                    {activeProject.name}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] text-pitch-40">
                {credits} credits
              </span>
              <div className="w-1 h-1 bg-pitch-40 rounded-full" />
              <span className="font-mono text-[10px] text-pitch-40">
                {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-8">

              {/* Header state */}
              <AnimatePresence mode="wait">
                {activeProject ? (
                  <ActiveProjectHeader key={activeProject._id} project={activeProject} />
                ) : (
                  <WelcomeState key="welcome" userName={user?.name ?? 'there'} />
                )}
              </AnimatePresence>

              {/* Error banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="border px-4 py-3 flex items-start gap-3"
                    style={{ borderColor: '#FF4400' }}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                  >
                    <div className="w-1 h-1 mt-1.5 bg-orange flex-shrink-0" style={{ background: '#FF4400' }} />
                    <p className="font-mono text-[11px] flex-1" style={{ color: '#FF4400' }}>{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="font-mono text-[10px] text-pitch-40 hover:text-pitch ml-2"
                      style={{ cursor: 'none' }}
                    >
                      ✕
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Prompt box */}
              <div>
                <PromptBox
                  value={prompt}
                  onChange={setPrompt}
                  onSubmit={handleGenerate}
                  loading={loading}
                  credits={credits}
                  hasActiveProject={!!activeProject}
                />
              </div>



              {/* Sample prompts */}
              <AnimatePresence>
                {showSamples && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  >
                    <SampleCards onSelect={(p) => setPrompt(p)} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom padding */}
              <div className="h-8" />
            </div>
          </div>

          {/* Bottom coord bar */}
          <div className="flex items-center justify-between px-8 py-2 border-t border-pitch-10 flex-shrink-0">
            <span className="font-mono text-[9px] text-pitch-40">BUILD: v0.1.0</span>
            <span className="font-mono text-[9px] text-pitch-40">
              {projects.length} project{projects.length !== 1 ? 's' : ''}
            </span>
            <span className="font-mono text-[9px] text-pitch-40">KAIRO ENGINE</span>
          </div>
        </main>
      </div>
    </>
  );
}
