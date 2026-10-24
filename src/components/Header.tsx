import React from 'react';
import { Eye, Volume2, Activity, BookOpen, Brain, MessageSquare, ChevronDown, ShieldCheck, User } from 'lucide-react';
import { LearningStyle, StudentProfile, AuthSession } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  studentProfile: StudentProfile;
  authSession: AuthSession;
  onOpenProfile: () => void;
  onSelectLearningStyle: (style: LearningStyle) => void;
  onSwitchToAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  studentProfile,
  authSession,
  onOpenProfile,
  onSelectLearningStyle,
  onSwitchToAdmin,
}) => {
  const learningStyleLabels: Record<LearningStyle, { label: string; icon: any }> = {
    visual: { label: 'Picture-Based', icon: Eye },
    auditory: { label: 'Auditory', icon: Volume2 },
    kinesthetic: { label: 'Simulation', icon: Activity },
    reading: { label: 'Notes', icon: BookOpen },
  };

  const currentStyleMeta = learningStyleLabels[studentProfile.learningStyle] || learningStyleLabels.visual;
  const StyleIcon = currentStyleMeta.icon;

  const navItems = [
    { id: 'classroom', label: 'Classroom', icon: Eye },
    { id: 'picture', label: 'Picture Learning', icon: Eye },
    { id: 'doubts', label: 'Doubt Solver', icon: MessageSquare },
    { id: 'sandbox', label: 'Physics Simulator', icon: Activity },
    { id: 'notes', label: 'Revision Notes', icon: BookOpen },
    { id: 'exam', label: 'Diagnostic Exam', icon: Brain },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Logo & System Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-cyan-700 flex items-center justify-center font-bold text-white text-sm tracking-wider">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white">
                  GATI
                </span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  CLASS 9 MOTION
                </span>
                {authSession.role === 'admin' ? (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 font-bold">
                    ADMIN MODE
                  </span>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                    STUDENT: {studentProfile.rollNumber || '9A-01'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* If Admin, show Quick Admin Console Toggle */}
            {authSession.role === 'admin' && (
              <button
                onClick={onSwitchToAdmin}
                className={`px-2.5 py-1.5 rounded border text-xs uppercase font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-amber-600 text-white border-amber-500'
                    : 'bg-slate-900 text-amber-300 border-amber-800 hover:bg-slate-850'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Console</span>
              </button>
            )}

            {/* Learning Method Selector */}
            <div className="relative group">
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded border border-slate-700 bg-slate-900 text-xs text-slate-200 hover:border-slate-600 transition"
                title="Current Learning Method"
              >
                <StyleIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">{currentStyleMeta.label}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              <div className="absolute right-0 mt-1.5 w-48 rounded bg-slate-900 border border-slate-700 shadow-xl p-1 hidden group-hover:block z-50">
                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase text-slate-400 border-b border-slate-800">
                  SELECT METHOD
                </div>
                {(['visual', 'auditory', 'kinesthetic', 'reading'] as LearningStyle[]).map(style => {
                  const item = learningStyleLabels[style];
                  const ItemIcon = item.icon;
                  const isSelected = studentProfile.learningStyle === style;
                  return (
                    <button
                      key={style}
                      onClick={() => onSelectLearningStyle(style)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition ${
                        isSelected
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ItemIcon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </div>
                      {isSelected && <span className="text-[10px] text-cyan-400">ACTIVE</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Auth / Profile button */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition"
              title="Click to switch role or edit profile"
            >
              <div className="w-5 h-5 rounded bg-slate-800 border border-slate-700 text-cyan-400 font-bold text-[11px] flex items-center justify-center">
                {authSession.role === 'admin' ? 'A' : (studentProfile.name || 'S').charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline font-sans font-medium text-white max-w-[110px] truncate">
                {authSession.role === 'admin' ? 'Administrator' : studentProfile.name || 'Student'}
              </span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto py-1.5 border-t border-slate-800 text-xs">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1 rounded transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
