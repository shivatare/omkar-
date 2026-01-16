
export type MoodType = 'energetic' | 'calm' | 'anxious' | 'sad' | 'distracted' | 'focused';

export type BodyPart = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  videoUrl?: string;
  description?: string;
}

export interface FocusSession {
  id: string;
  startTime: number;
  duration: number; // in seconds
  mood: MoodType;
  rewardEarned: boolean;
}

export interface Reward {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface DailyStats {
  totalFocusTime: number; // in seconds
  sessionsCount: number;
  moodBreakdown: Record<MoodType, number>;
}
