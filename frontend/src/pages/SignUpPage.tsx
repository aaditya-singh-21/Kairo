import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import CustomCursor from '../components/CustomCursor';

/* ── field component (same as SignIn) ──────────────── */
interface FieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
}

function Field({ id, label, type, value, onChange, error, autoComplete, placeholder, hint }: FieldProps) {
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
        <motion.div
          className="absolute bottom-0 left-0 h-[1px] bg-blueprint"
          animate={{ scaleX: focused ? 1 : 0 }}
          initial={{ scaleX: 0 }}
          style={{ transformOrigin: 'left' }}
          transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
        />
      </div>
      {hint && !error && (
        <p className="font-mono text-[10px] text-pitch-40 tracking-wide">{hint}</p>
      )}
      {error && (
        <p className="font-mono text-[10px] tracking-wide" style={{ color: '#FF4400' }}>
          ↳ {error}
        </p>
      )}
    </div>
  );
}

/* ── password strength meter ───────────────────────── */
function StrengthMeter({ password }: { password: string }) {
  const checks = [
    { label: 'At least 6 characters', pass: password.length >= 6 },
    { label: 'Contains special char (!@#$%^&*)', pass: /[!@#$%^&*]/.test(password) },
    { label: 'Contains a number', pass: /\d/.test(password) },
    { label: 'Contains uppercase', pass: /[A-Z]/.test(password) },
  ];
  const passed = checks.filter((c) => c.pass).length;
  const colors = ['rgba(10,10,10,0.1)', '#FF4400', '#FF4400', '#0044FF', '#0A0A0A'];

  if (!password) return null;

  return (
    <motion.div
      className="mt-1"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Bar */}
      <div className="flex gap-1 mb-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[2px] flex-1 transition-colors duration-300"
            style={{ background: i < passed ? colors[passed] : 'rgba(10,10,10,0.1)' }}
          />
        ))}
      </div>
      {/* Checks */}
      <div className="flex flex-col gap-1">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-2">
            <div
              className="w-1.5 h-1.5 flex-shrink-0 transition-colors duration-200"
              style={{ background: c.pass ? '#0044FF' : 'rgba(10,10,10,0.15)' }}
            />
            <span
              className="font-mono text-[9px] tracking-wide transition-colors duration-200"
              style={{ color: c.pass ? '#0A0A0A' : 'rgba(10,10,10,0.35)' }}
            >
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── page ─────────────────────────────────────────── */
export default function SignUpPage() {
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true });
  }, [token, navigate]);

  useEffect(() => {
    tickRef.current = setInterval(() => setTick((t) => t + 1), 80);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  function validate() {
    const e: typeof errors = {};
    if (!name || name.trim().length < 3) e.name = 'Name must be at least 3 characters';
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email format';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    else if (!/[!@#$%^&*]/.test(password)) e.password = 'Password must contain a special character (!@#$%^&*)';
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ form: data.message || 'Registration failed. Please try again.' });
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

          {/* Left panel */}
          <motion.div
            className="hidden lg:flex flex-col justify-between w-[380px] flex-shrink-0 border-r border-pitch-10 px-10 py-16"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div>
              <div className="font-mono text-[10px] text-pitch-40 uppercase tracking-[0.2em] mb-6">
                SEC.AUTH / REGISTER
              </div>
              <div className="w-12 h-px bg-blueprint mb-8" />
              <p className="font-sans text-2xl font-black text-pitch leading-tight tracking-tight" style={{ letterSpacing: '-0.04em' }}>
                Your first blueprint starts here.
              </p>
              <p className="font-sans text-sm text-pitch-40 mt-4 leading-relaxed">
                Create your account and begin turning language into production-ready websites.
              </p>
            </div>

            {/* Onboarding steps */}
            <div className="border border-pitch-10 p-5">
              <div className="font-mono text-[9px] text-pitch-40 uppercase tracking-widest mb-4">
                What happens next
              </div>
              {[
                { n: '01', t: 'Create account', d: 'Name, email, password' },
                { n: '02', t: 'Enter dashboard', d: 'Credits loaded, ready to build' },
                { n: '03', t: 'Describe your site', d: 'Kairo generates it instantly' },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-3 py-3 border-b border-pitch-5 last:border-0">
                  <span className="font-mono text-[9px] text-blueprint mt-0.5">{s.n}</span>
                  <div>
                    <div className="font-mono text-[10px] text-pitch">{s.t}</div>
                    <div className="font-mono text-[9px] text-pitch-40 mt-0.5">{s.d}</div>
                  </div>
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
              <div className="flex items-center gap-3 mb-10">
                <span className="font-mono text-[10px] text-blueprint uppercase tracking-[0.2em]">
                  Create Account
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
                  Get started.
                </motion.h1>
              </div>
              <p className="font-sans text-sm text-pitch-40 mb-10">
                Already have an account?{' '}
                <Link
                  to="/signin"
                  className="text-pitch underline underline-offset-2 hover:text-blueprint transition-colors duration-200"
                >
                  Sign in
                </Link>
              </p>

              {errors.form && (
                <motion.div
                  className="border px-4 py-3 mb-6"
                  style={{ borderColor: '#FF4400' }}
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
                  id="name"
                  label="Full name"
                  type="text"
                  value={name}
                  onChange={(v) => { setName(v); setErrors((p) => ({ ...p, name: undefined })); }}
                  error={errors.name}
                  autoComplete="name"
                  placeholder="Jane Smith"
                />
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
                <div>
                  <Field
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: undefined })); }}
                    error={errors.password}
                    autoComplete="new-password"
                    placeholder="Min. 6 chars + special char"
                  />
                  <StrengthMeter password={password} />
                </div>

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
                        Creating account...
                      </>
                    ) : (
                      'Create account →'
                    )}
                  </span>
                </button>

                <p className="font-mono text-[9px] text-pitch-40 text-center leading-relaxed">
                  By creating an account you agree to our{' '}
                  <Link to="/terms" className="underline hover:text-pitch transition-colors">Terms</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="underline hover:text-pitch transition-colors">Privacy Policy</Link>
                </p>
              </form>

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
