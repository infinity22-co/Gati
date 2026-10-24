import React, { useState } from 'react';
import { Send, RotateCcw, Check } from 'lucide-react';
import { PRESET_DOUBTS } from '../data/motionCurriculum';
import { ChatMessage, LearningStyle } from '../types';
import { SvgDiagramViewer } from './SvgDiagramViewer';

interface DoubtSolverProps {
  learningStyle: LearningStyle;
  onUpdateTeacherSpeech: (text: string) => void;
  externalDoubtPrompt?: string;
}

export const DoubtSolver: React.FC<DoubtSolverProps> = ({
  learningStyle,
  onUpdateTeacherSpeech,
  externalDoubtPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: 'GATI Doubt Engine active. Enter any query regarding Class 9 Physics: Motion, including scalar vs vector definitions, velocity-time graph area, and graphical derivations.',
      timestamp: 'Ready',
      speechSummary: 'GATI Doubt Engine ready. Please enter your physics query.',
      keyTakeaways: [
        'Clarify scalar vs vector designations',
        'Request graphical derivations for kinematic equations',
        'Verify SI unit dimensions (m, s, m/s, m/s²)',
      ],
      suggestedQuestions: [
        'Can displacement be zero when distance is non-zero?',
        'Why is uniform circular motion called accelerated motion?',
        'How to find distance from a velocity-time graph?',
      ],
      diagramType: 'distance_displacement',
    },
  ]);

  const [inputDoubt, setInputDoubt] = useState<string>(externalDoubtPrompt || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  React.useEffect(() => {
    if (externalDoubtPrompt) {
      setInputDoubt(externalDoubtPrompt);
    }
  }, [externalDoubtPrompt]);

  const handleAskDoubt = async (questionText?: string) => {
    const textToSend = questionText || inputDoubt;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputDoubt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          topic: 'Class 9 Physics: Chapter Motion',
          learningStyle,
          conversationHistory: messages.slice(-4).map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      if (data.success) {
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.explanation || data.text || 'Explanation processed.',
          speechSummary: data.speechSummary || 'Explanation prepared.',
          keyTakeaways: data.keyTakeaways || [],
          suggestedQuestions: data.suggestedQuestions || [],
          diagramSvg: data.diagramSvg,
          diagramType: data.diagramType || (textToSend.toLowerCase().includes('circular') ? 'circular_motion' : textToSend.toLowerCase().includes('graph') ? 'vt_graph_area' : 'distance_displacement'),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, aiMessage]);

        if (data.speechSummary) {
          onUpdateTeacherSpeech(data.speechSummary);
        }
      }
    } catch (err) {
      console.error('Doubt request error:', err);
      const fallbackAi: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `In Class 9 NCERT Physics: Distance and speed are scalar quantities (magnitude only); displacement, velocity, and acceleration are vector quantities (magnitude and direction). For motion with constant acceleration along a straight line, the three equations apply: v = u + at, s = ut + ½at², and v² - u² = 2as.`,
        speechSummary: `Distance is a scalar, displacement is a vector. For uniform acceleration, apply the three equations of motion.`,
        keyTakeaways: ['Scalar vs vector classification', 'SI units: m, m/s, m/s²', 'Equations valid only for uniform acceleration'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        diagramType: 'distance_displacement',
      };
      setMessages(prev => [...prev, fallbackAi]);
      onUpdateTeacherSpeech(fallbackAi.speechSummary!);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white font-mono">
              GATI DOUBT & SCHEMATIC SOLVER
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Class 9 Physics conceptual query engine with automated vector schematic generation.
            </p>
          </div>
          <button
            onClick={() => setMessages(messages.slice(0, 1))}
            className="text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700 transition flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear History
          </button>
        </div>
      </div>

      {/* Preset Queries */}
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase text-slate-400 block">
          STANDARD BOARD EXAMINATION QUERIES:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {PRESET_DOUBTS.map(doubt => (
            <button
              key={doubt.id}
              onClick={() => handleAskDoubt(doubt.question)}
              className="px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs text-slate-200 shrink-0 max-w-xs transition hover:border-slate-700"
            >
              <span className="text-[10px] font-mono text-cyan-400 uppercase block">{doubt.category}</span>
              <span className="line-clamp-1">{doubt.question}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Message Stream */}
      <div className="space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`rounded-xl p-4 border transition ${
              msg.sender === 'user'
                ? 'bg-slate-900 border-cyan-800 ml-auto max-w-2xl'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold uppercase text-cyan-400">
                {msg.sender === 'ai' ? 'GATI AI ENGINE' : 'STUDENT QUERY'}
              </span>
              <span className="text-[11px] font-mono text-slate-500">{msg.timestamp}</span>
            </div>

            <div className="text-sm text-slate-200 leading-relaxed space-y-2 whitespace-pre-line font-sans">
              {msg.text}
            </div>

            {(msg.diagramSvg || msg.diagramType) && (
              <div className="mt-4 pt-3 border-t border-slate-800">
                <span className="text-xs font-mono text-slate-400 block mb-2 uppercase">
                  GENERATED SCHEMATIC:
                </span>
                <SvgDiagramViewer customSvg={msg.diagramSvg} type={msg.diagramType} />
              </div>
            )}

            {msg.keyTakeaways && msg.keyTakeaways.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-800">
                <span className="text-xs font-mono text-cyan-400 block mb-1 uppercase">
                  KEY SYLLABUS PRINCIPLES:
                </span>
                <ul className="space-y-1">
                  {msg.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">FOLLOW-UP:</span>
                {msg.suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskDoubt(q)}
                    className="text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="rounded-xl p-4 bg-slate-900 border border-slate-800 flex items-center gap-3 text-cyan-400 font-mono text-xs">
            <span className="animate-spin w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full" />
            <span>Processing physics derivation and generating schematic...</span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="sticky bottom-4 rounded-lg bg-slate-900 border border-slate-700 p-1.5 flex items-center gap-2 shadow-xl">
        <input
          type="text"
          value={inputDoubt}
          onChange={e => setInputDoubt(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAskDoubt();
            }
          }}
          placeholder="Enter query: e.g. Why is circular motion accelerated? Or derive v = u + at..."
          className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
        />
        <button
          onClick={() => handleAskDoubt()}
          disabled={!inputDoubt.trim() || isLoading}
          className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:pointer-events-none text-white font-mono font-bold text-xs uppercase tracking-wider transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
