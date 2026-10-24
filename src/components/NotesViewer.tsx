import React, { useState } from 'react';
import { Copy, Check, Printer } from 'lucide-react';
import { CURRICULUM_TOPICS } from '../data/motionCurriculum';
import { LearningStyle } from '../types';

interface NotesViewerProps {
  learningStyle: LearningStyle;
  onUpdateSpeech: (text: string) => void;
}

export const NotesViewer: React.FC<NotesViewerProps> = ({
  learningStyle,
  onUpdateSpeech,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isGeneratingAiNotes, setIsGeneratingAiNotes] = useState<boolean>(false);
  const [customAiNotes, setCustomAiNotes] = useState<string | null>(null);

  const handleCopyNotes = () => {
    const textToCopy = customAiNotes || defaultChapterNotes;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateCustomNotes = async (topicTitle: string) => {
    setIsGeneratingAiNotes(true);
    try {
      const response = await fetch('/api/gemini/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicTitle,
          style: learningStyle === 'visual' ? 'Visual & Bulleted' : learningStyle === 'reading' ? 'Formula & Definitions' : 'Concise Exam Prep',
          studentLevel: 'Class 9 CBSE/NCERT',
        }),
      });
      const data = await response.json();
      if (data.success && data.notes) {
        setCustomAiNotes(data.notes);
        onUpdateSpeech(`GATI Revision Notes compiled for ${topicTitle}.`);
      }
    } catch (e) {
      console.error('Error generating AI notes:', e);
    } finally {
      setIsGeneratingAiNotes(false);
    }
  };

  const defaultChapterNotes = `# Class 9 Physics: Chapter Motion - Revision Notes

## 1. Concept of Rest and Motion
- Reference Point (Origin): A fixed coordinate relative to which the location of an object is specified.
- Motion is Relative: An object can be stationary relative to one frame and moving relative to another.

---

## 2. Distance vs. Displacement
- Distance: Actual total path traversed (Scalar quantity, always positive or zero). SI Unit: meter (m).
- Displacement: Shortest straight-line distance with direction from initial to final position (Vector quantity). Can be positive, zero, or negative.
- Relation: |Displacement| <= Distance. They are equal only during unidirectional straight-line motion.

---

## 3. Speed and Velocity
- Speed (v): Rate of covering distance. v = s / t (Scalar, SI unit: m/s).
- Average Speed: Total Distance / Total Time.
- Velocity (v): Rate of displacement in a specified direction (Vector, SI unit: m/s).
- Average Velocity: For uniform acceleration: v_avg = (u + v) / 2.

---

## 4. Acceleration (a)
- Defined as the rate of change of velocity:
  a = (v - u) / t
- SI Unit: m/s² (meter per second squared).
- Uniform Acceleration: Equal velocity changes in equal time intervals.
- Retardation / Deceleration: Negative acceleration when velocity decreases (v < u).

---

## 5. Graphical Analysis of Motion
1. Distance-Time Graph (s-t):
   - Slope equals Speed (v = Δs / Δt).
   - Straight slope: Uniform Speed.
   - Horizontal line: Object at rest.
2. Velocity-Time Graph (v-t):
   - Slope equals Acceleration (a = Δv / Δt).
   - Area bounded under the v-t line and time axis equals Displacement.

---

## 6. The Three Equations of Motion (Uniform Acceleration)
1. First Equation: v = u + at (Velocity-Time Relation)
2. Second Equation: s = ut + ½at² (Position-Time Relation)
3. Third Equation: v² - u² = 2as (Position-Velocity Relation)

Where: u = initial velocity, v = final velocity, a = acceleration, t = time, s = distance.

---

## 7. Uniform Circular Motion
- Circular track motion at constant speed.
- Velocity vector constantly changes direction along the tangent.
- Motion is accelerated toward the center (Centripetal acceleration).
- Speed: v = 2πr / t.

---

## 8. Solved Numerical Problem
Problem: A vehicle starts from rest and accelerates uniformly at 0.5 m/s² for 20 seconds. Calculate:
(a) Speed acquired, and (b) Distance travelled.
Solution:
- Given: u = 0, a = 0.5 m/s², t = 20 s.
- (a) v = u + at = 0 + (0.5 * 20) = 10 m/s.
- (b) s = ut + ½at² = 0 + ½(0.5)(20)² = 0.25 * 400 = 100 m.
`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white font-mono">
              GATI REVISION NOTES & FORMULA DIRECTORY
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Class 9 NCERT Physics Chapter: Motion standard specifications, definitions, and derivations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyNotes}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono uppercase tracking-wider transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
          </div>
        </div>
      </div>

      {/* Formula Matrix */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <span className="text-xs font-mono font-bold text-white uppercase">
            KINEMATIC FORMULA MATRIX (UNIFORM ACCELERATION)
          </span>
          <span className="text-xs font-mono text-slate-400">SI UNITS: m, s, m/s, m/s²</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-cyan-400 uppercase block">Equation 1</span>
            <div className="text-base font-mono font-bold text-white my-1">v = u + at</div>
            <span className="text-xs text-slate-400">Velocity-Time</span>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-cyan-400 uppercase block">Equation 2</span>
            <div className="text-base font-mono font-bold text-white my-1">s = ut + ½at²</div>
            <span className="text-xs text-slate-400">Position-Time</span>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-cyan-400 uppercase block">Equation 3</span>
            <div className="text-base font-mono font-bold text-white my-1">v² - u² = 2as</div>
            <span className="text-xs text-slate-400">Position-Velocity</span>
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono text-cyan-400 uppercase block">Circular Speed</span>
            <div className="text-base font-mono font-bold text-white my-1">v = 2πr / t</div>
            <span className="text-xs text-slate-400">Radius r, Time t</span>
          </div>
        </div>
      </div>

      {/* Topic Notes Generator */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase font-bold block">
            GENERATE TOPIC NOTES
          </span>
          <p className="text-xs text-slate-300 mt-0.5">
            Select a module to compile focused notes with solved numericals:
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {CURRICULUM_TOPICS.slice(1, 6).map(topic => (
            <button
              key={topic.id}
              onClick={() => handleGenerateCustomNotes(topic.title)}
              disabled={isGeneratingAiNotes}
              className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 whitespace-nowrap font-mono transition"
            >
              {topic.title.split('.')[1] || topic.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Notes Sheet */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-6">
        {isGeneratingAiNotes ? (
          <div className="py-12 text-center text-cyan-400 font-mono text-xs space-y-2">
            <span className="animate-spin inline-block w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full" />
            <p>Compiling Class 9 NCERT revision notes...</p>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed whitespace-pre-line font-sans">
            {customAiNotes || defaultChapterNotes}
          </div>
        )}
      </div>
    </div>
  );
};
