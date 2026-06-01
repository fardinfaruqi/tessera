export interface TesseraBlock {
  id: string;
  title: string;
  duration: number; // in minutes
  startTime?: string; // "HH:MM"
  priority: 'high' | 'medium' | 'low';
  type: 'deep-work' | 'admin' | 'meeting';
  status: 'scheduled' | 'pending' | 'completed' | 'overflow';
  description?: string;
  color?: string;
}

export interface AnalyticsData {
  day: string;
  focusScore: number;
  timeSaved: number;
  tasksCompleted: number;
}

export interface MendResult {
  updatedBlocks: TesseraBlock[];
  message: string;
  itemsShifted: number;
  itemsOverflowed: number;
}
