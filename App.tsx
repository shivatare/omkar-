
import React, { useState, useEffect, useCallback } from 'react';
import { MoodType, DailyStats, Reward, BodyPart } from './types';
import { geminiService } from './services/geminiService';
import MoodCard from './components/MoodCard';
import FocusTimer from './components/FocusTimer';
import GymWorkout from './components/GymWorkout';

type ViewMode = 'focus' | 'gym';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('focus');
  const [mood, setMood] = useState<MoodType>('focused');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [stats, setStats] = useState<DailyStats>({
    totalFocusTime: 0,
    sessionsCount: 0,
    moodBreakdown: { energetic: 0, calm: 0, anxious: 0, sad: 0, distracted: 0, focused: 0 }
  });
  const [currentThought, setCurrentThought] = useState<string>('');
  const [isThoughtLoading, setIsThoughtLoading] = useState(false);
  const [reward, setReward] = useState<{ text: string; links: any[] } | null>(null);
  const [deepAdvice, setDeepAdvice] = useState<string | null>(null);
  const [isAdviceLoading, setIsAdviceLoading] = useState(false);
  const [challengeText, setChallengeText] = useState('');

  // Update thought when mood OR view changes
  useEffect(() => {
    const fetchThought = async () => {
      setIsThoughtLoading(true);
      const thought = await geminiService.getQuickMoodThought(mood, view);
      setCurrentThought(thought);
      setIsThoughtLoading(false);
    };
    fetchThought();
  }, [mood, view]);

  const handleToggleTimer = () => {
    setIsTimerActive(!isTimerActive);
  };

  const handleTimerComplete = useCallback(async () => {
    setIsTimerActive(false);
    setStats(prev => ({
      ...prev,
      totalFocusTime: prev.totalFocusTime + (30 * 60),
      sessionsCount: prev.sessionsCount + 1,
      moodBreakdown: {
        ...prev.moodBreakdown,
        [mood]: prev.moodBreakdown[mood] + 1
      }
    }));

    // Fetch Reward
    const rewardData = await geminiService.getMoodRewardFact(mood);
    setReward(rewardData);
    geminiService.speakText(`Great job! You finished your session. Here is your reward: ${rewardData.text}`);
  }, [mood]);

  const handleStartGymSession = async (bodyPart: BodyPart) => {
    setIsTimerActive(true);
    const motivation = await geminiService.getFitnessMotivation(bodyPart);
    setCurrentThought(motivation);
    geminiService.speakText(motivation);
  };

  const handleGetAdvice = async () => {
    if (!challengeText.trim()) return;
    setIsAdviceLoading(true);
    setDeepAdvice(null);
    const advice = await geminiService.getDeepCoaching(mood, challengeText, view);
    setDeepAdvice(advice);
    setIsAdviceLoading(false);
  };

  const handleSpeakThought = () => {
    if (currentThought) geminiService.speakText(currentThought);
  };

  return (
    <div className="min-h-screen pb-20 bg-[#fafafa]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30 transition-all">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all duration-700 shadow-lg ${view === 'focus' ? 'bg-violet-600 shadow-violet-200' : 'bg-orange-600 shadow-orange-200'}`}>
              <i className={`fas ${view === 'focus' ? 'fa-brain' : 'fa-bolt-lightning'}`}></i>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">omkar <span className={view === 'focus' ? 'text-violet-600' : 'text-orange-600'}>ai</span></h1>
          </div>
          
          <div className="flex items-center bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
            <button 
              onClick={() => setView('focus')}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${view === 'focus' ? 'bg-white shadow-md text-violet-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
            >
              WORK
            </button>
            <button 
              onClick={() => setView('gym')}
              className={`px-6 py-2 rounded-xl text-sm font-black transition-all ${view === 'gym' ? 'bg-white shadow-md text-orange-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
            >
              GYM
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full bg-white overflow-hidden ring-4 transition-all duration-500 ${view === 'focus' ? 'ring-violet-50' : 'ring-orange-50'}`}>
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${stats.sessionsCount}&backgroundColor=f1f5f9`} alt="avatar" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section with Thought */}
        <section className={`relative overflow-hidden transition-all duration-1000 bg-gradient-to-br rounded-[3rem] p-10 md:p-14 text-white shadow-2xl ${view === 'focus' ? 'from-violet-600 to-indigo-700 shadow-violet-200' : 'from-orange-500 to-rose-600 shadow-orange-200'}`}>
          <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.2em] backdrop-blur-xl border border-white/10">
                <span className="flex h-2 w-2 rounded-full bg-white animate-pulse"></span>
                {view === 'focus' ? 'Deep Work Engine' : 'Strength Protocol'}
              </div>
              <h2 className="text-3xl md:text-5xl font-black leading-tight min-h-[6rem] drop-shadow-xl text-balance">
                {isThoughtLoading ? 'Syncing...' : `"${currentThought}"`}
              </h2>
              <button 
                onClick={handleSpeakThought}
                disabled={!currentThought || isThoughtLoading}
                className="flex items-center gap-4 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all backdrop-blur-md border border-white/20 group active:scale-95"
              >
                <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="fas fa-play text-xs"></i>
                </div>
                <span className="text-sm font-black uppercase tracking-wider">Play AI Guidance</span>
              </button>
            </div>
            <div className="w-full md:w-auto flex-shrink-0 animate-in fade-in slide-in-from-right-16 duration-1000">
               <MoodCard currentMood={mood} onSelect={setMood} />
            </div>
          </div>
          
          {/* Orbs for visual flavor */}
          <div className={`absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-[100px] opacity-30 ${view === 'focus' ? 'bg-cyan-400' : 'bg-yellow-400'}`}></div>
          <div className={`absolute -top-20 -left-20 w-60 h-60 rounded-full blur-[80px] opacity-20 ${view === 'focus' ? 'bg-white' : 'bg-red-400'}`}></div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <FocusTimer 
              isActive={isTimerActive} 
              onToggle={handleToggleTimer}
              onComplete={handleTimerComplete}
              onTimeUpdate={() => {}} 
            />

            {view === 'gym' && (
              <GymWorkout 
                onStartSession={handleStartGymSession}
                isSessionActive={isTimerActive}
              />
            )}

            {reward && (
              <div className="bg-amber-50 border border-amber-100 p-10 rounded-[2.5rem] animate-in slide-in-from-bottom-12 duration-700 shadow-xl shadow-amber-100/50">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-amber-200 animate-bounce">
                    <i className="fas fa-crown"></i>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-amber-900 tracking-tight">Level Up Reward</h3>
                    <p className="text-sm text-amber-700 font-bold uppercase tracking-widest opacity-60">Verified AI Knowledge</p>
                  </div>
                </div>
                <p className="text-amber-800 leading-relaxed text-xl mb-8 font-semibold italic border-l-4 border-amber-300 pl-6">"{reward.text}"</p>
                {reward.links.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-[11px] font-black text-amber-500 uppercase tracking-[0.3em]">Unlock Original Content</p>
                    <div className="flex flex-wrap gap-3">
                      {reward.links.map((link: any, i: number) => (
                        <a 
                          key={i} 
                          href={link.web?.uri || link.maps?.uri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-3 text-xs bg-white px-5 py-2.5 rounded-xl border border-amber-200 text-amber-700 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all shadow-sm font-black"
                        >
                          <i className="fas fa-sparkles"></i>
                          {link.web?.title || 'Knowledge Source'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${view === 'focus' ? 'bg-violet-50 text-violet-600' : 'bg-orange-50 text-orange-600'}`}>
                   <i className="fas fa-terminal text-sm"></i>
                </div>
                <h3 className="font-black text-slate-900 tracking-tight uppercase text-xs">AI Deep Coaching</h3>
              </div>
              <textarea
                value={challengeText}
                onChange={(e) => setChallengeText(e.target.value)}
                placeholder={view === 'focus' ? "Describe your mental resistance..." : "Input form or performance query..."}
                className="w-full h-32 p-5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 focus:bg-white outline-none resize-none mb-5 transition-all font-medium"
              />
              <button
                onClick={handleGetAdvice}
                disabled={isAdviceLoading || !challengeText}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 disabled:opacity-50 ${view === 'focus' ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-100' : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-100'}`}
              >
                {isAdviceLoading ? 'THINKING...' : 'INITIATE ANALYSIS'}
              </button>

              {deepAdvice && (
                <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in duration-1000">
                  <h4 className={`text-[10px] font-black uppercase tracking-widest mb-4 ${view === 'focus' ? 'text-violet-500' : 'text-orange-500'}`}>Executive Summary</h4>
                  <div className="text-sm text-slate-800 prose prose-slate max-w-none whitespace-pre-wrap leading-relaxed font-bold opacity-80">
                    {deepAdvice}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-black text-slate-900 mb-8 uppercase text-xs tracking-widest">Growth Metrics</h3>
              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mind Power</span>
                    <span className="text-sm font-black text-violet-600">Lvl {Math.floor(stats.totalFocusTime / 3600) + 1}</span>
                  </div>
                  <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                    <div 
                      className="h-full bg-violet-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(139,92,246,0.6)]" 
                      style={{ width: `${Math.min(100, (stats.totalFocusTime / 3600 % 1) * 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Physical Grit</span>
                    <span className="text-sm font-black text-orange-600">Lvl {stats.moodBreakdown.energetic + 1}</span>
                  </div>
                  <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                    <div 
                      className="h-full bg-orange-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(249,115,22,0.6)]" 
                      style={{ width: `${Math.min(100, (stats.moodBreakdown.energetic / 10) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/70 backdrop-blur-2xl border-t border-slate-200/50 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative flex items-center justify-center">
              <div className={`w-4 h-4 rounded-full ${isTimerActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
              {isTimerActive && <div className="absolute inset-0 bg-emerald-500 animate-ping rounded-full opacity-25"></div>}
            </div>
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">
              {isTimerActive ? 'Session Running' : 'Engine Ready'}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Active State</span>
              <span className={`text-xs font-black uppercase ${view === 'focus' ? 'text-violet-600' : 'text-orange-600'}`}>{mood}</span>
            </div>
            <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${view === 'focus' ? 'bg-violet-600 text-white' : 'bg-orange-600 text-white'}`}>
              {view}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
