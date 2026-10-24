import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// System Runtime Configuration
let systemConfig = {
  aiProvider: (process.env.OPENAI_API_KEY ? 'openai' : 'gemini') as 'openai' | 'gemini' | 'auto',
  openAiModel: 'gpt-4o-mini',
  geminiModel: 'gemini-3.8-flash',
  temperature: 0.6,
  speechSynthesisEnabled: true,
  mockModeAllowed: true,
};

// In-Memory Telemetry & Audit Logs for Admin Monitoring
const studentRoster = [
  { id: 'std-101', name: 'Aarav Sharma', roll: '9A-04', learningStyle: 'visual', examScore: 85, doubtsCount: 6, lastActive: '2m ago' },
  { id: 'std-102', name: 'Priya Patel', roll: '9A-12', learningStyle: 'auditory', examScore: 92, doubtsCount: 4, lastActive: '14m ago' },
  { id: 'std-103', name: 'Rohan Verma', roll: '9B-08', learningStyle: 'kinesthetic', examScore: 78, doubtsCount: 9, lastActive: '1h ago' },
  { id: 'std-104', name: 'Ananya Iyer', roll: '9A-19', learningStyle: 'reading', examScore: 95, doubtsCount: 3, lastActive: '3h ago' },
];

const doubtAuditLogs: Array<{ id: string; timestamp: string; studentName: string; query: string; topic: string; resolved: boolean }> = [
  { id: 'd-1', timestamp: '10:42 AM', studentName: 'Aarav Sharma', query: 'Can displacement be zero when distance is non-zero?', topic: 'Distance vs Displacement', resolved: true },
  { id: 'd-2', timestamp: '11:15 AM', studentName: 'Rohan Verma', query: 'Why is circular motion called accelerated if speed is constant?', topic: 'Circular Motion', resolved: true },
  { id: 'd-3', timestamp: '11:58 AM', studentName: 'Priya Patel', query: 'How does area under v-t graph calculate distance?', topic: 'Graphical Kinematics', resolved: true },
];

// Initialize GoogleGenAI server-side with telemetry header
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback intelligent answers for Class 9 Motion if API key is not available
const FALLBACK_KNOWLEDGE: Record<string, { title: string; answer: string; diagramType?: string; notes: string[] }> = {
  'displacement_zero': {
    title: 'Can displacement be zero when distance is not zero?',
    answer: 'Yes. When an object completes a closed round-trip journey (such as one full lap of a 400m circular track), its initial and final position vectors coincide. The distance traveled is 400 meters (a scalar total path length), but the net displacement is 0 meters (a vector straight-line difference).',
    diagramType: 'circular_track',
    notes: [
      'Distance is always greater than or equal to |Displacement|.',
      'Distance is scalar (magnitude only); Displacement is vector (magnitude + direction).',
      'For any closed loop path, displacement is identically zero.',
    ]
  },
  'circular_motion_acceleration': {
    title: 'Why is uniform circular motion called accelerated motion?',
    answer: 'In uniform circular motion, an object moves along a circular path at constant speed. However, because the direction of the velocity vector is continuously changing at every single point along the tangent, the velocity itself is constantly varying. Since acceleration is defined as a = Δv / Δt, this continuous directional change constitutes centripetal acceleration directed radially inward.',
    diagramType: 'circular_motion',
    notes: [
      'Speed remains constant, but velocity vector changes direction continually.',
      'Direction of velocity is tangential: v = 2πr / t.',
      'Centripetal acceleration is directed radially inward towards the center.',
    ]
  },
  'area_under_vt_graph': {
    title: 'How does the area under a v-t graph give distance/displacement?',
    answer: 'Since velocity is defined as displacement per unit time (v = s/t), displacement equals velocity multiplied by time (s = v × t). On a Velocity-Time graph, multiplying the height (m/s) by the base (s) yields meters (m). Hence, the geometric area bounded under the curve equals total displacement.',
    diagramType: 'vt_graph_area',
    notes: [
      'Area under v-t graph = Displacement.',
      'Slope of v-t graph = Acceleration (a = Δv / Δt).',
      'Slope of s-t (distance-time) graph = Speed or Velocity.',
    ]
  },
  'equations_of_motion': {
    title: 'What are the 3 Equations of Motion and when do they apply?',
    answer: 'The three equations of motion apply strictly for rectilinear motion with uniform (constant) acceleration:\n1. First Equation: v = u + at (Velocity-Time Relation)\n2. Second Equation: s = ut + ½at² (Position-Time Relation)\n3. Third Equation: v² - u² = 2as (Position-Velocity Relation)\nWhere u = initial velocity, v = final velocity, a = acceleration, t = time, s = displacement.',
    diagramType: 'equations_graphic',
    notes: [
      'Applicable only when acceleration is constant.',
      'If an object starts from rest, u = 0.',
      'If an object stops or brakes, v = 0.',
      'Freely falling body: a = +g (approx 9.8 m/s²).',
    ]
  }
};

