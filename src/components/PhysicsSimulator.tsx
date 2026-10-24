import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface PhysicsSimulatorProps {
  onAskDoubt?: (doubt: string) => void;
}

export const PhysicsSimulator: React.FC<PhysicsSimulatorProps> = ({ onAskDoubt }) => {
  const [u, setU] = useState<number>(0);
  const [a, setA] = useState<number>(2);
  const [duration, setDuration] = useState<number>(6);

  const [time, setTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const currentV = u + a * time;
  const currentS = u * time + 0.5 * a * time * time;

  useEffect(() => {
    if (!isPlaying) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = null;
      return;
    }

    const animate = (now: number) => {
      if (lastTimeRef.current != null) {
        const delta = (now - lastTimeRef.current) / 1000;
        setTime(prevTime => {
          const next = prevTime + delta;
          if (next >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return next;
        });
      }
      lastTimeRef.current = now;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, duration]);

  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
    lastTimeRef.current = null;
  };

  const loadPreset = (presetU: number, presetA: number, presetT: number) => {
    handleReset();
    setU(presetU);
    setA(presetA);
    setDuration(presetT);
  };

  const trackMin = -20;
  const trackMax = 120;
  const carPercent = Math.max(0, Math.min(100, ((currentS - trackMin) / (trackMax - trackMin)) * 100));

  const graphPointsCount = 25;
  const graphData = Array.from({ length: graphPointsCount + 1 }, (_, i) => {
    const t = (i / graphPointsCount) * duration;
    const calcV = u + a * t;
    const calcS = u * t + 0.5 * a * t * t;
    return { t, v: calcV, s: calcS };
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white font-mono">
              KINEMATIC PHYSICS SIMULATOR
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Manipulate initial velocity (u), acceleration (a), and time (t) to test rectilinear equations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400">PRESETS:</span>
            <button
              onClick={() => loadPreset(0, 3, 6)}
              className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Uniform Accel (Rest)
            </button>
            <button
              onClick={() => loadPreset(20, -4, 5)}
              className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Deceleration (Braking)
            </button>
            <button
              onClick={() => loadPreset(12, 0, 8)}
              className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              Uniform Motion (a = 0)
            </button>
          </div>
        </div>
      </div>

      {/* Main Simulation Track */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-6">
        {/* Telemetry Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">Initial Velocity (u)</span>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">{u.toFixed(1)} <span className="text-xs text-slate-400">m/s</span></div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">Acceleration (a)</span>
            <div className="text-xl font-bold font-mono text-slate-200 mt-0.5">{a.toFixed(1)} <span className="text-xs text-slate-400">m/s²</span></div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">Instantaneous Vel (v)</span>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">{currentV.toFixed(1)} <span className="text-xs text-slate-400">m/s</span></div>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
            <span className="text-[11px] font-mono text-slate-400 block uppercase">Displacement (s)</span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{currentS.toFixed(1)} <span className="text-xs text-slate-400">m</span></div>
          </div>
        </div>

        {/* Linear Motion Track */}
        <div className="relative h-28 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex flex-col justify-end p-4">
          <div className="absolute inset-x-0 bottom-6 flex justify-between px-6 text-[10px] text-slate-500 font-mono">
            <span>-20m</span>
            <span>0m (Origin)</span>
            <span>30m</span>
            <span>60m</span>
            <span>90m</span>
            <span>120m</span>
          </div>

          <div className="w-full h-1 bg-slate-700 relative">
            <div
              className="absolute -top-2 w-0.5 h-5 bg-rose-500"
              style={{ left: `${((0 - trackMin) / (trackMax - trackMin)) * 100}%` }}
              title="Origin (s = 0)"
            />
          </div>

          {/* Minimalist Uniform Vehicle Marker */}
          <div
            className="absolute bottom-5 transition-transform duration-75"
            style={{ left: `calc(${carPercent}% - 20px)` }}
          >
            <div className="flex flex-col items-center">
              <div className="w-10 h-5 bg-cyan-600 rounded border border-cyan-400 flex items-center justify-center text-[10px] font-mono font-bold text-white shadow">
                BODY
              </div>
              <span className="text-[10px] font-mono text-cyan-300 mt-0.5">
                {currentS.toFixed(1)}m
              </span>
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition flex items-center gap-1.5"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              {isPlaying ? 'Pause' : 'Start Simulation'}
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>

          <div className="text-right font-mono text-xs text-slate-300">
            Time t: <span className="font-bold text-cyan-400">{time.toFixed(2)}s</span> / {duration}s
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Initial Velocity (u)</span>
              <span className="text-cyan-400 font-bold">{u} m/s</span>
            </div>
            <input
              type="range"
              min="-10"
              max="25"
              step="1"
              value={u}
              disabled={isPlaying}
              onChange={e => {
                setU(parseFloat(e.target.value));
                handleReset();
              }}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Acceleration (a)</span>
              <span className="text-slate-200 font-bold">{a} m/s²</span>
            </div>
            <input
              type="range"
              min="-6"
              max="6"
              step="0.5"
              value={a}
              disabled={isPlaying}
              onChange={e => {
                setA(parseFloat(e.target.value));
                handleReset();
              }}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Duration (t)</span>
              <span className="text-slate-200 font-bold">{duration} s</span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              step="1"
              value={duration}
              disabled={isPlaying}
              onChange={e => {
                setDuration(parseInt(e.target.value, 10));
                handleReset();
              }}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-white uppercase">Distance-Time Graph (s-t)</span>
            <span className="text-[11px] font-mono text-cyan-400">s = ut + ½at²</span>
          </div>
          <div className="bg-slate-950 rounded p-2 border border-slate-800">
            <svg viewBox="0 0 320 180" className="w-full h-auto">
              <line x1="30" y1="150" x2="300" y2="150" stroke="#334155" strokeWidth="1" />
              <line x1="30" y1="150" x2="30" y2="20" stroke="#334155" strokeWidth="1" />
              <text x="280" y="165" fill="#64748b" fontSize="9">Time (s)</text>
              <text x="5" y="25" fill="#64748b" fontSize="9">Pos (m)</text>
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2"
                points={graphData
                  .map(pt => {
                    const x = 30 + (pt.t / duration) * 260;
                    const y = 150 - ((pt.s - trackMin) / (trackMax - trackMin)) * 130;
                    return `${x},${Math.max(15, Math.min(160, y))}`;
                  })
                  .join(' ')}
              />
            </svg>
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-white uppercase">Velocity-Time Graph (v-t)</span>
            <span className="text-[11px] font-mono text-cyan-400">Area = Displacement</span>
          </div>
          <div className="bg-slate-950 rounded p-2 border border-slate-800">
            <svg viewBox="0 0 320 180" className="w-full h-auto">
              <line x1="30" y1="130" x2="300" y2="130" stroke="#334155" strokeWidth="1" />
              <line x1="30" y1="170" x2="30" y2="20" stroke="#334155" strokeWidth="1" />
              <text x="280" y="145" fill="#64748b" fontSize="9">Time (s)</text>
              <text x="5" y="25" fill="#64748b" fontSize="9">Vel (m/s)</text>
              {time > 0 && (
                <polygon
                  fill="#06b6d4"
                  fillOpacity="0.2"
                  points={`30,130 ${graphData
                    .filter(pt => pt.t <= time)
                    .map(pt => {
                      const x = 30 + (pt.t / duration) * 260;
                      const y = 130 - (pt.v / 30) * 100;
                      return `${x},${Math.max(15, Math.min(165, y))}`;
                    })
                    .join(' ')} ${30 + (time / duration) * 260},130`}
                />
              )}
              <polyline
                fill="none"
                stroke="#0284c7"
                strokeWidth="2"
                points={graphData
                  .map(pt => {
                    const x = 30 + (pt.t / duration) * 260;
                    const y = 130 - (pt.v / 30) * 100;
                    return `${x},${Math.max(15, Math.min(165, y))}`;
                  })
                  .join(' ')}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
