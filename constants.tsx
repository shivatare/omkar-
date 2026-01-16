
import React from 'react';
import { MoodType, BodyPart, Exercise } from './types';

export const MOODS: { type: MoodType; label: string; icon: string; color: string }[] = [
  { type: 'energetic', label: 'Energetic', icon: '⚡', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { type: 'focused', label: 'Focused', icon: '🎯', color: 'bg-violet-100 text-violet-700 border-violet-200' },
  { type: 'calm', label: 'Calm', icon: '🌊', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  { type: 'distracted', label: 'Distracted', icon: '🌀', color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200' },
  { type: 'anxious', label: 'Anxious', icon: '🌪️', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  { type: 'sad', label: 'Low', icon: '☁️', color: 'bg-slate-200 text-slate-700 border-slate-300' },
];

export const WORKOUTS: Record<BodyPart, { icon: string; exercises: Exercise[] }> = {
  chest: {
    icon: '💪',
    exercises: [
      { name: 'Bench Press', sets: '4', reps: '8-12 reps', videoUrl: 'https://www.youtube.com/embed/rT7DgVCn7iU' },
      { name: 'Incline Dumbbell Press', sets: '3', reps: '10-12 reps', videoUrl: 'https://www.youtube.com/embed/8iPEnn-ltC8' },
      { name: 'Chest Flys', sets: '3', reps: '15 reps', videoUrl: 'https://www.youtube.com/embed/eGjt4lk6gjw' },
      { name: 'Pushups', sets: '3', reps: 'To Failure', videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4' },
    ],
  },
  back: {
    icon: '🧗',
    exercises: [
      { name: 'Deadlifts', sets: '3', reps: '5-8 reps', videoUrl: 'https://www.youtube.com/embed/op9kVnSso6Q' },
      { name: 'Pull-ups', sets: '4', reps: '8-10 reps', videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g' },
      { name: 'Bent Over Rows', sets: '3', reps: '10-12 reps', videoUrl: 'https://www.youtube.com/embed/6TSz88p89v8' },
      { name: 'Lat Pulldowns', sets: '3', reps: '12-15 reps', videoUrl: 'https://www.youtube.com/embed/CAwf7n6Luuc' },
    ],
  },
  legs: {
    icon: '🦵',
    exercises: [
      { name: 'Squats', sets: '4', reps: '8-10 reps', videoUrl: 'https://www.youtube.com/embed/MVMNk0HiTMg' },
      { name: 'Leg Press', sets: '3', reps: '12-15 reps', videoUrl: 'https://www.youtube.com/embed/IZxyjW7MPJQ' },
      { name: 'Lunges', sets: '3', reps: '12 reps each leg', videoUrl: 'https://www.youtube.com/embed/D7KaRcUTQeE' },
      { name: 'Calf Raises', sets: '4', reps: '20 reps', videoUrl: 'https://www.youtube.com/embed/gwLzBJYoWlI' },
    ],
  },
  shoulders: {
    icon: '🏋️',
    exercises: [
      { name: 'Overhead Press', sets: '4', reps: '8-10 reps', videoUrl: 'https://www.youtube.com/embed/2yjwxtZQDGA' },
      { name: 'Lateral Raises', sets: '3', reps: '15 reps', videoUrl: 'https://www.youtube.com/embed/PPrzBWZEGpA' },
      { name: 'Front Raises', sets: '3', reps: '12 reps', videoUrl: 'https://www.youtube.com/embed/hRJ6EBK_-oc' },
      { name: 'Reverse Flys', sets: '3', reps: '15 reps', videoUrl: 'https://www.youtube.com/embed/6yMdhi2DVao' },
    ],
  },
  arms: {
    icon: '🦾',
    exercises: [
      { name: 'Bicep Curls', sets: '3', reps: '12 reps', videoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Ww' },
      { name: 'Tricep Dips', sets: '3', reps: '12-15 reps', videoUrl: 'https://www.youtube.com/embed/6kALZikcLc0' },
      { name: 'Hammer Curls', sets: '3', reps: '12 reps', videoUrl: 'https://www.youtube.com/embed/zC3nLlEvin4' },
      { name: 'Skull Crushers', sets: '3', reps: '10-12 reps', videoUrl: 'https://www.youtube.com/embed/d_KZx7p_djI' },
    ],
  },
  core: {
    icon: '🧘',
    exercises: [
      { name: 'Plank', sets: '3', reps: '60 seconds', videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c' },
      { name: 'Leg Raises', sets: '3', reps: '15 reps', videoUrl: 'https://www.youtube.com/embed/l4kQd9eWclE' },
      { name: 'Russian Twists', sets: '3', reps: '20 reps', videoUrl: 'https://www.youtube.com/embed/wkD8rjkodUI' },
      { name: 'Bicycle Crunches', sets: '3', reps: '20 reps', videoUrl: 'https://www.youtube.com/embed/Iwyvozckjak' },
    ],
  },
};

export const FOCUS_TARGET_SECONDS = 30 * 60; // 30 minutes
