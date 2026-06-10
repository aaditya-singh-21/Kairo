export default function Footer() {
  return (
    <footer className="bg-paper border-t border-pitch-10">
      <div className="max-w-[1440px] mx-auto px-8 py-12">
        <div className="grid grid-cols-12 gap-6 items-center">
          {/* Logo */}
          <div className="col-span-12 md:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-5 h-5">
                <div className="absolute inset-0 border border-pitch" />
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blueprint -translate-x-1/2 -translate-y-1/2" />
              </div>
              <span className="font-mono text-xs tracking-[0.15em] uppercase text-pitch">
                Kairo
              </span>
            </div>
            <p className="font-mono text-[11px] text-pitch-40 leading-relaxed max-w-xs">
              Precision AI website generation. From language to live.
            </p>
          </div>

          {/* Links */}
          <div className="col-span-6 md:col-span-2">
            <div className="font-mono text-[10px] text-pitch-40 uppercase tracking-widest mb-4">
              Product
            </div>
            {['Dashboard', 'Pricing', 'Changelog'].map((l) => (
              <a
                key={l}
                href={`/${l.toLowerCase()}`}
                className="block font-mono text-[11px] text-pitch hover:text-blueprint transition-colors duration-200 mb-2"
              >
                {l}
              </a>
            ))}
          </div>

          <div className="col-span-6 md:col-span-2">
            <div className="font-mono text-[10px] text-pitch-40 uppercase tracking-widest mb-4">
              Company
            </div>
            {['About', 'Docs', 'Status'].map((l) => (
              <a
                key={l}
                href={`/${l.toLowerCase()}`}
                className="block font-mono text-[11px] text-pitch hover:text-blueprint transition-colors duration-200 mb-2"
              >
                {l}
              </a>
            ))}
          </div>

          {/* Right: Status & build info */}
          <div className="col-span-12 md:col-span-4 flex flex-col items-start md:items-end gap-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-[10px] text-pitch-40">All systems operational</span>
            </div>
            <span className="font-mono text-[10px] text-pitch-40">
              BUILD: v0.1.0 — KAIRO AI ENGINE
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-12 pt-6 border-t border-pitch-10 gap-4">
          <span className="font-mono text-[10px] text-pitch-40">
            © 2026 Kairo. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[9px] text-pitch-40">
              X: {new Date().getFullYear()} Y: {new Date().getMonth() + 1}
            </span>
            <a href="/privacy" className="font-mono text-[10px] text-pitch-40 hover:text-pitch transition-colors">
              Privacy
            </a>
            <a href="/terms" className="font-mono text-[10px] text-pitch-40 hover:text-pitch transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
