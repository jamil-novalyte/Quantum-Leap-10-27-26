export interface StageScript {
  id: string;
  stageNumber: number;
  title: string;
  subtitle: string;
  category: string;
  estimatedReadTime: string;
  themes: string[];
  fullText: string;
  lines: string[];
}

export interface HabitItem {
  id: string;
  title: string;
  description: string;
  category: 'training' | 'recovery' | 'craft' | 'speech' | 'mindset';
  completed: boolean;
  streak: number;
  frequency: string;
}

export interface ActionItem {
  id: string;
  title: string;
  stageId?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
  createdAt: string;
  source: 'manual' | 'reflection';
}

export interface JournalEntry {
  id: string;
  date: string;
  timestamp: number;
  stageId: string;
  stageName: string;
  transcript: string;
  summary: string;
  keyTakeaways: string[];
  actionItems: string[];
  groundedPerspective: string;
  audioBlobUrl?: string;
}

export interface LyriaTrack {
  id: string;
  title: string;
  prompt: string;
  durationSeconds: number;
  audioUrl?: string;
  isGenerating?: boolean;
}
