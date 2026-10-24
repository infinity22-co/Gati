export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading';
export type UserRole = 'student' | 'admin';

export interface AuthSession {
  role: UserRole;
  userId: string;
  username: string;
  name: string;
  email?: string;
  token?: string;
  isAuthenticated: boolean;
}

export interface StudentProfile {
  id: string;
  name: string;
  rollNumber?: string;
  grade: string;
  avatarColor: string;
  learningStyle: LearningStyle;
  examCompleted: boolean;
  examScores?: {
    visual: number;
    auditory: number;
    kinesthetic: number;
    reading: number;
  };
  streakDays: number;
  completedTopics: string[];
  totalDoubtsAsked?: number;
  lastActive?: string;
}

export interface CurriculumTopic {
  id: string;
  title: string;
  tagline: string;
  durationMinutes: number;
  ncertSection: string;
  concepts: string[];
  keyFormula?: string;
  summary: string;
  teacherSpeechScript: string;
  diagramSvg?: string;
}

export interface ExamQuestion {
  id: number;
  question: string;
  scenario: string;
  options: {
    text: string;
    style: LearningStyle;
    tag: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  speechSummary?: string;
  keyTakeaways?: string[];
  suggestedQuestions?: string[];
  diagramSvg?: string;
  diagramType?: string;
}

export interface PresetDoubt {
  id: string;
  question: string;
  category: string;
  preview: string;
}

export interface SystemConfig {
  aiProvider: 'openai' | 'gemini' | 'auto';
  openAiModel: string;
  geminiModel: string;
  temperature: number;
  systemPromptOverride?: string;
  speechSynthesisEnabled: boolean;
  mockModeAllowed: boolean;
}

export interface DoubtAuditLog {
  id: string;
  timestamp: string;
  studentName: string;
  query: string;
  topic: string;
  resolved: boolean;
}
