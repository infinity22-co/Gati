import { CurriculumTopic, ExamQuestion, PresetDoubt } from '../types';

export const CURRICULUM_TOPICS: CurriculumTopic[] = [
  {
    id: 'intro_motion',
    title: '1. Describing Motion & Reference Point',
    tagline: 'Is an object truly at rest or in motion? It depends on who is looking!',
    durationMinutes: 8,
    ncertSection: 'NCERT 8.1',
    concepts: [
      'Origin and Reference Point',
      'Motion is relative (passenger in a moving train vs bystander)',
      'Motion along a straight line (Rectilinear Motion)',
    ],
    summary: 'Motion is a change in position of an object with time relative to a chosen reference point (the origin). An object can be at rest relative to one frame of reference while in motion relative to another.',
    teacherSpeechScript: 'Welcome to Class 9 Physics! Imagine sitting inside a moving train. To your fellow passenger, you are completely at rest. But to someone standing on the platform outside, you are moving at 80 kilometers per hour! This teaches us that motion is relative, and every measurement starts from a Reference Point.',
  },
  {
    id: 'dist_vs_disp',
    title: '2. Distance vs. Displacement',
    tagline: 'Path travelled vs Shortest straight-line shortcut with direction',
    durationMinutes: 12,
    ncertSection: 'NCERT 8.1.1',
    concepts: [
      'Distance: Total path length (Scalar)',
      'Displacement: Shortest straight line from initial to final position (Vector)',
      'Zero displacement with non-zero distance (round trips)',
      'Distance >= |Displacement| always',
    ],
    keyFormula: '|\\vec{s}| \\le d',
    summary: 'Distance is the actual length of the path traversed by a body, regardless of direction. Displacement is the shortest straight-line distance from the initial position to the final position, carrying both magnitude and direction.',
    teacherSpeechScript: 'Here is a classic Class 9 puzzle: Can displacement be zero when distance is four hundred meters? Yes! When you run one full lap on a four hundred meter track, your total distance is four hundred meters, but because you returned to where you started, your displacement is exactly zero!',
  },
  {
    id: 'speed_velocity',
    title: '3. Speed and Velocity',
    tagline: 'How fast an object is moving vs How fast and in which direction',
    durationMinutes: 10,
    ncertSection: 'NCERT 8.2',
    concepts: [
      'Uniform vs Non-uniform Motion',
      'Speed = Distance / Time (m/s)',
      'Average Speed = Total Distance / Total Time',
      'Velocity = Displacement / Time (m/s with direction)',
      'Average Velocity = (u + v) / 2 for uniform acceleration',
    ],
    keyFormula: 'v_{avg} = \\frac{\\text{Total Distance}}{\\text{Total Time}}, \\quad \\vec{v} = \\frac{\\Delta \\vec{s}}{\\Delta t}',
    summary: 'Speed tells us how fast a body travels per unit time (scalar). Velocity gives both the speed and the specific direction of travel (vector). Velocity can change if speed changes, direction changes, or both change.',
    teacherSpeechScript: 'Speed tells us how quickly an object covers ground. Velocity adds something crucial: direction! If a car travels north at sixty kilometers per hour, that is its velocity. If it turns a corner while keeping sixty kilometers per hour, its speed stays constant, but its velocity changes!',
  },
  {
    id: 'acceleration',
    title: '4. Acceleration (Rate of Change of Velocity)',
    tagline: 'Speeding up, slowing down, or changing direction over time',
    durationMinutes: 14,
    ncertSection: 'NCERT 8.3',
    concepts: [
      'Acceleration: a = (v - u) / t',
      'Uniform vs Non-uniform Acceleration',
      'Deceleration / Retardation (Negative Acceleration)',
      'SI Unit: m/s² (meters per second squared)',
    ],
    keyFormula: 'a = \\frac{v - u}{t}',
    summary: 'Acceleration is the measure of the change in velocity of an object per unit time. When an object slows down, its acceleration is negative, called retardation or deceleration.',
    teacherSpeechScript: 'Whenever velocity changes, acceleration is at work. If your car accelerates from rest to twenty meters per second in four seconds, your acceleration is five meters per second squared! And when you hit the brakes, that is negative acceleration, also known as retardation.',
  },
  {
    id: 'graphical_rep',
    title: '5. Graphical Representation of Motion',
    tagline: 'Visualizing motion with Distance-Time (s-t) and Velocity-Time (v-t) graphs',
    durationMinutes: 16,
    ncertSection: 'NCERT 8.4',
    concepts: [
      'Distance-Time (s-t) graph: Slope represents Speed',
      'Velocity-Time (v-t) graph: Slope represents Acceleration',
      'Area under the v-t graph represents Distance / Displacement travelled',
      'Distinguishing uniform vs accelerated curves',
    ],
    keyFormula: '\\text{Slope of } s\\text{-}t = \\text{Speed}, \\quad \\text{Area under } v\\text{-}t = \\text{Displacement}',
    summary: 'Graphs provide a quick, visual picture of motion. The slope of a distance-time graph yields speed. For a velocity-time graph, the slope gives acceleration, and the area bounded under the graph line and the time axis equals the total distance travelled.',
    teacherSpeechScript: 'Physics graphs are magical shortcuts! Remember these two golden exam rules: First, the slope of a distance-time graph gives speed. Second, the area under a velocity-time graph gives the distance travelled! Multiplying velocity by time directly gives distance.',
  },
  {
    id: 'equations_motion',
    title: '6. Three Equations of Motion',
    tagline: 'The universal toolkit for uniformly accelerated rectilinear motion',
    durationMinutes: 20,
    ncertSection: 'NCERT 8.5',
    concepts: [
      'First Equation: v = u + at (Velocity-Time Relation)',
      'Second Equation: s = ut + ½at² (Position-Time Relation)',
      'Third Equation: v² - u² = 2as (Position-Velocity Relation)',
      'Derivations by graphical method using v-t graph',
      'Numerical problem solving strategies',
    ],
    keyFormula: 'v = u + at, \\quad s = ut + \\frac{1}{2}at^2, \\quad v^2 - u^2 = 2as',
    summary: 'When an object travels along a straight line with constant acceleration, its initial velocity (u), final velocity (v), acceleration (a), time elapsed (t), and distance travelled (s) are interconnected by three fundamental equations.',
    teacherSpeechScript: 'These three equations are the heart of Class 9 physics kinematics! Equation one: v equals u plus a t. Equation two: s equals u t plus half a t squared. Equation three: v squared minus u squared equals two a s. Always identify your givens: u, v, a, t, and s, then choose the equation that contains what you need!',
  },
  {
    id: 'circular_motion',
    title: '7. Uniform Circular Motion',
    tagline: 'Constant speed, yet continuously accelerating!',
    durationMinutes: 10,
    ncertSection: 'NCERT 8.6',
    concepts: [
      'Motion in a circular path at constant speed',
      'Direction of motion changes at every single point (tangential)',
      'Why it is accelerated motion (Centripetal acceleration)',
      'Speed calculation: v = 2πr / t',
      'Real examples: Moon around Earth, athlete on circular track',
    ],
    keyFormula: 'v = \\frac{2\\pi r}{t}',
    summary: 'When an object moves in a circular path with constant speed, its direction changes continuously, meaning its velocity is constantly changing. Hence, uniform circular motion is always an accelerated motion.',
    teacherSpeechScript: 'Picture whirling a stone tied to a string. Even if the stone travels at a steady five meters per second, its direction changes every microsecond. Because velocity is a vector, this continuous direction change means it is accelerating toward the center! The speed is two pi r divided by t.',
  },
];

