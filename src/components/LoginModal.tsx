import React, { useState } from 'react';
import { X, Lock, User, ShieldCheck } from 'lucide-react';
import { LearningStyle, StudentProfile, AuthSession } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: StudentProfile;
  onSaveProfile: (profile: StudentProfile, startExam: boolean) => void;
  onAdminLogin: (session: AuthSession) => void;
}

const AVATAR_COLORS = [
  { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-600' },
  { id: 'blue', label: 'Blue', bg: 'bg-blue-600' },
  { id: 'slate', label: 'Slate', bg: 'bg-slate-600' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-600' },
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-600' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-600' },
];

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  onAdminLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');

  // Student form state
  const [name, setName] = useState<string>(currentProfile.name || '');
  const [rollNumber, setRollNumber] = useState<string>(currentProfile.rollNumber || '9A-01');
  const [grade, setGrade] = useState<string>(currentProfile.grade || 'Class 9 (CBSE / NCERT)');
  const [selectedColor, setSelectedColor] = useState<string>(currentProfile.avatarColor || 'cyan');
  const [preferredStyle, setPreferredStyle] = useState<LearningStyle>(currentProfile.learningStyle || 'visual');
  const [takeExamFirst, setTakeExamFirst] = useState<boolean>(!currentProfile.examCompleted);

  // Admin form state
  const [adminUsername, setAdminUsername] = useState<string>('admin');
  const [adminPassword, setAdminPassword] = useState<string>('admin123');
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminLoading, setAdminLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentProfile = {
      ...currentProfile,
      name: name.trim() || 'Student',
      rollNumber: rollNumber.trim() || '9A-01',
      grade,
      avatarColor: selectedColor,
      learningStyle: preferredStyle,
    };
    onSaveProfile(updated, takeExamFirst);
    onClose();
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'admin',
          username: adminUsername,
          password: adminPassword,
        }),
      });

      const data = await res.json();
      if (data.success && data.session) {
        onAdminLogin(data.session);
        onClose();
      } else {
        setAdminError(data.error || 'Authentication rejected. Verify admin credentials.');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      // Hardcoded offline fallback for admin
      if (adminUsername === 'admin' && (adminPassword === 'admin' || adminPassword === 'admin123')) {
        onAdminLogin({
          role: 'admin',
          userId: 'admin-01',
          username: 'admin',
          name: 'System Administrator',
          email: 'admin@gati.edu',
          isAuthenticated: true,
        });
        onClose();
      } else {
        setAdminError('Connection error. Use username "admin" and password "admin123".');
      }
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 font-mono">
      <div className="bg-slate-900 border border-slate-700 rounded max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-4 pb-3 border-b border-slate-800">
          <span className="text-[10px] text-cyan-400 uppercase tracking-widest block font-bold">
            GATI ACCESS GATEWAY
          </span>
          <h3 className="text-sm font-bold text-white uppercase mt-0.5">
            AUTHENTICATION & PROFILE DISPATCH
          </h3>
        </div>

        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 border border-slate-800 rounded mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`py-1.5 px-3 rounded transition uppercase flex items-center justify-center gap-1.5 ${
              activeTab === 'student'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Student Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`py-1.5 px-3 rounded transition uppercase flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Admin Portal
          </button>
        </div>

        {activeTab === 'student' ? (
          /* Student Form */
          <form onSubmit={handleStudentSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 uppercase text-[10px]">Student Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-sans"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 uppercase text-[10px]">Roll / ID Number</label>
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={e => setRollNumber(e.target.value)}
                  placeholder="e.g. 9A-04"
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 uppercase text-[10px]">Curriculum Stream</label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value)}
                className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500 text-xs"
              >
                <option value="Class 9 (CBSE / NCERT)">Class 9 (CBSE / NCERT Science)</option>
                <option value="Class 9 (ICSE Physics)">Class 9 (ICSE Physics)</option>
                <option value="Class 9 (State Board)">Class 9 (State Board)</option>
                <option value="Foundation Prep">Class 9 (Foundation / Olympiad)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 uppercase text-[10px]">Avatar Badge Color</label>
              <div className="grid grid-cols-6 gap-2">
                {AVATAR_COLORS.map(c => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    className={`h-7 rounded border transition flex items-center justify-center font-bold text-white ${c.bg} ${
                      selectedColor === c.id ? 'ring-2 ring-white border-white' : 'border-slate-800 opacity-60'
                    }`}
                  >
                    {name ? name.charAt(0).toUpperCase() : 'S'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={takeExamFirst}
                  onChange={e => setTakeExamFirst(e.target.checked)}
                  className="w-3.5 h-3.5 accent-cyan-500 cursor-pointer"
                />
                <span className="text-cyan-300 font-bold uppercase text-[11px]">
                  Take Diagnostic Exam on Login
                </span>
              </label>
              <p className="text-[10px] text-slate-400 pl-5">
                Automatically maps whether your learning style is Visual, Auditory, Simulation, or Reading.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white uppercase font-bold tracking-wider transition"
            >
              Sign In as Student
            </button>
          </form>
        ) : (
          /* Admin Form */
          <form onSubmit={handleAdminSubmit} className="space-y-3.5 text-xs">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
              <span className="text-cyan-400 font-bold block uppercase mb-0.5">Admin Security Protocol</span>
              Login with institutional credentials to access student telemetry, question logs, and AI API configuration.
            </div>

            {adminError && (
              <div className="p-2.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 text-[11px]">
                {adminError}
              </div>
            )}

            <div>
              <label className="text-slate-400 block mb-1 uppercase text-[10px]">Admin Username / Email</label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={e => setAdminUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Default: admin</span>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 uppercase text-[10px]">Admin Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                placeholder="admin123"
                className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Default: admin123</span>
            </div>

            <button
              type="submit"
              disabled={adminLoading}
              className="w-full py-2.5 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white uppercase font-bold tracking-wider transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {adminLoading ? 'Authenticating...' : 'Sign In as Administrator'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
