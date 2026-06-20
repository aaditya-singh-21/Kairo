import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchWithAuth } from '../lib/api';
import CustomCursor from '../components/CustomCursor';
import CodeEditor from '../components/CodeEditor';
import SettingsModal from '../components/SettingsModal';
import type { Project } from '../types/dashboard';

/* ── Preview iframe ─────────────────────────────────── */
// Transforms generated TSX into a self-contained HTML document the iframe can run.
// Strategy:
//   1. Strip import statements — React, hooks, types are provided as globals via CDN
//   2. Strip `export default` — we render App ourselves at the bottom
//   3. Wrap in HTML that loads React 18 + ReactDOM + Babel standalone + Tailwind via CDN
//   4. Babel transpiles JSX→JS at runtime inside the iframe (no build step needed)
function buildIframeHtml(tsxCode: string, isStreaming: boolean = false): string {
  const stripped = tsxCode
    .replace(/^```[\w]*\n?/gm, '')
    .replace(/^```\s*$/gm, '')
    .trim();

  // URL encode it so it contains no quotes, newlines, or <script> tags.
  const encodedCode = encodeURIComponent(stripped);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <style>*, *::before, *::after { box-sizing: border-box; } body { margin: 0; padding: 0; min-height: 100vh; }</style>
</head>
<body>
  <div id="root"></div>

  <script>
    window.addEventListener('load', function () {
      var showError = function (msg) {
        document.getElementById('root').innerHTML =
          '<div style="font-family:monospace;padding:24px;color:#c00;background:#fff1f0;' +
          'border:1px solid #ffa39e;margin:16px;border-radius:6px">' +
          '<b>Preview error</b><br><pre style="white-space:pre-wrap;margin-top:8px">' +
          String(msg).replace(/</g,'&lt;') + '</pre></div>';
      };

      var src;
      try {
        src = decodeURIComponent("${encodedCode}");
      } catch(e) {
        showError('Failed to decode generated code.');
        return;
      }

      var compiled;
      try {
        // Force the App component onto the window object in case the AI didn't export it
        var safeSrc = src + '\\n;if (typeof App !== "undefined") window.App = App;\\n';
        compiled = Babel.transform(safeSrc, {
          // Use env preset so it automatically transpiles all import/export statements
          // Use classic runtime so it outputs React.createElement instead of jsx-runtime
          presets: [['react', { runtime: 'classic' }], ['env', { modules: 'commonjs' }]],
          filename: 'app.jsx'
        }).code;
      } catch (e) {
        if (${isStreaming ? "true" : "false"}) {
          document.getElementById('root').innerHTML =
            '<div style="font-family:monospace;padding:24px;color:#666;background:#f5f5f5;' +
            'border:1px solid #ddd;margin:16px;border-radius:6px;display:flex;align-items:center;justify-content:center;height:calc(100vh - 32px)">' +
            '<div class="animate-pulse"><b>Generating preview...</b></div></div>';
        } else {
          showError('Babel compilation error:\\n' + e.message);
        }
        return;
      }

      try {
        // Provide the CommonJS environment for the compiled code to run in
        window.exports = {};
        window.module = { exports: window.exports };
        window.require = function(mod) {
          if (mod === 'react') return window.React;
          if (mod === 'react-dom' || mod === 'react-dom/client') return window.ReactDOM;
          // Gracefully mock any other missing modules so preview doesn't crash
          return {};
        };

        // Run the compiled code
        (0, eval)(compiled);

        // Babel might have exported App via CommonJS, or it might be a global
        var AppComp = window.exports.default || window.exports.App || window.App;

        if (typeof AppComp === 'undefined') {
          showError('No component named App was found in the generated code.\\nMake sure the AI names the root component App.');
          return;
        }

        ReactDOM.createRoot(document.getElementById('root'))
          .render(React.createElement(AppComp, null));
      } catch (e) {
        showError('Runtime error during component evaluation:\\n' + e.message);
      }
    });
  <\/script>
</body>
</html>`;
}
function PreviewPane({ code, isStreaming }: { code: string; isStreaming: boolean }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce iframe updates during streaming.
  // Each srcdoc assignment triggers a FULL reload of the iframe —
  // React, Babel, and Tailwind CDN are re-downloaded and re-executed.
  // Without debouncing, this happens on every single chunk (~100x/sec),
  // causing the "Layout was forced" flood and a blank preview.
  //
  // During streaming: update the iframe 500ms after the last chunk.
  // After streaming ends: update immediately with the final code.
  useEffect(() => {
    if (!iframeRef.current) return;
    if (!code) {
      iframeRef.current.srcdoc = '';
      return;
    }

    // Clear any pending update
    if (timerRef.current) clearTimeout(timerRef.current);

    if (isStreaming) {
      // During streaming — wait 500ms of silence before updating
      timerRef.current = setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.srcdoc = buildIframeHtml(code, true);
        }
      }, 500);
    } else {
      // Streaming done — update immediately with final code
      iframeRef.current.srcdoc = buildIframeHtml(code, false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [code, isStreaming]);

  return (
    <div className="w-full h-full bg-white relative">
      {!code && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-mono text-[11px] text-pitch-40">
            Preview will appear here once code is generated.
          </p>
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="Preview"
        sandbox="allow-scripts"
        className={`w-full h-full border-0 ${!code ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
}



/* ── EditorPage ─────────────────────────────────────── */
export default function EditorPage() {
  // ── Route data ──
  // projectId comes from the URL path: /editor/:projectId
  // prompt comes from location.state, passed by DashboardPage's navigate()
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const initialPrompt = (location.state as { prompt?: string })?.prompt ?? '';

  // ── Auth ──
  const { user, token, refreshUser } = useAuth();

  // FIX: Keep token in a ref so startGeneration always reads the latest value
  // even though it's called from a useEffect with empty deps (runs once on mount).
  // Without this, if token is null on first render (auth still loading), the
  // fetch goes out with no Authorization header and the backend rejects it.
  const tokenRef = useRef(token);
  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  // ── State ──
  // One code string — grows during streaming, stays complete after.
  // isStreaming controls whether Monaco is read-only and whether the pulsing dot shows.
  const [code, setCode] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [iteratePrompt, setIteratePrompt] = useState('');
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [error, setError] = useState<string | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Track whether the component is still mounted so we don't call setState after unmount.
  const mountedRef = useRef(true);
  // Guards against React Strict Mode double-invoking the generation effect.
  // Unlike a local `let` variable, a ref persists across the mount→cleanup→remount cycle.
  const generationStartedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── Load the project from the backend ──
  // This runs on mount. It fetches the project to get:
  // 1. The project name (for the top bar)
  // 2. currentCode (if user is revisiting an already-generated project)
  // 3. versionHistory (for the version list)
  const loadProject = useCallback(async () => {
    if (!projectId || projectId === 'new') {
      setProjectLoading(false);
      return;
    }
    setProjectLoading(true);
    try {
      const res = await fetchWithAuth(`/project/${projectId}`);
      const data = await res.json();
      if (res.ok && data.response) {
        setProject(data.response);
        // Only set code from the project if we're not about to stream new code.
        // If initialPrompt exists, we'll overwrite code during streaming anyway.
        if (!initialPrompt && data.response.currentCode) {
          setCode(data.response.currentCode);
        }
      }
    } catch {
      setError('Failed to load project.');
    } finally {
      setProjectLoading(false);
    }
  }, [projectId, initialPrompt]);

  useEffect(() => {
    console.log('[EditorPage] loadProject useEffect triggered with projectId:', projectId);
    loadProject();
  }, [loadProject, projectId]);

  useEffect(() => {
    if (!initialPrompt) return;
    // Guard: refs persist across React Strict Mode's mount→cleanup→remount cycle,
    // so this ensures startGeneration is only ever called ONCE per page load.
    if (generationStartedRef.current) return;
    generationStartedRef.current = true;

    if (tokenRef.current) {
      startGeneration(initialPrompt);
    } else {
      // Token not ready yet 
      const timer = setTimeout(() => {
        if (tokenRef.current) startGeneration(initialPrompt);
        else setError('Authentication error. Please sign in again.');
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SSE stream reader
  async function startGeneration(promptText: string) {
    console.log('[EditorPage] startGeneration called with prompt:', promptText);
    setIsStreaming(true);
    setCode('');
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenRef.current}`,
        },
        body: JSON.stringify({
          prompt: promptText,
          projectId: projectId === 'new' ? undefined : projectId,
          apiKey: localStorage.getItem('kairo_gemini_key') || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || data.msg || 'Generation failed.');
        setIsStreaming(false);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let currentStreamProjectId = projectId === 'new' ? null : projectId;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const json = JSON.parse(line.replace('data: ', ''));

            // First event contains projectId
            if (json.projectId) {
              currentStreamProjectId = json.projectId;
              if (projectId === 'new') {
                window.history.replaceState({}, document.title, `/editor/${json.projectId}`);
              }
              continue;
            }

            // Code chunks — append to the accumulator and update state.
            if (json.chunk) {
              accumulated += json.chunk;
              setCode(accumulated);
            }

            // Stream finished
            if (json.done) {
              if (json.code) setCode(json.code);
              setIsStreaming(false);
              if (projectId === 'new' && currentStreamProjectId) {
                navigate(`/editor/${currentStreamProjectId}`, { replace: true });
              } else {
                await loadProject();
              }
              await refreshUser();
            }

            // Backend error mid-stream.
            if (json.error) {
              console.error('[EditorPage] Stream error from backend:', json.error);
              setError(json.error);
              setIsStreaming(false);
            }
          } catch {
            // Malformed SSE line — skip silently.
          }
        }
      }
    } catch (err: unknown) {
      if (!mountedRef.current) return; // Component unmounted — ignore.
      if (err instanceof Error) {
        setError('Network error. Check your connection.');
      }
      setIsStreaming(false);
    }
  }


  function handleIterate() {
    if (!iteratePrompt.trim() || isStreaming) return;
    startGeneration(iteratePrompt.trim());
    setIteratePrompt('');
  }

  const credits = user?.credits ?? 0;
  const versions = project?.versionHistory ?? [];


  return (
    <>
      <CustomCursor />

      <div className="flex flex-col h-screen overflow-hidden bg-paper">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-6 h-14 border-b border-pitch-10 flex-shrink-0">
          {/* Left: back + project info */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 font-mono text-[10px] text-pitch-40 hover:text-pitch transition-colors"
              style={{ cursor: 'none' }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 2L3 5l4 3" />
              </svg>
              Dashboard
            </button>
            <div className="w-px h-4 bg-pitch-10" />
            <span className="font-mono text-[10px] text-pitch-40 uppercase tracking-[0.15em]">
              PRJ / {projectId?.slice(-6).toUpperCase()}
            </span>
            {project && (
              <>
                <span className="font-mono text-[10px] text-pitch-40">/</span>
                <span className="font-mono text-[10px] text-pitch truncate max-w-[200px]">
                  {project.name}
                </span>
              </>
            )}
          </div>

          {/* Center: tabs */}
          <div className="flex items-center border border-pitch-10">
            {(['code', 'preview'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors ${activeTab === tab
                  ? 'bg-pitch text-paper'
                  : 'text-pitch-40 hover:text-pitch'
                  }`}
                style={{ cursor: 'none' }}
              >
                {tab === 'code' ? '{ } Code' : '◉ Preview'}
              </button>
            ))}
          </div>

          {/* Right: status + credits */}
          <div className="flex items-center gap-4">
            {isStreaming && (
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blueprint animate-pulse" />
                <span className="font-mono text-[9px] text-blueprint">Generating...</span>
              </div>
            )}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="font-mono text-[10px] text-pitch-60 hover:text-pitch transition-colors border border-pitch-20 px-2 py-1 rounded"
              style={{ cursor: 'none' }}
            >
              🔑 Add API Key
            </button>
            <div className="w-1 h-1 bg-pitch-40 rounded-full" />
            <span className="font-mono text-[10px] text-pitch-40">{credits} credits</span>
            {versions.length > 0 && (
              <span className="font-mono text-[10px] text-pitch-40">
                v{versions.length}
              </span>
            )}
          </div>
        </div>

        {/* ── Error banner ── */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="flex items-center gap-3 px-6 py-2.5 border-b"
              style={{ borderColor: '#FF4400', background: '#FFF5F2' }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="w-1.5 h-1.5 flex-shrink-0" style={{ background: '#FF4400' }} />
              <p className="font-mono text-[11px] flex-1" style={{ color: '#FF4400' }}>{error}</p>
              <button
                onClick={() => setError(null)}
                className="font-mono text-[10px] text-pitch-40 hover:text-pitch"
                style={{ cursor: 'none' }}
              >✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main content area ── */}
        <div className="flex-1 overflow-hidden relative">
          {/* Loading skeleton while project is being fetched */}
          {projectLoading && !code && (
            <div className="absolute inset-0 flex items-center justify-center bg-paper z-10">
              <div className="text-center">
                <div className="flex items-center gap-1.5 justify-center mb-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-pitch-40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-pitch-40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-pitch-40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="font-mono text-[10px] text-pitch-40">Loading project...</p>
              </div>
            </div>
          )}

          {/* Both tabs are always mounted with real dimensions.
              We use opacity + pointer-events instead of display:none so that:
              - Monaco always has pixel dimensions and never loses its layout
              - The iframe never reloads its document when switching tabs */}
          <div
            className="absolute inset-0 transition-opacity duration-150"
            style={{
              opacity: activeTab === 'code' ? 1 : 0,
              pointerEvents: activeTab === 'code' ? 'auto' : 'none',
              zIndex: activeTab === 'code' ? 1 : 0,
            }}
          >
            <CodeEditor
              code={code}
              isStreaming={isStreaming}
              isVisible={activeTab === 'code'}
              onChange={(val) => { if (!isStreaming) setCode(val); }}
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              opacity: activeTab === 'preview' ? 1 : 0,
              pointerEvents: activeTab === 'preview' ? 'auto' : 'none',
              zIndex: activeTab === 'preview' ? 1 : 0,
            }}
          >
            <PreviewPane code={code} isStreaming={isStreaming} />
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-3 border-t border-pitch-10 flex-shrink-0">
          {/* Version info */}
          <span className="font-mono text-[9px] text-pitch-40 flex-shrink-0">
            {isStreaming ? 'Streaming...' : `v${versions.length} · ${(code.length / 1000).toFixed(1)}k chars`}
          </span>
          <div className="w-px h-4 bg-pitch-10" />

          {/* Iterate input */}
          <div className="flex-1 relative border border-pitch-10 focus-within:border-pitch transition-colors">
            <input
              type="text"
              value={iteratePrompt}
              onChange={(e) => setIteratePrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleIterate(); }}
              placeholder={isStreaming ? 'Wait for generation to finish...' : 'Describe changes to make...'}
              disabled={isStreaming}
              className="w-full bg-transparent px-3 py-2 font-mono text-[11px] text-pitch placeholder:text-pitch-40/50 outline-none disabled:opacity-50"
              style={{ cursor: 'none' }}
            />
          </div>

          <button
            onClick={handleIterate}
            disabled={isStreaming || !iteratePrompt.trim() || credits < 2}
            className="relative inline-flex items-center gap-2 border border-pitch px-4 py-2 font-mono text-[10px] tracking-[0.08em] uppercase overflow-hidden group disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            style={{ cursor: isStreaming || !iteratePrompt.trim() ? 'not-allowed' : 'none' }}
          >
            <span className="absolute inset-0 bg-pitch transform -translate-x-full group-hover:translate-x-0 transition-transform" style={{ transitionDuration: '400ms' }} />
            <span className="relative z-10 group-hover:text-paper transition-colors flex items-center gap-1.5" style={{ transitionDuration: '400ms' }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 9L9 1M9 1H4M9 1v5" />
              </svg>
              Iterate
            </span>
          </button>
        </div>
      </div>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}