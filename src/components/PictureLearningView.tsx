import React, { useState } from 'react';
import { Layers, BookOpen, Volume2 } from 'lucide-react';
import { SvgDiagramViewer } from './SvgDiagramViewer';

interface PictureLearningViewProps {
  onSelectTopicDoubt: (doubt: string) => void;
  onUpdateSpeech: (text: string) => void;
}

export const PictureLearningView: React.FC<PictureLearningViewProps> = ({
  onSelectTopicDoubt,
  onUpdateSpeech,
}) => {
  const [selectedDiagram, setSelectedDiagram] = useState<string>('dist_disp');

  const DIAGRAMS = [
    {
      id: 'dist_disp',
      title: 'Distance vs. Displacement Vectors',
      category: 'Kinematic Foundations',
      description: 'Distance is the scalar total path traversed (always positive). Displacement is the shortest straight-line vector with direction from initial point A to final point B.',
      audioSpeech: 'Distance is the total curved path length, a scalar quantity. Displacement is the straight line vector from start to finish. In any round trip, displacement is zero while distance is positive.',
      doubtPrompt: 'Explain how distance and displacement differ in Class 9 physics.',
      diagramType: 'distance_displacement',
    },
    {
      id: 'vt_graph',
      title: 'Velocity-Time (v-t) Graph & Area Integration',
      category: 'Graphical Kinematics',
      description: 'The slope of a v-t graph represents Acceleration (a = Δv/Δt). The geometric area bounded under the line and time axis equals Displacement (s = ut + ½at²).',
      audioSpeech: 'On a velocity-time graph, the slope gives acceleration, and the area under the line gives the total distance travelled.',
      doubtPrompt: 'Prove graphically that the area under a velocity-time graph gives distance.',
      diagramType: 'vt_graph_area',
    },
    {
      id: 'circular',
      title: 'Uniform Circular Motion & Tangential Velocity',
      category: 'Rotational Motion',
      description: 'Even at constant speed, direction continuously changes at every instant along the tangent. Hence, circular motion is continuously accelerated toward the center.',
      audioSpeech: 'In uniform circular motion, speed is constant but direction changes continuously. This produces centripetal acceleration directed toward the center.',
      doubtPrompt: 'Why is uniform circular motion called accelerated motion if speed is constant?',
      diagramType: 'circular_motion',
    },
    {
      id: 'st_graph',
      title: 'Distance-Time (s-t) Graph Slopes',
      category: 'Graphical Kinematics',
      description: 'The gradient of an s-t curve equals Speed. A straight upward slope represents uniform speed; a curved slope represents accelerated motion; a flat line represents rest.',
      audioSpeech: 'The slope of a distance-time graph represents speed. A horizontal line means the body is at rest.',
      doubtPrompt: 'How do you determine speed from a distance-time graph?',
      diagramType: 'st_graph',
    },
  ];

  const current = DIAGRAMS.find(d => d.id === selectedDiagram) || DIAGRAMS[0];

  const handleSelect = (diag: typeof DIAGRAMS[0]) => {
    setSelectedDiagram(diag.id);
    onUpdateSpeech(diag.audioSpeech);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white font-mono">
              PICTURE-BASED LEARNING MODULE
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Uniform vector schematics and graphical representations for Class 9 Physics: Motion.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 border border-cyan-800 bg-cyan-950 px-2.5 py-1 rounded">
            VISUAL MODALITY
          </span>
        </div>
      </div>

      {/* Diagram Selector Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {DIAGRAMS.map(diag => {
          const isSelected = selectedDiagram === diag.id;
          return (
            <button
              key={diag.id}
              onClick={() => handleSelect(diag)}
              className={`p-3 rounded-lg border text-left transition ${
                isSelected
                  ? 'bg-slate-800 border-cyan-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-cyan-400 block mb-1">
                {diag.category}
              </span>
              <span className="text-xs font-semibold line-clamp-1 block">
                {diag.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Vector Schematic Stage */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <span className="text-xs font-mono text-cyan-400 block uppercase">
              {current.category}
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">
              {current.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateSpeech(current.audioSpeech)}
              className="px-3 py-1.5 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5" /> Explain Audio
            </button>
            <button
              onClick={() => onSelectTopicDoubt(current.doubtPrompt)}
              className="px-3 py-1.5 rounded text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white transition flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" /> Clear Doubt
            </button>
          </div>
        </div>

        {/* Schematic Graphic */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
          <SvgDiagramViewer type={current.diagramType} />
        </div>

        {/* Technical Description */}
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
          <span className="text-xs font-mono uppercase text-slate-400 block mb-1 font-semibold">
            Concept Specification:
          </span>
          <p className="text-sm text-slate-200 leading-relaxed">
            {current.description}
          </p>
        </div>
      </div>
    </div>
  );
};
