
import React, { useState, useEffect } from 'react';
import { BodyPart, Exercise } from '../types';
import { WORKOUTS } from '../constants';

interface GymWorkoutProps {
  onStartSession: (bodyPart: BodyPart) => void;
  isSessionActive: boolean;
}

const GymWorkout: React.FC<GymWorkoutProps> = ({ onStartSession, isSessionActive }) => {
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  // Auto-select first exercise when a body part is chosen
  useEffect(() => {
    if (selectedPart && activeExerciseIndex === null) {
      setActiveExerciseIndex(0);
    }
  }, [selectedPart]);

  const toggleComplete = (idx: number) => {
    setCompletedExercises(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const bodyParts: { type: BodyPart; label: string }[] = [
    { type: 'chest', label: 'Chest' },
    { type: 'back', label: 'Back' },
    { type: 'legs', label: 'Legs' },
    { type: 'shoulders', label: 'Shoulders' },
    { type: 'arms', label: 'Arms' },
    { type: 'core', label: 'Core' },
  ];

  if (!selectedPart) {
    return (
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Select Region</h2>
          <span className="px-4 py-1.5 bg-orange-100 text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Strength Engine</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {bodyParts.map((part) => (
            <button
              key={part.type}
              onClick={() => setSelectedPart(part.type)}
              className="flex flex-col items-center p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:border-orange-300 hover:bg-orange-50 hover:scale-[1.05] transition-all duration-300 group shadow-sm"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-500 drop-shadow-sm">
                {WORKOUTS[part.type].icon}
              </span>
              <span className="text-xs font-black text-slate-800 uppercase tracking-widest">{part.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const exercises = WORKOUTS[selectedPart].exercises;
  const currentEx = activeExerciseIndex !== null ? exercises[activeExerciseIndex] : null;

  return (
    <div className="space-y-8">
      {/* Video Spotlight Section */}
      {currentEx && (
        <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-top-12 duration-700">
          <div className="aspect-video w-full bg-black relative">
            {currentEx.videoUrl ? (
              <iframe
                width="100%"
                height="100%"
                src={`${currentEx.videoUrl}?autoplay=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0`}
                title={currentEx.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-600 font-black uppercase text-xs tracking-widest">
                Media Feed Offline
              </div>
            )}
            <div className="absolute top-6 left-6">
              <span className="px-4 py-2 bg-orange-600 text-white text-[10px] font-black rounded-xl uppercase tracking-[0.2em] shadow-xl">
                Form Guide
              </span>
            </div>
          </div>
          <div className="p-8 bg-slate-800 text-white border-t border-white/5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-black tracking-tight">{currentEx.name}</h3>
                <p className="text-orange-400 text-xs font-black uppercase tracking-widest mt-2">Target Protocol</p>
              </div>
              <div className="flex gap-6">
                <div className="text-right">
                  <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Sets</p>
                  <p className="text-xl font-black">{currentEx.sets}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Reps</p>
                  <p className="text-xl font-black">{currentEx.reps}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exercise Checklist Section */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-50">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setSelectedPart(null);
                setActiveExerciseIndex(null);
                setCompletedExercises([]);
              }}
              className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-orange-600 rounded-2xl transition-all border border-slate-100"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h3 className="text-xl font-black text-slate-900 capitalize tracking-tight">
                {selectedPart} Sequence
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Grind</p>
            </div>
          </div>
          <div className="bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100 text-center min-w-[100px]">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Progress</span>
            <p className="text-lg font-black text-orange-600">{completedExercises.length}/{exercises.length}</p>
          </div>
        </div>

        <div className="space-y-4">
          {exercises.map((ex, idx) => (
            <div 
              key={idx} 
              onClick={() => setActiveExerciseIndex(idx)}
              className={`group flex items-center gap-5 p-5 rounded-[1.5rem] border-2 cursor-pointer transition-all duration-500 ${
                activeExerciseIndex === idx 
                  ? 'border-orange-500 bg-orange-50/50 shadow-lg shadow-orange-100/50 scale-[1.02]' 
                  : completedExercises.includes(idx)
                    ? 'border-emerald-100 bg-emerald-50/30 opacity-60'
                    : 'border-slate-50 bg-white hover:border-slate-200'
              }`}
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleComplete(idx);
                }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                  completedExercises.includes(idx)
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                    : 'bg-slate-100 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500'
                }`}
              >
                <i className={`fas ${completedExercises.includes(idx) ? 'fa-check' : 'fa-circle-dot'} text-xs`}></i>
              </button>

              <div className="flex-1">
                <p className={`text-sm font-black transition-colors ${
                  activeExerciseIndex === idx ? 'text-orange-900' : 'text-slate-800'
                }`}>
                  {ex.name}
                </p>
                <div className="flex gap-4 mt-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {ex.sets} Sets
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-40">|</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {ex.reps}
                  </span>
                </div>
              </div>

              {activeExerciseIndex === idx && (
                <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center animate-bounce shadow-md shadow-orange-200">
                  <i className="fas fa-play text-[10px]"></i>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => onStartSession(selectedPart)}
          disabled={isSessionActive}
          className={`mt-10 w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 ${
            isSessionActive 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200'
          }`}
        >
          <i className="fas fa-fire text-lg"></i>
          <div className="text-left">
            <p className="leading-none">{isSessionActive ? 'Protocol Running' : 'Ignite Session'}</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default GymWorkout;
