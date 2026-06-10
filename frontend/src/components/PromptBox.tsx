import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { SamplePrompt } from '../types/dashboard';
import { SAMPLE_PROMPTS } from '../types/dashboard';

interface PromptBoxProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
  credits: number;
  hasActiveProject: boolean;
}

export function PromptBox({ value, onChange, onSubmit, loading, credits, hasActiveProject }: PromptBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
  }, [value]);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !loading && value.trim()) {
      e.preventDefault();
      onSubmit();
    }
  }

  const canSubmit = value.trim().length > 0 && !loading && credits >= 2;

  return (
    <div
      className="relative border transition-colors duration-200"
      style={{ borderColor: focused ? '#0A0A0A' : 'rgba(10,10,10,0.18)' }}
    >
      {/* Blueprint focus line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[1px] bg-blueprint"
        animate={{ scaleX: focused ? 1 : 0 }}
        initial={{ scaleX: 0 }}
        style={{ transformOrigin: 'left' }}
        transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* Label row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="font-mono text-[9px] text-pitch-40 uppercase tracking-[0.15em]">
          {hasActiveProject ? '↺ Iterate on project' : '→ Describe your website'}
        </span>
        {loading && (
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 bg-blueprint rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-1 bg-blueprint rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-1 bg-blueprint rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            <span className="font-mono text-[9px] text-blueprint ml-1">Generating...</span>
          </div>
        )}
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKey}
        disabled={loading}
        placeholder={
          hasActiveProject
            ? 'Describe what you want to change...'
            : 'A landing page for a SaaS productivity tool with a bold hero, features section, and pricing...'
        }
        className="w-full bg-transparent px-4 pb-3 pt-1 font-sans text-sm text-pitch placeholder:text-pitch-40/50 outline-none resize-none leading-relaxed disabled:opacity-50"
        style={{ cursor: 'none', minHeight: 100 }}
        rows={3}
      />

      {/* Bottom row: credits + submit */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-pitch-10">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[9px] text-pitch-40">
            {credits} credits remaining
          </span>
          {credits < 10 && (
            <span className="font-mono text-[9px]" style={{ color: '#FF4400' }}>
              ↳ Low credits
            </span>
          )}
          <span className="font-mono text-[9px] text-pitch-40 hidden sm:block">
            {value.length > 0 ? `${value.length} chars` : '⌘ + Enter to submit'}
          </span>
        </div>

        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="relative inline-flex items-center gap-2 border border-pitch px-5 py-2 font-mono text-[10px] tracking-[0.08em] uppercase overflow-hidden group disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ cursor: canSubmit ? 'none' : 'not-allowed' }}
        >
          <span
            className="absolute inset-0 bg-pitch transform -translate-x-full group-hover:translate-x-0 transition-transform duration-400 ease-[cubic-bezier(0.76,0,0.24,1)]"
            style={{ transitionDuration: '400ms' }}
          />
          <span className="relative z-10 group-hover:text-paper transition-colors duration-400 flex items-center gap-2">
            {loading ? (
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 9L9 1M9 1H4M9 1v5" />
              </svg>
            )}
            Generate
          </span>
        </button>
      </div>
    </div>
  );
}

/* ── Sample Cards ─────────────────────────────────── */
interface SampleCardsProps {
  onSelect: (prompt: string) => void;
}

export function SampleCards({ onSelect }: SampleCardsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-5">
        <span className="font-mono text-[10px] text-pitch-40 uppercase tracking-[0.15em]">
          Try a sample
        </span>
        <div className="flex-1 h-px bg-pitch-10" />
        <span className="font-mono text-[9px] text-pitch-40">6 templates</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-pitch-10 border border-pitch-10">
        {SAMPLE_PROMPTS.map((sample: SamplePrompt, i: number) => (
          <motion.button
            key={sample.id}
            onClick={() => onSelect(sample.prompt)}
            className="relative bg-paper p-4 text-left group overflow-hidden"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            style={{ cursor: 'none' }}
            whileHover={{ backgroundColor: '#0A0A0A' }}
          >
            {/* Blueprint corner on hover */}
            <div className="absolute top-0 left-0 w-0 h-0 border-t-0 border-l-0 group-hover:border-t-[1.5px] group-hover:border-l-[1.5px] group-hover:border-blueprint group-hover:w-5 group-hover:h-5 transition-all duration-300" />

            <div className="font-mono text-[9px] text-blueprint group-hover:text-blueprint mb-2 tracking-[0.15em]">
              {sample.code}
            </div>
            <div className="font-sans text-sm font-bold text-pitch group-hover:text-paper transition-colors leading-tight mb-1" style={{ letterSpacing: '-0.02em' }}>
              {sample.label}
            </div>
            <div className="font-mono text-[10px] text-pitch-40 group-hover:text-paper/50 transition-colors leading-relaxed">
              {sample.description}
            </div>

            {/* Arrow indicator */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M1 9L9 1M9 1H4M9 1v5" />
              </svg>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