// Route: Authentication for Admin and Student
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { role, username, rollNumber, password, name } = req.body;

  if (role === 'admin') {
    // Admin login verification
    const validUsernames = ['admin', 'admin@gati.edu', 'instructor'];
    const validPasswords = ['admin', 'admin123', 'gati2026', 'password'];

    const userMatch = validUsernames.includes((username || '').toLowerCase().trim());
    const passMatch = validPasswords.includes((password || '').trim()) || password === 'admin';

    if (userMatch && passMatch) {
      return res.json({
        success: true,
        session: {
          role: 'admin',
          userId: 'admin-01',
          username: username || 'admin',
          name: 'System Administrator',
          email: 'admin@gati.edu',
          token: `admin_token_${Date.now()}`,
          isAuthenticated: true,
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid administrator credentials. (Default: username "admin", password "admin123")',
    });
  }

  // Student login
  const studentName = name || username || 'Student';
  const studentRoll = rollNumber || '9A-01';

  return res.json({
    success: true,
    session: {
      role: 'student',
      userId: `std_${Date.now()}`,
      username: username || studentRoll,
      name: studentName,
      token: `std_token_${Date.now()}`,
      isAuthenticated: true,
    },
  });
});

// Route: Admin Telemetry & Metrics
app.get('/api/admin/metrics', (_req: Request, res: Response) => {
  res.json({
    success: true,
    roster: studentRoster,
    recentDoubts: doubtAuditLogs,
    config: systemConfig,
    stats: {
      totalStudentsEnrolled: 42,
      activeToday: 18,
      avgDiagnosticScore: '86.4%',
      dominantLearningStyle: 'Visual (44%)',
      totalDoubtsResolved: 137,
      aiProviderStatus: process.env.OPENAI_API_KEY ? 'OpenAI API Connected' : geminiApiKey ? 'Gemini API Connected' : 'Deterministic Physics Engine Active',
    },
  });
});

// Route: Admin Configuration Update
app.post('/api/admin/config', (req: Request, res: Response) => {
  const { aiProvider, openAiModel, geminiModel, temperature, speechSynthesisEnabled } = req.body;
  if (aiProvider) systemConfig.aiProvider = aiProvider;
  if (openAiModel) systemConfig.openAiModel = openAiModel;
  if (geminiModel) systemConfig.geminiModel = geminiModel;
  if (typeof temperature === 'number') systemConfig.temperature = temperature;
  if (typeof speechSynthesisEnabled === 'boolean') systemConfig.speechSynthesisEnabled = speechSynthesisEnabled;

  res.json({ success: true, config: systemConfig });
});

