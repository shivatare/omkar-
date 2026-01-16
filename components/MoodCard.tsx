
import React from 'react';
import { MoodType } from '../types';
import { MOODS } from '../constants';

interface MoodCardProps {
  currentMood: MoodType;
  onSelect: (mood: MoodType) => void;
}

const MoodCard: React.FC<MoodCardProps> = ({ currentMood, onSelect }) => {
  return (
    <div className="bg-white/10 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/20 shadow-2xl">
      <h2 className="text-xs font-black text-white/60 uppercase tracking-[0.3em] mb-6 text-center">Emotional State</h2>
      <div className="grid grid-cols-2 gap-4">
        {MOODS.map((m) => (
          <button
            key={m.type}
            onClick={() => onSelect(m.type)}
            className={`flex flex-col items-center justify-center p-5 rounded-3xl border-2 transition-all duration-500 group relative overflow-hidden ${
              currentMood === m.type
                ? `bg-white border-white text-slate-900 scale-105 shadow-xl`
                : 'bg-transparent border-white/10 text-white/60 hover:border-white/40 hover:text-white'
            }`}
          >
            <span className={`text-3xl mb-3 transition-transform duration-500 group-hover:scale-125 ${currentMood === m.type ? 'animate-bounce' : ''}`}>{m.icon}</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
            
            {currentMood === m.type && (
              <div className="absolute top-0 right-0 p-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodCard;
