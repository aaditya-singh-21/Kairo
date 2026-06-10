// Types shared across dashboard components

export interface Project {
  _id: string;
  name: string;
  status: 'active' | 'archived' | 'deleted';
  currentCode: string;
  versionHistory: {
    code: string;
    prompt: string;
    versionNumber: number;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface SamplePrompt {
  id: string;
  code: string;
  label: string;
  description: string;
  prompt: string;
}

export const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    id: 'todo',
    code: 'T.01',
    label: 'To-Do App',
    description: 'Task management with priorities',
    prompt: 'Build a minimal to-do list app with a clean dark theme. Include add/delete tasks, priority levels (low, medium, high) shown as colored dots, a progress bar at the top showing completion %, and smooth animations when adding or completing tasks.',
  },
  {
    id: 'finance',
    code: 'T.02',
    label: 'Finance Tracker',
    description: 'Income, expenses & charts',
    prompt: 'Create a personal finance tracker with a dashboard showing total balance, monthly income vs expenses, a transaction list with categories (food, transport, entertainment, bills), and a simple bar chart visualizing spending by category. Use a neutral color palette with green for income and red for expenses.',
  },
  {
    id: 'portfolio',
    code: 'T.03',
    label: 'Portfolio Site',
    description: 'Minimal dev/designer showcase',
    prompt: 'Design a minimal portfolio website for a product designer. Include a bold hero section with name and title, a grid of 4 case study cards with hover effects, an about section with a short bio, and a contact section with email and social links. Use a light off-white background with black typography.',
  },
  {
    id: 'landing',
    code: 'T.04',
    label: 'SaaS Landing',
    description: 'Conversion-optimized landing page',
    prompt: 'Build a SaaS product landing page with a compelling hero section (headline, subheadline, two CTAs), a social proof section with logos, a three-column features grid with icons, a pricing section with two tiers (free and pro), and a footer with navigation links. Use a dark theme with a vibrant accent color.',
  },
  {
    id: 'weather',
    code: 'T.05',
    label: 'Weather Dashboard',
    description: 'Current + 7-day forecast UI',
    prompt: 'Create a weather dashboard app showing current weather conditions for a city (temperature, humidity, wind speed, weather condition). Include a 7-day forecast row with icons, hourly temperature chart, and a search bar to look up any city. Use a gradient background that changes based on weather condition (sunny, cloudy, rainy).',
  },
  {
    id: 'notes',
    code: 'T.06',
    label: 'Notes App',
    description: 'Markdown-ready note editor',
    prompt: 'Build a notes app with a two-panel layout: a sidebar showing all notes with search and tags, and a main panel with a clean text editor. Support markdown preview toggle, color-coded tags, pin important notes, and a trash/restore mechanism for deleted notes.',
  },
];
