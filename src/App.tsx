import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AIClassroom } from './components/AIClassroom';
import { PictureLearningView } from './components/PictureLearningView';
import { PhysicsSimulator } from './components/PhysicsSimulator';
import { DoubtSolver } from './components/DoubtSolver';
import { NotesViewer } from './components/NotesViewer';
import { IntellectualExam } from './components/IntellectualExam';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginModal } from './components/LoginModal';
import { LearningStyle, StudentProfile, AuthSession } from './types';

const PROFILE_KEY = 'gati_student_profile_v2';
const AUTH_KEY = 'gati_auth_session_v2';

export default function App() {
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(PROFILE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse stored profile:', e);
      }
    }
    return {
      id: 'student-default',
      name: 'Aarav Sharma',
      rollNumber: '9A-04',
      grade: 'Class 9 (CBSE / NCERT)',
      avatarColor: 'cyan',
      learningStyle: 'visual',
      examCompleted: false,
      streakDays: 1,
      completedTopics: [],
    };
  });

  const [authSession, setAuthSession] = useState<AuthSession>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(AUTH_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.warn('Failed to parse auth session:', e);
      }
    }
    return {
      role: 'student',
      userId: 'std-default',
      username: '9A-04',
      name: 'Aarav Sharma',
      isAuthenticated: true,
    };
  });

  const [activeTab, setActiveTab] = useState<string>('classroom');
  const [currentSpeechText, setCurrentSpeechText] = useState<string>(
    'Welcome to GATI, the AI teaching system for Class 9 Physics: Motion. Select any curriculum topic, query the doubt solver, or initiate the diagnostic assessment to configure your optimal learning method.'
  );
  const [externalDoubtPrompt, setExternalDoubtPrompt] = useState<string>('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(studentProfile));
    } catch (e) {
      console.warn('Error saving profile:', e);
    }
  }, [studentProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(authSession));
    } catch (e) {
      console.warn('Error saving auth:', e);
    }
  }, [authSession]);

  const handleSelectLearningStyle = (style: LearningStyle) => {
    setStudentProfile(prev => ({ ...prev, learningStyle: style }));

    if (style === 'visual') {
      setActiveTab('picture');
      setCurrentSpeechText('GATI configured for Picture-Based Learning. Vector schematics and graphical representations are loaded.');
    } else if (style === 'auditory') {
      setActiveTab('classroom');
      setCurrentSpeechText('GATI configured for Auditory Mode. Verbal pedagogy and explanations enabled.');
    } else if (style === 'kinesthetic') {
      setActiveTab('sandbox');
      setCurrentSpeechText('GATI configured for Simulation Mode. Kinematic sliders and real-time telemetry active.');
    } else if (style === 'reading') {
      setActiveTab('notes');
      setCurrentSpeechText('GATI configured for Structured Notes Mode. Formula directory and NCERT summaries loaded.');
    }
  };

  const handleExamComplete = (recommendedStyle: LearningStyle, scores: Record<LearningStyle, number>) => {
    setStudentProfile(prev => ({
      ...prev,
      learningStyle: recommendedStyle,
      examCompleted: true,
      examScores: scores,
    }));

    setCurrentSpeechText(
      `Diagnostic assessment complete. GATI configured for ${recommendedStyle.toUpperCase()} learning modality.`
    );
  };

  const handleAskDoubt = (doubt: string) => {
    setExternalDoubtPrompt(doubt);
    setActiveTab('doubts');
  };

  const handleToggleCompleteTopic = (topicId: string) => {
    setStudentProfile(prev => {
      const exists = prev.completedTopics?.includes(topicId);
      const updated = exists
        ? prev.completedTopics.filter(id => id !== topicId)
        : [...(prev.completedTopics || []), topicId];
      return {
        ...prev,
        completedTopics: updated,
      };
    });
  };

  const handleSaveProfile = (updatedProfile: StudentProfile, startExam: boolean) => {
    setStudentProfile(updatedProfile);
    setAuthSession({
      role: 'student',
      userId: updatedProfile.id || `std_${Date.now()}`,
      username: updatedProfile.rollNumber || 'student',
      name: updatedProfile.name,
      isAuthenticated: true,
    });
    if (startExam) {
      setActiveTab('exam');
      setCurrentSpeechText('Starting GATI Diagnostic Assessment. Please complete the 5 cognitive questions.');
    }
  };

  const handleAdminLogin = (session: AuthSession) => {
    setAuthSession(session);
    setActiveTab('admin');
    setCurrentSpeechText('Admin authentication verified. System monitoring and telemetry dashboard initialized.');
  };

  const handleLogout = () => {
    setAuthSession({
      role: 'student',
      userId: 'std-guest',
      username: 'guest',
      name: 'Guest Student',
      isAuthenticated: false,
    });
    setActiveTab('classroom');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Header with Role and Profile Indicators */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        studentProfile={studentProfile}
        authSession={authSession}
        onOpenProfile={() => setIsLoginModalOpen(true)}
        onSelectLearningStyle={handleSelectLearningStyle}
        onSwitchToAdmin={() => setActiveTab('admin')}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'admin' && (
          <AdminDashboard
            onSwitchToStudentView={() => setActiveTab('classroom')}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'classroom' && (
          <AIClassroom
            studentProfile={studentProfile}
            currentSpeechText={currentSpeechText}
            onUpdateSpeech={setCurrentSpeechText}
            onAskDoubt={handleAskDoubt}
            onSwitchTab={setActiveTab}
            onToggleCompleteTopic={handleToggleCompleteTopic}
          />
        )}

        {activeTab === 'picture' && (
          <PictureLearningView
            onSelectTopicDoubt={handleAskDoubt}
            onUpdateSpeech={setCurrentSpeechText}
          />
        )}

        {activeTab === 'doubts' && (
          <DoubtSolver
            learningStyle={studentProfile.learningStyle}
            onUpdateTeacherSpeech={setCurrentSpeechText}
            externalDoubtPrompt={externalDoubtPrompt}
          />
        )}

        {activeTab === 'sandbox' && (
          <PhysicsSimulator onAskDoubt={handleAskDoubt} />
        )}

        {activeTab === 'notes' && (
          <NotesViewer
            learningStyle={studentProfile.learningStyle}
            onUpdateSpeech={setCurrentSpeechText}
          />
        )}

        {activeTab === 'exam' && (
          <IntellectualExam
            studentProfile={studentProfile}
            onExamComplete={handleExamComplete}
            onSwitchMode={handleSelectLearningStyle}
          />
        )}
      </main>

      {/* Role-Based Login Modal (Student & Admin) */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentProfile={studentProfile}
        onSaveProfile={handleSaveProfile}
        onAdminLogin={handleAdminLogin}
      />

      {/* System Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 mt-12 py-6 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-300">GATI</span> • Class 9 NCERT Physics Chapter: Motion
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Role-Based Access: Admin / Student</span>
            <span>•</span>
            <span>OpenAI API / Gemini AI Gateway</span>
            <span>•</span>
            <span>Deterministic Schematics</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
