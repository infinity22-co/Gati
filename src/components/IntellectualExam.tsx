import React, { useState } from 'react';
import { Eye, Volume2, Activity, BookOpen, ArrowRight, RotateCcw } from 'lucide-react';
import { INTELLECTUAL_EXAM_QUESTIONS } from '../data/motionCurriculum';
import { LearningStyle, StudentProfile } from '../types';

interface IntellectualExamProps {
  studentProfile: StudentProfile;
  onExamComplete: (recommendedStyle: LearningStyle, scores: Record<LearningStyle, number>) => void;
  onSwitchMode: (style: LearningStyle) => void;
}

export const IntellectualExam: React.FC<IntellectualExamProps> = ({
  studentProfile,
  onExamComplete,
  onSwitchMode,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, { style: LearningStyle; tag: string }>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(studentProfile.examCompleted);
  const [computedResults, setComputedResults] = useState<{
    recommended: LearningStyle;
    scores: Record<LearningStyle, number>;
  } | null>(
    studentProfile.examCompleted && studentProfile.examScores
      ? {
          recommended: studentProfile.learningStyle,
          scores: studentProfile.examScores,
        }
      : null
  );

  const totalQuestions = INTELLECTUAL_EXAM_QUESTIONS.length;
  const currentQuestion = INTELLECTUAL_EXAM_QUESTIONS[currentStep];

  const handleSelectOption = (style: LearningStyle, tag: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { style, tag },
    }));
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    const scores: Record<LearningStyle, number> = {
      visual: 0,
      auditory: 0,
      kinesthetic: 0,
      reading: 0,
    };

    Object.values(selectedAnswers).forEach(ans => {
      scores[ans.style] = (scores[ans.style] || 0) + 20;
    });

    const entries = Object.entries(scores) as [LearningStyle, number][];
    entries.sort((a, b) => b[1] - a[1]);
    const topStyle = entries[0][0];

    const results = {
      recommended: topStyle,
      scores,
    };

    setComputedResults(results);
    setIsCompleted(true);
    onExamComplete(topStyle, scores);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  const getStyleMeta = (style: LearningStyle) => {
    switch (style) {
      case 'visual':
        return {
          title: 'Picture-Based (Visual)',
          icon: Eye,
          desc: 'High retention with geometric graphs, vector schematics, and spatial infographics.',
        };
      case 'auditory':
        return {
          title: 'Auditory & Voice',
          icon: Volume2,
          desc: 'High retention through sequential verbal explanation and conversational pedagogy.',
        };
      case 'kinesthetic':
        return {
          title: 'Interactive Simulation',
          icon: Activity,
          desc: 'High retention through parameter manipulation, slider drills, and real-time telemetry.',
        };
      case 'reading':
        return {
          title: 'Structured Revision Notes',
          icon: BookOpen,
          desc: 'High retention with systematic definitions, formula tables, and algebraic proofs.',
        };
    }
  };

  if (isCompleted && computedResults) {
    const meta = getStyleMeta(computedResults.recommended);
    const Icon = meta.icon;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 md:p-8 space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <span className="text-xs font-mono uppercase text-cyan-400 font-bold block">
              DIAGNOSTIC ASSESSMENT COMPLETE
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              Cognitive Profile: {studentProfile.name || 'Student'}
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Assessment calculated across 4 foundational learning modalities for Class 9 Physics.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-4">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-700 text-cyan-400 shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 uppercase font-bold">RECOMMENDED:</span>
                <span className="text-sm font-bold text-white">{meta.title}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {meta.desc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['visual', 'auditory', 'kinesthetic', 'reading'] as LearningStyle[]).map(style => {
              const itemMeta = getStyleMeta(style);
              const score = computedResults.scores[style] || 0;
              const isTop = style === computedResults.recommended;

              return (
                <div
                  key={style}
                  className={`p-3 rounded border text-left ${
                    isTop ? 'bg-slate-950 border-cyan-500' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400 uppercase">{style}</span>
                    <span className="font-bold text-white">{score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-cyan-500" style={{ width: `${Math.max(10, score)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => onSwitchMode(computedResults.recommended)}
              className="w-full sm:w-auto px-5 py-2.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition"
            >
              Apply Recommended Mode
            </button>
            <button
              onClick={handleRetake}
              className="w-full sm:w-auto px-4 py-2.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs border border-slate-700 transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-white font-mono">
              DIAGNOSTIC ASSESSMENT
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Class 9 Physics: Motion Cognitive Modality Test
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            {currentStep + 1} / {totalQuestions}
          </span>
        </div>

        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-cyan-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-5">
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase block mb-1">
            SCENARIO: {currentQuestion.scenario}
          </span>
          <h3 className="text-base font-bold text-white leading-snug">
            {currentQuestion.question}
          </h3>
        </div>

        <div className="space-y-2.5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswers[currentQuestion.id]?.style === option.style;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(option.style, option.tag)}
                className={`w-full p-3.5 rounded border text-left transition flex items-start gap-3 ${
                  isSelected
                    ? 'bg-slate-950 border-cyan-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 font-mono text-[10px] ${
                    isSelected ? 'border-cyan-500 bg-cyan-600 text-white' : 'border-slate-700 text-slate-500'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1">
                  <span className="text-[11px] font-mono text-cyan-400 block mb-0.5">
                    {option.tag}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {option.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            ← Previous
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedAnswers[currentQuestion.id]}
            className="px-5 py-2 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:pointer-events-none text-white font-mono text-xs uppercase tracking-wider font-bold transition flex items-center gap-1.5"
          >
            {currentStep === totalQuestions - 1 ? 'Compute Results' : 'Next Step'} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
