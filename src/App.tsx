import React, { useState, useEffect } from 'react';
import { NavigationTab, ThemeMode } from './types';
import { Header } from './components/Header';
import { TypingArena } from './components/TypingArena';
import { LessonsView } from './components/LessonsView';
import { DashboardView } from './components/DashboardView';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileAuthView } from './components/ProfileAuthView';
import { Zap, Trophy, Target, Clock, ArrowRight, Keyboard } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('typing_master_theme');
    return (saved as ThemeMode) || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('typing_master_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center p-4 sm:p-6 font-sans transition-colors duration-200 w-full">
      
      {/* 1. TOP HEADER PATTI: Full-Width across entire screen */}
      <header className="w-full pb-4">
        <Header 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          theme={theme} 
          toggleTheme={toggleTheme} 
        />
      </header>

      {/* 2. MAIN CONTENT AREA: Centered Landscape Container */}
      <div className="w-[88%] max-w-[1100px] w-full mx-auto flex flex-col gap-6">
        <main className="flex-1 w-full flex flex-col gap-6">
          
          {/* Home / Practice / Speedtest Mode */}
          {(activeTab === 'home' || activeTab === 'speedtest' || activeTab === 'practice') && (
            <div className="flex flex-col gap-6 w-full">
              
              {/* Full-Width Interactive Typing Arena Box */}
              <div className="w-full">
                <TypingArena 
                  initialMode={activeTab === 'speedtest' ? '60s' : '30s'} 
                />
              </div>

              {/* Horizontal Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">WPM AVG</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">78</div>
                  </div>
                  <Zap className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">ACCURACY</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">98.4%</div>
                  </div>
                  <Target className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">DAILY STREAK</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-amber-500 dark:text-amber-400 mt-1">12 Days</div>
                  </div>
                  <Clock className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">TOP RECORD</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">102 WPM</div>
                  </div>
                  <Trophy className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                </div>
              </div>

              {/* Bottom Section: Leaderboard & Goals */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                
                {/* Leaderboard Table */}
                <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                  <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 text-xs font-extrabold tracking-wider uppercase text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                    <span>LEADERBOARD</span>
                    <Trophy className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
                    {[
                      { rank: 1, name: 'ApexTyper', wpm: 142 },
                      { rank: 2, name: 'SwiftKey', wpm: 138 },
                      { rank: 3, name: 'Sarah_W', wpm: 125 },
                      { rank: 4, name: 'GhostWriter', wpm: 119 },
                      { rank: 5, name: 'You', wpm: 78, isUser: true },
                    ].map((item) => (
                      <div key={item.rank} className={`flex items-center justify-between px-4 py-2.5 ${item.isUser ? 'bg-teal-400/10 font-bold text-teal-600 dark:text-teal-300' : 'text-slate-700 dark:text-slate-300'}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-teal-600 dark:text-teal-400 font-bold w-4 text-xs">{item.rank}</span>
                          <span>{item.name}</span>
                        </div>
                        <span className="font-semibold text-xs text-slate-500 dark:text-slate-400">{item.wpm} WPM</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Goal Card */}
                <div className="bg-teal-400/10 dark:bg-teal-400/5 border border-teal-400/30 dark:border-teal-400/20 rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold tracking-wider uppercase text-teal-600 dark:text-teal-400">NEXT GOAL</div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                      Complete 3 Paragraph Lessons to unlock the <strong className="text-teal-600 dark:text-teal-300 font-semibold">'Consistency'</strong> badge.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('lessons')}
                    className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 bg-teal-400 text-slate-950 font-bold rounded-lg text-xs hover:bg-teal-300 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Explore Lessons</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'lessons' && <LessonsView />}
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'leaderboard' && <LeaderboardView />}
          {activeTab === 'profile' && <ProfileAuthView />}

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500 dark:text-slate-400 mt-auto w-full">
          Typing Master Pro &copy; {new Date().getFullYear()} &bull; Professional Polish Theme
        </footer>
      </div>

    </div>
  );
}