import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import CustomCursor from '../components/CustomCursor';

/* ── tiny field component ─────────────────────────── */
interface FieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
}

function Field({ id, label, type, value, onChange, error, autoComplete, placeholder }: FieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-mono text-[10px] uppercase tracking-[0.15em] text-pitch-40"
      >
        {label}
      </label>
      <div
        className="relative border transition-colors duration-200"
        style={{ borderColor: error ? '#FF4400' : focused ? '#0A0A0A' : 'rgba(10,10,10,0.2)' }}
      >
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-4 py-3.5 font-sans text-sm text-pitch placeholder:text-pitch-40/60 outline-none"
          style={{ cursor: 'none' }}
        />
        {/* Blueprint blue focus line */}
        <motion.div
          className="absolute bottom-0 left-0 h-[1px] bg-blueprint"
          animate={{ scaleX: focused ? 1 : 0 }}
          initial={{ scaleX: 0 }}
          style={{ transformOrigin: 'left' }}
          transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
        />
      </div>
      {error && (
        <p className="font-mono text-[10px] tracking-wide" style={{ color: '#FF4400' }}>
          ↳ {error}
        </p>
      )}
    </div>
  );
}

/* ── page ─────────────────────────────────────────── */
export default function SignInPage() {
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [tick, setTick] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true });
  }, [token, navigate]);

  // Tick counter for coordinates
  useEffect(() => {
    tickRef.current = setInterval(() => setTick((t) => t + 1), 80);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  function validate() {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email format';
    if (!password) e.password = 'Password is required';
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ form: data.message || 'Login failed. Please try again.' });
        return;
      }
      login(data.token);
      navigate('/dashboard', { replace: true });
    } catch {
      setErrors({ form: 'Network error. Check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  }

  // Fake animated coord for blueprint feel
  const coord = String(tick * 3).padStart(4, '0');

  return (
    <>
      <CustomCursor />
      <div className="min-h-screen bg-paper grid-bg flex flex-col">

        {/* Top bar */}
        <nav className="flex items-center justify-between px-8 h-14 border-b border-pitch-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative w-5 h-5">
              <div className="absolute inset-0 border border-pitch" />
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blueprint -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="font-mono text-xs tracking-[0.15em] uppercase text-pitch">Kairo</span>
          </Link>
          <span className="font-mono text-[10px] text-pitch-40">
            X: {coord} Y: {String(tick * 7 % 9999).padStart(4, '0')}
          </span>
        </nav>

        {/* Main */}
        <div className="flex-1 flex">

          {/* Left panel — metadata */}
          <motion.div
            className="hidden lg:flex flex-col justify-between w-[380px] flex-shrink-0 border-r border-pitch-10 px-10 py-16"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div>
              <div className="font-mono text-[10px] text-pitch-40 uppercase tracking-[0.2em] mb-6">
                SEC.AUTH / SIGN IN
              </div>
              <div className="w-12 h-px bg-blueprint mb-8" />
              <p className="font-sans text-2xl font-black text-pitch leading-tight tracking-tight" style={{ letterSpacing: '-0.04em' }}>
                Welcome back to the drafting board.
              </p>
              <p className="font-sans text-sm text-pitch-40 mt-4 leading-relaxed">
                Sign in to continue building. Your projects and credits are waiting.
              </p>
            </div>

            {/* Blueprint spec block */}
            <div className="border border-pitch-10 p-5">
              <div className="font-mono text-[9px] text-pitch-40 uppercase tracking-widest mb-4">
                Session specs
              </div>
              {[
                { k: 'Auth method', v: 'JWT / 7d expiry' },
                { k: 'Transport', v: 'HTTPS only' },
                { k: 'Encryption', v: 'bcrypt · 10 rounds' },
              ].map(({ k, v }) => (
                <div key={k} className="flex justify-between py-2.5 border-b border-pitch-5 last:border-0">
                  <span className="font-mono text-[10px] text-pitch-40">{k}</span>
                  <span className="font-mono text-[10px] text-pitch">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right panel — form */}
          <div className="flex-1 flex items-center justify-center px-6 py-16">
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            >
              {/* Section label */}
              <div className="flex items-center gap-3 mb-10">
                <span className="font-mono text-[10px] text-blueprint uppercase tracking-[0.2em]">
                  Sign In
                </span>
                <div className="flex-1 h-px bg-pitch-10" />
              </div>

              <div className="overflow-hidden mb-2">
                <motion.h1
                  className="font-sans font-black text-pitch"
                  style={{ fontSize: 'clamp(36px, 4vw, 48px)', letterSpacing: '-0.05em', lineHeight: 1 }}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                >
                  Sign in.
                </motion.h1>
              </div>
              <p className="font-sans text-sm text-pitch-40 mb-10">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-pitch underline underline-offset-2 hover:text-blueprint transition-colors duration-200"
                >
                  Create one
                </Link>
              </p>

              {/* Global form error */}
              {errors.form && (
                <motion.div
                  className="border border-orange px-4 py-3 mb-6"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="font-mono text-[11px] tracking-wide" style={{ color: '#FF4400' }}>
                    ↳ {errors.form}
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                <Field
                  id="email"
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: undefined })); }}
                  error={errors.email}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
                <Field
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: undefined })); }}
                  error={errors.password}
                  autoComplete="current-password"
                  placeholder="••••••••"
                />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-swiss mt-2 w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-3">
                    {loading ? (
                      <>
                        <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Authenticating...
                      </>
                    ) : (
                      'Sign in →'
                    )}
                  </span>
                </button>
              </form>

              {/* Bottom coordinate stamp */}
              <div className="flex items-center justify-between mt-12 pt-6 border-t border-pitch-10">
                <span className="font-mono text-[9px] text-pitch-40">BUILD: v0.1.0</span>
                <span className="font-mono text-[9px] text-pitch-40">KAIRO AUTH ENGINE</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
