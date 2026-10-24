import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Users, Settings, Database, RefreshCw, CheckCircle, Terminal } from 'lucide-react';
import { CURRICULUM_TOPICS } from '../data/motionCurriculum';

interface AdminDashboardProps {
  onSwitchToStudentView: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSwitchToStudentView,
  onLogout,
}) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'gemini'>('openai');
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4o-mini');
  const [temperature, setTemperature] = useState<number>(0.6);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();
      if (data.success) {
        setMetrics(data);
        if (data.config) {
          setSelectedProvider(data.config.aiProvider || 'openai');
          setSelectedModel(data.config.openAiModel || 'gpt-4o-mini');
          setTemperature(data.config.temperature || 0.6);
        }
      }
    } catch (e) {
      console.error('Failed to fetch admin metrics:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aiProvider: selectedProvider,
          openAiModel: selectedModel,
          temperature,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus('CONFIGURATION PERSISTED');
        setTimeout(() => setSaveStatus(null), 2500);
      }
    } catch (e) {
      console.error('Failed to update config:', e);
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Top Admin Header Bar */}
      <div className="rounded border border-slate-700 bg-slate-900 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              GATI ADMINISTRATIVE CONSOLE [SYS_ADMIN]
            </h2>
          </div>
          <p className="text-slate-400 mt-0.5 text-[11px]">
            Class 9 Physics Engine • Multi-Modal Curriculum Operations • OpenAI / Gemini Gateway
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchMetrics}
            className="px-3 py-1.5 rounded border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> SYNC
          </button>
          <button
            onClick={onSwitchToStudentView}
            className="px-3 py-1.5 rounded border border-cyan-700 bg-cyan-950 text-cyan-300 hover:bg-cyan-900 transition flex items-center gap-1.5"
          >
            STUDENT PORTAL →
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded border border-rose-900 bg-rose-950/60 text-rose-300 hover:bg-rose-900 transition"
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* Primary KPI Hardcoded Telemetry Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded border border-slate-800 bg-slate-950">
          <span className="text-slate-500 block uppercase">ENROLLED STUDENTS</span>
          <div className="text-lg font-bold text-white mt-1">
            {metrics?.stats?.totalStudentsEnrolled || '42'}
          </div>
          <span className="text-[10px] text-slate-400">Class 9 CBSE Section A & B</span>
        </div>

        <div className="p-3.5 rounded border border-slate-800 bg-slate-950">
          <span className="text-slate-500 block uppercase">ACTIVE SESSIONS TODAY</span>
          <div className="text-lg font-bold text-cyan-400 mt-1">
            {metrics?.stats?.activeToday || '18'}
          </div>
          <span className="text-[10px] text-slate-400">Concurrent telemetry</span>
        </div>

        <div className="p-3.5 rounded border border-slate-800 bg-slate-950">
          <span className="text-slate-500 block uppercase">DOMINANT MODALITY</span>
          <div className="text-lg font-bold text-emerald-400 mt-1">
            {metrics?.stats?.dominantLearningStyle || 'Visual (44%)'}
          </div>
          <span className="text-[10px] text-slate-400">VARK Diagnostic Output</span>
        </div>

        <div className="p-3.5 rounded border border-slate-800 bg-slate-950">
          <span className="text-slate-500 block uppercase">DOUBTS PROCESSED</span>
          <div className="text-lg font-bold text-purple-400 mt-1">
            {metrics?.stats?.totalDoubtsResolved || '137'}
          </div>
          <span className="text-[10px] text-slate-400">Auto-resolved with diagrams</span>
        </div>
      </div>

      {/* AI Engine & Provider Configuration */}
      <div className="rounded border border-slate-800 bg-slate-900 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              AI ENGINE & INFERENCE GATEWAY CONFIGURATION
            </span>
          </div>
          {saveStatus && (
            <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800">
              {saveStatus}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-slate-400 block mb-1 uppercase">Active Engine Provider</label>
            <select
              value={selectedProvider}
              onChange={e => setSelectedProvider(e.target.value as any)}
              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="openai">OpenAI API (gpt-4o-mini / gpt-4o)</option>
              <option value="gemini">Google Gemini (@google/genai)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1 uppercase">Model Endpoint</label>
            <select
              value={selectedModel}
              onChange={e => setSelectedModel(e.target.value)}
              className="w-full px-3 py-2 rounded bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="gpt-4o-mini">OpenAI: gpt-4o-mini (Recommended for speed)</option>
              <option value="gpt-4o">OpenAI: gpt-4o (High-precision physics reasoning)</option>
              <option value="gemini-3.8-flash">Gemini: gemini-3.8-flash</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1 uppercase">
              <span>Sampling Temperature</span>
              <span className="text-cyan-400">{temperature}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={e => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer mt-1"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-slate-400 text-[11px]">
            Connected Backend: {metrics?.stats?.aiProviderStatus || 'Deterministic Physics Engine Active'}
          </span>
          <button
            onClick={handleSaveConfig}
            className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white uppercase font-bold tracking-wider transition"
          >
            Apply Config Changes
          </button>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="rounded border border-slate-800 bg-slate-900 p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            STUDENT ENROLLMENT & MODALITY ROSTER
          </span>
          <span className="text-slate-400">TOTAL: {metrics?.roster?.length || 4} RECORDS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 uppercase text-[10px]">
                <th className="py-2 px-3">Roll ID</th>
                <th className="py-2 px-3">Student Name</th>
                <th className="py-2 px-3">Diagnostic Modality</th>
                <th className="py-2 px-3">Exam Score</th>
                <th className="py-2 px-3">Doubts Asked</th>
                <th className="py-2 px-3">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {(metrics?.roster || [
                { id: 'std-101', name: 'Aarav Sharma', roll: '9A-04', learningStyle: 'visual', examScore: 85, doubtsCount: 6, lastActive: '2m ago' },
                { id: 'std-102', name: 'Priya Patel', roll: '9A-12', learningStyle: 'auditory', examScore: 92, doubtsCount: 4, lastActive: '14m ago' },
                { id: 'std-103', name: 'Rohan Verma', roll: '9B-08', learningStyle: 'kinesthetic', examScore: 78, doubtsCount: 9, lastActive: '1h ago' },
                { id: 'std-104', name: 'Ananya Iyer', roll: '9A-19', learningStyle: 'reading', examScore: 95, doubtsCount: 3, lastActive: '3h ago' },
              ]).map((std: any) => (
                <tr key={std.id} className="hover:bg-slate-800/40 text-slate-300">
                  <td className="py-2.5 px-3 font-mono text-cyan-400">{std.roll}</td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-white">{std.name}</td>
                  <td className="py-2.5 px-3 uppercase text-xs">
                    <span className="px-2 py-0.5 rounded border border-slate-700 bg-slate-950 text-slate-300">
                      {std.learningStyle}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400">{std.examScore}%</td>
                  <td className="py-2.5 px-3 font-mono">{std.doubtsCount}</td>
                  <td className="py-2.5 px-3 text-slate-500">{std.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Doubt Audit Log */}
      <div className="rounded border border-slate-800 bg-slate-900 p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            RECENT STUDENT DOUBT INQUIRIES & RESOLUTIONS
          </span>
          <span className="text-slate-400">AUDIT LOG</span>
        </div>

        <div className="space-y-2">
          {(metrics?.recentDoubts || [
            { id: 'd-1', timestamp: '10:42 AM', studentName: 'Aarav Sharma', query: 'Can displacement be zero when distance is non-zero?', topic: 'Distance vs Displacement', resolved: true },
            { id: 'd-2', timestamp: '11:15 AM', studentName: 'Rohan Verma', query: 'Why is circular motion called accelerated if speed is constant?', topic: 'Circular Motion', resolved: true },
            { id: 'd-3', timestamp: '11:58 AM', studentName: 'Priya Patel', query: 'How does area under v-t graph calculate distance?', topic: 'Graphical Kinematics', resolved: true },
          ]).map((log: any) => (
            <div
              key={log.id}
              className="p-3 rounded border border-slate-800 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">{log.studentName}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400 uppercase text-[10px]">{log.topic}</span>
                  <span className="text-slate-600 font-mono text-[10px]">[{log.timestamp}]</span>
                </div>
                <p className="text-slate-300 font-sans mt-0.5 text-xs">
                  "{log.query}"
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] uppercase font-bold shrink-0 self-start sm:self-center">
                Resolved by AI
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Curriculum Manifest Inspector */}
      <div className="rounded border border-slate-800 bg-slate-900 p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            CLASS 9 MOTION CURRICULUM SPECIFICATION
          </span>
          <span className="text-slate-400">{CURRICULUM_TOPICS.length} MODULES DEPLOYED</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {CURRICULUM_TOPICS.map(topic => (
            <div key={topic.id} className="p-2.5 rounded border border-slate-800 bg-slate-950 flex justify-between items-center">
              <div>
                <span className="text-white font-sans text-xs font-semibold block">{topic.title}</span>
                <span className="text-[10px] text-slate-500 uppercase">{topic.ncertSection}</span>
              </div>
              <span className="text-cyan-400 font-mono text-xs">{topic.durationMinutes}m</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
