import React from 'react';

interface SvgDiagramViewerProps {
  type?: string;
  customSvg?: string;
  className?: string;
}

export const SvgDiagramViewer: React.FC<SvgDiagramViewerProps> = ({ type = 'distance_displacement', customSvg, className = '' }) => {
  if (customSvg) {
    // If raw SVG string is provided
    return (
      <div
        className={`bg-slate-900/90 border border-cyan-500/30 rounded-xl p-4 flex items-center justify-center overflow-x-auto shadow-inner ${className}`}
        dangerouslySetInnerHTML={{ __html: customSvg }}
      />
    );
  }

  // Pre-crafted scientific SVG diagrams
  if (type === 'distance_displacement' || type === 'circular_track') {
    return (
      <div className={`bg-slate-900/90 border border-cyan-500/30 rounded-xl p-4 flex flex-col items-center justify-center ${className}`}>
        <svg viewBox="0 0 520 230" className="w-full max-w-lg h-auto">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#06b6d4" />
            </marker>
            <marker id="arrow-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
            </marker>
          </defs>

          {/* Grid lines */}
          <line x1="30" y1="20" x2="30" y2="200" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="490" y1="20" x2="490" y2="200" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

          {/* Curved path: Distance */}
          <path
            d="M 60 140 C 120 40, 200 60, 260 140 C 320 210, 400 60, 460 140"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="4"
            strokeDasharray="6 4"
          />

          {/* Straight line: Displacement */}
          <line
            x1="60"
            y1="140"
            x2="455"
            y2="140"
            stroke="#06b6d4"
            strokeWidth="4"
            markerEnd="url(#arrow)"
          />

          {/* Point A */}
          <circle cx="60" cy="140" r="10" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
          <text x="50" y="170" fill="#93c5fd" fontSize="13" fontWeight="bold">Point A (Initial)</text>

          {/* Point B */}
          <circle cx="460" cy="140" r="10" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <text x="420" y="170" fill="#6ee7b7" fontSize="13" fontWeight="bold">Point B (Final)</text>

          {/* Labels */}
          <rect x="200" y="30" width="160" height="26" rx="6" fill="#78350f" fillOpacity="0.8" stroke="#f59e0b" strokeWidth="1" />
          <text x="210" y="47" fill="#fef3c7" fontSize="11" fontWeight="600">Distance = Curved Path</text>

          <rect x="195" y="105" width="170" height="26" rx="6" fill="#083344" fillOpacity="0.9" stroke="#06b6d4" strokeWidth="1" />
          <text x="205" y="122" fill="#cffafe" fontSize="11" fontWeight="600">Displacement = Shortest Path</text>

          {/* Bottom badge */}
          <text x="140" y="210" fill="#94a3b8" fontSize="12" fontStyle="italic">Distance ≥ |Displacement| (Equal only in straight line motion)</text>
        </svg>
      </div>
    );
  }

  if (type === 'circular_motion') {
    return (
      <div className={`bg-slate-900/90 border border-cyan-500/30 rounded-xl p-4 flex flex-col items-center justify-center ${className}`}>
        <svg viewBox="0 0 460 230" className="w-full max-w-md h-auto">
          <defs>
            <marker id="tangent-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
            </marker>
            <marker id="center-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#ec4899" />
            </marker>
          </defs>

          {/* Orbit Circle */}
          <circle cx="180" cy="115" r="75" fill="none" stroke="#334155" strokeWidth="3" strokeDasharray="5 5" />
          <circle cx="180" cy="115" r="5" fill="#f8fafc" />
          <text x="172" y="135" fill="#94a3b8" fontSize="11">Center (O)</text>

          {/* Radius line */}
          <line x1="180" y1="115" x2="180" y2="40" stroke="#64748b" strokeWidth="2" strokeDasharray="2 2" />
          <text x="185" y="80" fill="#94a3b8" fontSize="11">Radius r</text>

          {/* Particle at Top */}
          <circle cx="180" cy="40" r="8" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />

          {/* Tangential Velocity Vector */}
          <line x1="180" y1="40" x2="270" y2="40" stroke="#10b981" strokeWidth="3" markerEnd="url(#tangent-arrow)" />
          <text x="215" y="30" fill="#34d399" fontSize="11" fontWeight="bold">Velocity (v) Tangent</text>

          {/* Centripetal Acceleration Vector */}
          <line x1="180" y1="40" x2="180" y2="85" stroke="#ec4899" strokeWidth="3" markerEnd="url(#center-arrow)" />
          <text x="110" y="65" fill="#f472b6" fontSize="11" fontWeight="bold">Acc. (ac)</text>

          {/* Formula box */}
          <rect x="290" y="70" width="160" height="90" rx="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
          <text x="300" y="95" fill="#38bdf8" fontSize="12" fontWeight="bold">Uniform Circular Motion</text>
          <text x="300" y="118" fill="#e2e8f0" fontSize="11">Speed v = 2πr / t</text>
          <text x="300" y="136" fill="#f472b6" fontSize="10">Direction changes at</text>
          <text x="300" y="150" fill="#f472b6" fontSize="10">every single instant!</text>
        </svg>
      </div>
    );
  }

  if (type === 'vt_graph_area') {
    return (
      <div className={`bg-slate-900/90 border border-cyan-500/30 rounded-xl p-4 flex flex-col items-center justify-center ${className}`}>
        <svg viewBox="0 0 460 220" className="w-full max-w-md h-auto">
          {/* Axes */}
          <line x1="50" y1="180" x2="420" y2="180" stroke="#94a3b8" strokeWidth="2" />
          <line x1="50" y1="180" x2="50" y2="20" stroke="#94a3b8" strokeWidth="2" />

          <text x="400" y="200" fill="#94a3b8" fontSize="12" fontWeight="bold">Time t (s) →</text>
          <text x="15" y="30" fill="#94a3b8" fontSize="12" fontWeight="bold" transform="rotate(-90 20,40)">Velocity v (m/s) →</text>

          {/* Shaded Area for Displacement */}
          <polygon points="50,180 50,110 320,50 320,180" fill="#0284c7" fillOpacity="0.25" stroke="#0284c7" strokeWidth="1" />

          {/* Dividing dashed line to show Rectangle + Triangle */}
          <line x1="50" y1="110" x2="320" y2="110" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="320" y1="50" x2="320" y2="180" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />

          {/* Velocity curve */}
          <line x1="50" y1="110" x2="320" y2="50" stroke="#06b6d4" strokeWidth="4" />

          {/* Labels */}
          <text x="25" y="115" fill="#e2e8f0" fontSize="12" fontWeight="bold">u</text>
          <text x="25" y="55" fill="#e2e8f0" fontSize="12" fontWeight="bold">v</text>
          <text x="315" y="198" fill="#e2e8f0" fontSize="12" fontWeight="bold">t</text>

          {/* Annotations */}
          <text x="140" y="85" fill="#38bdf8" fontSize="11" fontWeight="bold">Triangle Area: ½(v-u)t = ½at²</text>
          <text x="150" y="145" fill="#67e8f9" fontSize="11" fontWeight="bold">Rectangle Area: u × t</text>
          <text x="120" y="170" fill="#facc15" fontSize="11" fontWeight="bold">Total Area = Distance s = ut + ½at²</text>
        </svg>
      </div>
    );
  }

  // Default s-t and v-t graph comparison
  return (
    <div className={`bg-slate-900/90 border border-cyan-500/30 rounded-xl p-4 flex flex-col items-center justify-center ${className}`}>
      <svg viewBox="0 0 460 210" className="w-full max-w-md h-auto">
        {/* s-t axes */}
        <line x1="40" y1="160" x2="200" y2="160" stroke="#94a3b8" strokeWidth="2" />
        <line x1="40" y1="160" x2="40" y2="30" stroke="#94a3b8" strokeWidth="2" />
        <text x="60" y="25" fill="#38bdf8" fontSize="12" fontWeight="bold">Distance-Time (s-t)</text>
        <line x1="40" y1="160" x2="190" y2="50" stroke="#10b981" strokeWidth="3" />
        <text x="80" y="100" fill="#34d399" fontSize="11">Slope = Speed (v)</text>

        {/* v-t axes */}
        <line x1="250" y1="160" x2="410" y2="160" stroke="#94a3b8" strokeWidth="2" />
        <line x1="250" y1="160" x2="250" y2="30" stroke="#94a3b8" strokeWidth="2" />
        <text x="270" y="25" fill="#f59e0b" fontSize="12" fontWeight="bold">Velocity-Time (v-t)</text>
        <line x1="250" y1="140" x2="400" y2="60" stroke="#f59e0b" strokeWidth="3" />
        <text x="290" y="90" fill="#fbbf24" fontSize="11">Slope = Acc. (a)</text>
        <polygon points="250,160 250,140 400,60 400,160" fill="#f59e0b" fillOpacity="0.15" />
        <text x="280" y="145" fill="#fef3c7" fontSize="10">Area = Distance</text>
      </svg>
    </div>
  );
};