export const INTELLECTUAL_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 1,
    question: 'How do you understand a new physics concept (like Acceleration) best?',
    scenario: 'You are learning how velocity changes over time.',
    options: [
      {
        text: 'Looking at diagrams, infographics, and graphical slope curves (v-t graphs).',
        style: 'visual',
        tag: 'Spatial & Diagrammatic',
      },
      {
        text: 'Listening to an animated teacher explain the intuition out loud step-by-step.',
        style: 'auditory',
        tag: 'Verbal & Conversational',
      },
      {
        text: 'Adjusting a live slider on a car simulator to feel how acceleration speeds up the vehicle.',
        style: 'kinesthetic',
        tag: 'Hands-on Simulation',
      },
      {
        text: 'Reading clear bullet-point notes with definitions, SI units, and formula tables.',
        style: 'reading',
        tag: 'Structured Text & Formulae',
      },
    ],
  },
  {
    id: 2,
    question: 'When asked to calculate the distance travelled from a velocity-time graph, what is your first instinct?',
    scenario: 'An exam question shows a triangular and rectangular v-t graph.',
    options: [
      {
        text: 'Shading the geometric shapes under the curve to visually see the area.',
        style: 'visual',
        tag: 'Geometric Visualization',
      },
      {
        text: 'Recalling the teacher’s verbal voice rule: "Area under v-t graph always equals distance".',
        style: 'auditory',
        tag: 'Auditory Memory',
      },
      {
        text: 'Interactively breaking the shape down and dragging measurement points.',
        style: 'kinesthetic',
        tag: 'Interactive Trial',
      },
      {
        text: 'Writing down the formula Area = (½ × base × height) + (length × breadth) on paper.',
        style: 'reading',
        tag: 'Algebraic Derivation',
      },
    ],
  },
  {
    id: 3,
    question: 'How do you easily remember that displacement can be zero while distance is not?',
    scenario: 'An athlete runs one full lap around a 400m circular track.',
    options: [
      {
        text: 'Picturing the circular loop: starting at Point A and drawing an arrow right back to Point A.',
        style: 'visual',
        tag: 'Mental Imagery',
      },
      {
        text: 'Having a voice discuss: "Displacement is just net change in position from start to finish".',
        style: 'auditory',
        tag: 'Auditory Concept',
      },
      {
        text: 'Actually standing up or moving an avatar around a track back to the start line.',
        style: 'kinesthetic',
        tag: 'Physical Experiential',
      },
      {
        text: 'Studying the distinction table: Distance = Scalar (400m), Displacement = Vector (0m).',
        style: 'reading',
        tag: 'Categorical Comparison',
      },
    ],
  },
  {
    id: 4,
    question: 'When deriving the three equations of motion (v = u + at, s = ut + ½at², v² - u² = 2as), which helps you most?',
    scenario: 'Mastering the NCERT 5-mark derivation.',
    options: [
      {
        text: 'A colored chart showing the velocity triangle above the initial velocity rectangle.',
        style: 'visual',
        tag: 'Visual Breakdown',
      },
      {
        text: 'An interactive voice lecture explaining each line of the derivation sequentially.',
        style: 'auditory',
        tag: 'Guided Voice Tutoring',
      },
      {
        text: 'Plugging in sample values (u=0, a=2, t=5) in a simulator to verify each formula.',
        style: 'kinesthetic',
        tag: 'Interactive Sandbox',
      },
      {
        text: 'Step-by-step written mathematical proofs with justification annotations.',
        style: 'reading',
        tag: 'Mathematical Rigor',
      },
    ],
  },
  {
    id: 5,
    question: 'During quick revision 30 minutes before your Science exam, what would you choose?',
    scenario: 'Final review to ensure no mistakes in NCERT Chapter Motion.',
    options: [
      {
        text: 'A master infographic poster summarizing all formulas, graphs, and vectors on one sheet.',
        style: 'visual',
        tag: 'Visual Poster Summary',
      },
      {
        text: 'A 5-minute rapid-fire voice Q&A audio session with the AI teacher.',
        style: 'auditory',
        tag: 'Rapid Audio Review',
      },
      {
        text: 'Solving 3 quick interactive physics sliders to test edge cases (like negative acceleration).',
        style: 'kinesthetic',
        tag: 'Interactive Drills',
      },
      {
        text: 'Reviewing a high-yield summary cheat sheet of formulas, units, and solved numericals.',
        style: 'reading',
        tag: 'Written Cheat Sheet',
      },
    ],
  },
];

export const PRESET_DOUBTS: PresetDoubt[] = [
  {
    id: 'doubt-1',
    question: 'Can displacement be zero when distance is non-zero?',
    category: 'Fundamentals',
    preview: 'Yes! For any closed loop path, start and end positions match, making displacement 0.',
  },
  {
    id: 'doubt-2',
    question: 'Why is uniform circular motion called accelerated motion if speed is constant?',
    category: 'Circular Motion',
    preview: 'Because direction changes continuously at every point, velocity changes, producing centripetal acceleration.',
  },
  {
    id: 'doubt-3',
    question: 'How do you find distance travelled from a Velocity-Time (v-t) graph?',
    category: 'Graphs',
    preview: 'Calculate the total geometric area under the velocity curve and the time axis.',
  },
  {
    id: 'doubt-4',
    question: 'What is the difference between positive acceleration and retardation?',
    category: 'Acceleration',
    preview: 'Acceleration increases velocity (a > 0), whereas retardation/deceleration decreases velocity (a < 0).',
  },
  {
    id: 'doubt-5',
    question: 'How to derive s = ut + ½at² graphically using a v-t graph?',
    category: 'Derivations',
    preview: 'Area of trapezium OABC = Area of rectangle OADC + Area of triangle ABD.',
  },
];
