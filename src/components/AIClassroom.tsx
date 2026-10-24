import React, { useState } from 'react';
import { Play, Check, ChevronRight, Layers } from 'lucide-react';
import { CURRICULUM_TOPICS } from '../data/motionCurriculum';
import { CurriculumTopic, StudentProfile } from '../types';
import { AITeacherFace } from './AITeacherFace';
import { SvgDiagramViewer } from './SvgDiagramViewer';

interface AIClassroomProps {
  studentProfile: StudentProfile;
  currentSpeechText: string;
  onUpdateSpeech: (text: string) => void;
  onAskDoubt: (doubt: string) => void;
  onSwitchTab: (tab: string) => void;
  onToggleCompleteTopic: (topicId: string) => void;
}

export const AIClassroom: React.FC<AIClassroomProps> = ({
  studentProfile,
  currentSpeechText,
  onUpdateSpeech,
  onAskDoubt,
  onSwitchTab,
  onToggleCompleteTopic,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<CurriculumTopic>(CURRICULUM_TOPICS[1]);

  const handleSelectTopic = (topic: CurriculumTopic) => {
    setSelectedTopic(topic);
    onUpdateSpeech(topic.teacherSpeechScript);
  };

  const getDiagramTypeForTopic = (topicId: string) => {
    switch (topicId) {
      case 'dist_vs_disp':
      case 'intro_motion':
        return 'distance_displacement';
      case 'circular_motion':
        return 'circular_motion';
      case 'graphical_rep':
      case 'equations_motion':
        return 'vt_graph_area';
      default:
        return 'st_graph';
    }
  };

  const completedCount = studentProfile.completedTopics?.length || 0;
  const progressPercent = Math.round((completedCount / CURRICULUM_TOPICS.length) * 100);

  return (
    <div className="space-y-6">
      {/* AI Teacher Interface */}
      <AITeacherFace
        currentSpeechText={currentSpeechText}
        topicTitle={selectedTopic.title}
        onAskDoubt={onAskDoubt}
      />

      {/* Diagnostic Prompt if not completed */}
      {!studentProfile.examCompleted && (
        <div className="rounded-lg bg-slate-900 border border-slate-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">
              DIAGNOSTIC ASSESSMENT RECOMMENDED
            </span>
            <p className="text-xs text-slate-300 mt-0.5">
              Complete the 5-question cognitive evaluation to configure GATI for your exact learning style.
            </p>
          </div>
          <button
            onClick={() => onSwitchTab('exam')}
            className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs uppercase tracking-wide transition shrink-0"
          >
            Start Assessment →
          </button>
        </div>
      )}

      {/* Progress Metric Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase text-slate-400">
            CURRICULUM COMPLETION:
          </span>
          <span className="text-xs font-mono font-bold text-white bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
            {completedCount} / {CURRICULUM_TOPICS.length} ({progressPercent}%)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSwitchTab('picture')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition"
          >
            Vector Diagrams
          </button>
          <button
            onClick={() => onSwitchTab('sandbox')}
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition"
          >
            Physics Simulator
          </button>
        </div>
      </div>

      {/* Two-Column Curriculum Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Topics List */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 px-1 mb-1">
            CLASS 9 NCERT MODULES (7)
          </div>

          {CURRICULUM_TOPICS.map(topic => {
            const isSelected = selectedTopic.id === topic.id;
            const isCompleted = studentProfile.completedTopics?.includes(topic.id);

            return (
              <div
                key={topic.id}
                onClick={() => handleSelectTopic(topic)}
                className={`p-3.5 rounded-lg border cursor-pointer transition text-left ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onToggleCompleteTopic(topic.id);
                      }}
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition ${
                        isCompleted
                          ? 'bg-cyan-600 border-cyan-500 text-white'
                          : 'border-slate-700 text-transparent hover:border-slate-500'
                      }`}
                      title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </button>
                    <div>
                      <div className="text-xs font-bold leading-snug">
                        {topic.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {topic.tagline}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 shrink-0 bg-slate-800 px-1.5 py-0.5 rounded">
                    {topic.durationMinutes}m
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Topic Detail */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 block uppercase">
                  {selectedTopic.ncertSection} • {selectedTopic.durationMinutes} MIN
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedTopic.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateSpeech(selectedTopic.teacherSpeechScript)}
                  className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs transition flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Audio Lecture
                </button>
                <button
                  onClick={() => onToggleCompleteTopic(selectedTopic.id)}
                  className={`px-3 py-1.5 rounded text-xs font-mono border transition ${
                    studentProfile.completedTopics?.includes(selectedTopic.id)
                      ? 'bg-slate-800 text-cyan-400 border-cyan-800'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {studentProfile.completedTopics?.includes(selectedTopic.id) ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>

            {/* Principle Summary */}
            <div className="p-3.5 rounded bg-slate-950 border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans">
              {selectedTopic.summary}
            </div>

            {/* Scientific Schematic */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-400 uppercase">
                  SCHEMATIC REPRESENTATION
                </span>
                <span className="text-[11px] font-mono text-cyan-400">CLASS 9 SPEC</span>
              </div>
              <SvgDiagramViewer type={getDiagramTypeForTopic(selectedTopic.id)} />
            </div>

            {/* Formula Block */}
            {selectedTopic.keyFormula && (
              <div className="p-3 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 block uppercase">GOVERNING FORMULA</span>
                  <div className="text-sm font-mono text-white mt-0.5">{selectedTopic.keyFormula}</div>
                </div>
                <button
                  onClick={() => onAskDoubt(`Explain the formula ${selectedTopic.keyFormula} with a Class 9 numerical.`)}
                  className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 transition"
                >
                  Solve Numerical
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