// Helper: Call OpenAI API
async function callOpenAiApi(message: string, topic: string, learningStyle: string, conversationHistory: any[]) {
  const openAiApiKey = process.env.OPENAI_API_KEY;
  if (!openAiApiKey) return null;

  const systemPrompt = `You are "GATI AI Engine", an authoritative, precise AI Teacher specializing in Class 9 NCERT Physics, Chapter: "Motion".
Your goal is to teach concepts with scientific rigor, clear doubts step-by-step, prepare clean SVG diagrams, and tailor your tone to the student's selected learning style: "${learningStyle || 'Visual'}".
Respond strictly in JSON format with keys:
- "speechSummary": a 2-3 sentence concise spoken script that the AI face avatar can read out loud to the student.
- "explanation": complete well-formatted markdown explanation with precise NCERT definitions and SI units.
- "keyTakeaways": array of 3 bullet points.
- "suggestedQuestions": array of 2-3 logical follow-up doubts.
- "diagramSvg": optional clean SVG string (width="400" height="220" viewBox="0 0 400 220") if a visual schematic helps.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'assistant',
      content: h.text,
    })),
    {
      role: 'user',
      content: `Topic: ${topic || 'Class 9 Motion'}\nStudent doubt/question: "${message}"\nRespond in JSON adhering to system instruction.`,
    },
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openAiApiKey}`,
    },
    body: JSON.stringify({
      model: systemConfig.openAiModel || 'gpt-4o-mini',
      messages,
      temperature: systemConfig.temperature || 0.6,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API responded with status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const rawText = data.choices?.[0]?.message?.content || '{}';
  return JSON.parse(rawText);
}

// Route: AI Chat & Doubt Clearing for Class 9 Motion (Supports OpenAI and Gemini)
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { message, topic = 'Class 9 Motion', learningStyle = 'visual', conversationHistory = [], studentName = 'Student' } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Valid message prompt is required.' });
  }

  // Record into doubt audit log
  doubtAuditLogs.unshift({
    id: `d-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    studentName,
    query: message.slice(0, 80),
    topic: topic.slice(0, 30),
    resolved: true,
  });
  if (doubtAuditLogs.length > 20) doubtAuditLogs.pop();

  // Try OpenAI API first if key configured or provider is openai
  if (process.env.OPENAI_API_KEY && (systemConfig.aiProvider === 'openai' || systemConfig.aiProvider === 'auto')) {
    try {
      const openAiResult = await callOpenAiApi(message, topic, learningStyle, conversationHistory);
      if (openAiResult) {
        return res.json({ success: true, provider: 'OpenAI API', ...openAiResult });
      }
    } catch (err: any) {
      console.warn('OpenAI API call failed, falling back to Gemini:', err?.message);
    }
  }

  // Try GoogleGenAI
  if (ai) {
    try {
      const systemInstruction = `You are "GATI AI Engine", an authoritative, precise AI Teacher specializing in Class 9 NCERT Physics, Chapter: "Motion".
Your goal is to teach concepts with crystal clarity, clear doubts step-by-step, prepare clean SVG diagrams, and tailor your tone to the student's selected learning style: "${learningStyle || 'Visual'}".
Guidelines:
1. Break down concepts using clear Class 9 scientific examples (vehicles on straight roads, circular tracks, vertical toss).
2. Use precise Class 9 NCERT definitions and SI units (meters, seconds, m/s, m/s²).
3. If the user asks for a diagram or has a visual doubt, include a clean SVG diagram code block starting with \`\`\`svg and ending with \`\`\`.
4. Provide a structured response:
   - "speechSummary": a 2-3 sentence concise spoken script that the AI face avatar can read out loud to the student.
   - "explanation": complete well-formatted markdown explanation.
   - "keyTakeaways": array of 3 bullet points.
   - "suggestedQuestions": array of 2-3 logical follow-up doubts the student might have.
   - "diagramSvg": optional clean SVG string (width="400" height="220" viewBox="0 0 400 220") if a visual helps.
Always format output strictly as JSON with those keys.`;

      const contents = [
        ...conversationHistory.map((h: any) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        })),
        {
          role: 'user',
          parts: [{ text: `Topic: ${topic || 'Class 9 Motion'}\nStudent doubt/question: "${message}"\nRespond in JSON adhering to system instruction.` }],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const responseText = response.text || '{}';
      try {
        const parsed = JSON.parse(responseText);
        return res.json({ success: true, provider: 'Gemini API', ...parsed });
      } catch (e) {
        return res.json({
          success: true,
          provider: 'Gemini API',
          explanation: responseText,
          speechSummary: responseText.slice(0, 180) + '...',
          keyTakeaways: ['Review NCERT Chapter 8 / 7 Motion', 'Practice graphical problems', 'Remember SI units'],
          suggestedQuestions: ['Can displacement be zero?', 'How to derive v = u + at?', 'What is acceleration?'],
        });
      }
    } catch (err: any) {
      console.warn('Gemini chat request error, switching to rich fallback:', err?.message);
    }
  }

  // Deterministic pedagogical fallback
  const lower = message.toLowerCase();
  let matchedFallback = FALLBACK_KNOWLEDGE['equations_of_motion'];

  if (lower.includes('displace') || lower.includes('zero') || lower.includes('distance')) {
    matchedFallback = FALLBACK_KNOWLEDGE['displacement_zero'];
  } else if (lower.includes('circular') || lower.includes('direction') || lower.includes('centripetal')) {
    matchedFallback = FALLBACK_KNOWLEDGE['circular_motion_acceleration'];
  } else if (lower.includes('v-t') || lower.includes('graph') || lower.includes('area') || lower.includes('slope')) {
    matchedFallback = FALLBACK_KNOWLEDGE['area_under_vt_graph'];
  }

  return res.json({
    success: true,
    provider: 'GATI Deterministic Core',
    speechSummary: matchedFallback.answer.slice(0, 150) + '...',
    explanation: `### ${matchedFallback.title}\n\n${matchedFallback.answer}\n\n#### Key Formulae & Concepts:\n` +
      matchedFallback.notes.map(n => `- ${n}`).join('\n') +
      `\n\n*Standard SI Units:* Distance & displacement in **meters (m)**, speed & velocity in **m/s**, and acceleration in **m/s²**.`,
    keyTakeaways: matchedFallback.notes,
    suggestedQuestions: [
      'Can displacement be zero when distance is non-zero?',
      'Why is circular motion accelerated even at uniform speed?',
      'How to derive s = ut + 0.5at² graphically?',
    ],
    diagramType: matchedFallback.diagramType,
  });
});

