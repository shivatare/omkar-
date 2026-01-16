
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FOCUS_TARGET_SECONDS } from '../constants';

interface FocusTimerProps {
  isActive: boolean;
  onToggle: () => void;
  onComplete: () => void;
  onTimeUpdate: (seconds: number) => void;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ isActive, onToggle, onComplete, onTimeUpdate }) => {
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<number | null>(null);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          onTimeUpdate(next);
          if (next >= FOCUS_TARGET_SECONDS) {
            onComplete();
            return 0;
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, onComplete, onTimeUpdate]);

  const progress = (seconds / FOCUS_TARGET_SECONDS) * 100;

  return (
    <div className="flex flex-col items-center p-10 bg-white rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-50">
      <div className="relative w-56 h-56 flex items-center justify-center mb-10">
        <svg className="absolute w-full h-full -rotate-90">
          <circle
            cx="112"
            cy="112"
            r="104"
            fill="transparent"
            stroke="#f8fafc"
            strokeWidth="12"
          />
          <circle
            cx="112"
            cy="112"
            r="104"
            fill="transparent"
            stroke={isActive ? "#7c3aed" : "#e2e8f0"}
            strokeWidth="12"
            strokeDasharray={653.45}
            strokeDashoffset={653.45 - (653.45 * progress) / 100}
            strokeLinecap="round"
            className="transition-all duration-700 ease-in-out"
          />
        </svg>
        <div className="flex flex-col items-center">
          <span className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums">{formatTime(seconds)}</span>
          <span className={`text-[10px] font-black uppercase tracking-[0.3em] mt-2 transition-colors ${isActive ? 'text-violet-500' : 'text-slate-300'}`}>
            {isActive ? 'Active Phase' : 'Idle Phase'}
          </span>
        </div>
      </div>

      <div className="flex gap-5 items-center">
        <button
          onClick={onToggle}
          className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center gap-3 ${
            isActive
              ? 'bg-slate-900 text-white shadow-slate-200'
              : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200'
          }`}
        >
          <i className={`fas ${isActive ? 'fa-square' : 'fa-play'} text-[10px]`}></i>
          {isActive ? 'Pause' : 'Start Focus'}
        </button>
        <button
          onClick={() => {
            if (confirm('Reset session progress?')) setSeconds(0);
          }}
          className="w-14 h-14 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all border border-slate-100"
        >
          <i className="fas fa-rotate-right"></i>
        </button>
      </div>
      
      <p className="mt-8 text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
        <i className="fas fa-circle-info text-violet-400"></i>
        30 minute cycle to next reward
      </p>
    </div>
  );
};

export default FocusTimer;
