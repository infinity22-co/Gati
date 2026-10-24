import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';

interface AITeacherFaceProps {
  currentSpeechText: string;
  isThinking?: boolean;
  topicTitle?: string;
  onAskDoubt?: (question: string) => void;
}

export const AITeacherFace: React.FC<AITeacherFaceProps> = ({
  currentSpeechText,
  isThinking = false,
  topicTitle = 'Class 9 Physics: Motion',
  onAskDoubt,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [mouthOpen, setMouthOpen] = useState(0);
  const [eyeBlink, setEyeBlink] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Stop speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Periodic eye blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 180);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Reactive mouth animation during speech
  useEffect(() => {
    let interval: any = null;
    if (isSpeaking) {
      interval = setInterval(() => {
        setMouthOpen(Math.random() * 0.8 + 0.2);
      }, 100);
    } else {
      setMouthOpen(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSpeaking]);

  // When speech text updates, speak it automatically if not muted
  useEffect(() => {
    if (!currentSpeechText || isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    speakText(currentSpeechText);
  }, [currentSpeechText]);

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (isMuted || !text.trim()) {
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '').slice(0, 400);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current = utterance;
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const cleanVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (cleanVoice) utterance.voice = cleanVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setMouthOpen(0);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setMouthOpen(0);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlayPause = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setMouthOpen(0);
    } else {
      speakText(currentSpeechText);
    }
  };

  const handleToggleMute = () => {
    if (!isMuted) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      setMouthOpen(0);
      setIsMuted(true);
    } else {
      setIsMuted(false);
      if (currentSpeechText) {
        speakText(currentSpeechText);
      }
    }
  };

  return (
    <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-lg">
      {/* Top Status Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isThinking ? 'bg-amber-400 animate-pulse' : isSpeaking ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'
            }`}
          />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            GATI AI TEACHER • {isThinking ? 'PROCESSING' : isSpeaking ? 'TRANSMITTING' : 'STANDBY'}
          </span>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSpeechRate(prev => (prev === 1 ? 1.25 : prev === 1.25 ? 0.85 : 1))}
            className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            {speechRate}x
          </button>
          <button
            onClick={handleToggleMute}
            className={`p-1.5 rounded border transition ${
              isMuted
                ? 'bg-rose-950/60 text-rose-400 border-rose-800'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Avatar & Synthesis Hub */}
      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Uniform Scientific Vector AI Face */}
        <div className="relative shrink-0 flex items-center justify-center">
          {/* Circular HUD Grid */}
          <div className="w-32 h-32 rounded-full bg-slate-950 border border-slate-700 relative overflow-hidden flex items-center justify-center shadow-inner">
            {/* Concentric Calibration Rings */}
            <div className={`absolute inset-1 rounded-full border border-dashed border-slate-800 ${isSpeaking ? 'animate-spin' : ''}`} style={{ animationDuration: '30s' }} />
            <div className="absolute inset-3 rounded-full border border-slate-800/80" />

            {/* Scientific AI Face Vector SVG */}
            <svg viewBox="0 0 100 100" className="w-24 h-24">
              {/* Head contour */}
              <circle cx="50" cy="50" r="42" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />

              {/* Eyes */}
              {eyeBlink ? (
                <>
                  <line x1="33" y1="42" x2="43" y2="42" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="57" y1="42" x2="67" y2="42" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <circle cx="38" cy="42" r="5" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
                  <circle cx="38" cy="42" r="2.5" fill={isSpeaking ? '#38bdf8' : '#e0f2fe'} />

                  <circle cx="62" cy="42" r="5" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
                  <circle cx="62" cy="42" r="2.5" fill={isSpeaking ? '#38bdf8' : '#e0f2fe'} />
                </>
              )}

              {/* Nose bridge marker */}
              <line x1="50" y1="48" x2="50" y2="53" stroke="#475569" strokeWidth="1" />

              {/* Animated Mouth */}
              {isSpeaking ? (
                <rect
                  x="38"
                  y={63 - mouthOpen * 4}
                  width="24"
                  height={3 + mouthOpen * 8}
                  rx="3"
                  fill="#0284c7"
                  stroke="#38bdf8"
                  strokeWidth="1"
                />
              ) : (
                <line x1="41" y1="64" x2="59" y2="64" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
              )}

              {/* HUD grid crosshairs */}
              <line x1="50" y1="12" x2="50" y2="18" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
              <line x1="50" y1="82" x2="50" y2="88" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
              <line x1="12" y1="50" x2="18" y2="50" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
              <line x1="82" y1="50" x2="88" y2="50" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
            </svg>
          </div>
        </div>

        {/* Spoken Narration and Transcript */}
        <div className="flex-1 w-full space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-cyan-400 font-semibold tracking-wide">
              {topicTitle}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              PHYSICS MODULE
            </span>
          </div>

          <div className="rounded-lg bg-slate-950 p-3.5 border border-slate-800 text-slate-200 text-sm leading-relaxed min-h-[75px] font-sans">
            {currentSpeechText || 'Select a topic or enter a query to begin instruction.'}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePlayPause}
                className="px-3 py-1.5 rounded text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition flex items-center gap-1.5"
              >
                {isSpeaking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                {isSpeaking ? 'Pause Audio' : 'Play Audio'}
              </button>
              <button
                onClick={() => speakText(currentSpeechText)}
                className="px-2.5 py-1.5 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Replay
              </button>
            </div>

            {onAskDoubt && (
              <button
                onClick={() => onAskDoubt('Explain the difference between Distance and Displacement with an example.')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono hover:underline"
              >
                Clear Doubt →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