// Route: Automated NCERT Revision Notes Generator
app.post('/api/gemini/notes', async (req: Request, res: Response) => {
  const { topic = 'All Motion Concepts', style = 'Visual & Bulleted' } = req.body;

  // Try OpenAI first if configured
  if (process.env.OPENAI_API_KEY && (systemConfig.aiProvider === 'openai' || systemConfig.aiProvider === 'auto')) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: systemConfig.openAiModel || 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an NCERT Physics Master Educator creating clean, rigorous revision notes for Class 9 students.',
            },
            {
              role: 'user',
              content: `Create comprehensive Class 9 NCERT Physics Revision Notes on the topic: "${topic}". Format with definitions, SI units, formula tables, graphical slopes, and a solved numerical. Style: "${style}".`,
            },
          ],
          temperature: 0.5,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return res.json({ success: true, provider: 'OpenAI API', notes: text });
      }
    } catch (e: any) {
      console.warn('OpenAI notes error:', e?.message);
    }
  }

  // Try Gemini
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Create comprehensive, high-scoring Class 9 NCERT Physics Revision Notes on the topic: "${topic}".
Format with:
1. Definition & Core Principle
2. Scalar vs Vector designation
3. Formulae & SI Units table
4. Graphical representation tips (s-t & v-t graphs)
5. Solved typical exam numerical with step-by-step substitution
6. Common student mistakes to avoid in exams
Ensure high clarity, structured markdown, clear bold highlights, tailored for "${style}" learning style.`,
        config: {
          systemInstruction: 'You are an NCERT Physics Master Educator creating clean revision notes for Class 9 students.',
          temperature: 0.5,
        },
      });

      return res.json({ success: true, provider: 'Gemini API', notes: response.text });
    } catch (err: any) {
      console.warn('Gemini notes generation error, falling back:', err?.message);
    }
  }

  // Pre-compiled comprehensive NCERT Class 9 Motion Revision Notes
  const defaultNotes = `# Class 9 Physics: Motion - Quick Revision Notes

## 1. Describing Motion
- Reference Point (Origin): A fixed coordinate with respect to which the position of an object is described.
- State of Rest: When an object does not change its position with time relative to its surroundings.
- State of Motion: When an object changes its position with time relative to its surroundings. Motion is relative.

---

## 2. Distance vs. Displacement
| Characteristic | Distance | Displacement |
| :--- | :--- | :--- |
| Definition | Total path length traversed by an object. | Shortest straight-line distance from initial to final position. |
| Quantity | Scalar (Magnitude only). | Vector (Magnitude + Direction). |
| Value | Always positive or zero. | Can be positive, zero, or negative. |
| Relation | Distance >= |Displacement|. | |Displacement| <= Distance. |
| SI Unit | Meter (m) | Meter (m) |

---

## 3. Speed and Velocity
- Speed (v): Distance travelled per unit time. v = s / t (Scalar, SI unit: m/s).
- Average Speed: Total Distance / Total Time.
- Velocity (v): Displacement per unit time. v = s / t (Vector, SI unit: m/s).
- Average Velocity: For uniform acceleration: v_avg = (u + v) / 2.

---

## 4. Acceleration (a)
- Rate of change of velocity with time:
  a = (v - u) / t
- SI Unit: m/s²
- Positive Acceleration: Velocity increases with time (v > u).
- Negative Acceleration (Retardation/Deceleration): Velocity decreases with time (v < u).

---

## 5. Graphical Analysis of Motion
1. Distance-Time Graph (s-t):
   - Slope equals Speed (v = Δs / Δt).
   - Horizontal line: Object at rest.
2. Velocity-Time Graph (v-t):
   - Slope equals Acceleration (a = Δv / Δt).
   - Area under v-t graph equals Distance / Displacement.

---

## 6. The Three Equations of Motion (for Uniform Acceleration)
1. First Equation: v = u + at (Velocity-Time Relation)
2. Second Equation: s = ut + ½at² (Position-Time Relation)
3. Third Equation: v² - u² = 2as (Position-Velocity Relation)

---

## 7. Uniform Circular Motion
- Circular path motion at constant speed.
- Direction of velocity changes at every instant (tangential).
- Acceleration directed towards the center (Centripetal Acceleration).
- Speed: v = 2πr / t.

---

## 8. Solved Exam Numerical
Problem: A vehicle starts from rest and accelerates uniformly at 0.1 m/s² for 120 seconds. Find:
(a) Speed acquired, and (b) Distance travelled.
Solution:
- Given: u = 0, a = 0.1 m/s², t = 120 s.
- (a) v = u + at = 0 + (0.1 * 120) = 12 m/s.
- (b) s = ut + ½at² = 0 + ½(0.1)(120)² = 0.05 * 14400 = 720 m.
`;

  return res.json({ success: true, provider: 'GATI Deterministic Core', notes: defaultNotes });
});

// Route: Intellectual Cognitive Assessment Evaluator
app.post('/api/gemini/intellectual-exam', async (req: Request, res: Response) => {
  const { answers, studentName = 'Student' } = req.body;

  let visualScore = 0;
  let auditoryScore = 0;
  let kinestheticScore = 0;
  let readingScore = 0;

  if (Array.isArray(answers)) {
    answers.forEach((ans: any) => {
      if (ans.style === 'visual' || ans.type === 'visual') visualScore += 20;
      else if (ans.style === 'auditory' || ans.type === 'auditory') auditoryScore += 20;
      else if (ans.style === 'kinesthetic' || ans.type === 'kinesthetic') kinestheticScore += 20;
      else if (ans.style === 'reading' || ans.type === 'reading') readingScore += 20;
    });
  }

  const scores = [
    { type: 'visual', label: 'Picture-Based & Visual Learning', score: visualScore || 40 },
    { type: 'auditory', label: 'Auditory Pedagogy', score: auditoryScore || 30 },
    { type: 'kinesthetic', label: 'Kinematic Simulator Sandbox', score: kinestheticScore || 20 },
    { type: 'reading', label: 'Structured Revision Notes', score: readingScore || 30 },
  ];

  scores.sort((a, b) => b.score - a.score);
  const recommended = scores[0];

  return res.json({
    success: true,
    recommendedMethod: recommended.type,
    methodLabel: recommended.label,
    scores: {
      visual: visualScore,
      auditory: auditoryScore,
      kinesthetic: kinestheticScore,
      reading: readingScore,
    },
    cognitiveSummary: `Student ${studentName} diagnostic: Primary cognitive processing is ${recommended.label}. Abstract kinematics are absorbed fastest via ${recommended.type === 'visual' ? 'vector schematics, geometric graphs, and coordinate axes' : recommended.type === 'auditory' ? 'verbal lectures and dialogue' : recommended.type === 'kinesthetic' ? 'interactive variable simulation and parameter adjustment' : 'structured formula directories and mathematical derivations'}.`,
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GATI System Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server startup error:', err);
});
