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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navigation Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* Main Content Dashboard Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {(activeTab === 'home' || activeTab === 'speedtest') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Real-time Player Stats Panel */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>WPM AVG</span>
                  <Zap className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
                </div>
                <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">78</div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>ACCURACY</span>
                  <Target className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
                </div>
                <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">98.4%</div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>DAILY STREAK</span>
                  <Clock className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-amber-500 dark:text-amber-400 mt-1">12 Days</div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
                <div className="text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>TOP RECORD</span>
                  <Trophy className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">102 WPM</div>
              </div>
            </div>

            {/* Center Column: Interactive Typing Practice Engine */}
            <div className="lg:col-span-6">
              <TypingArena 
                initialMode={activeTab === 'speedtest' ? '60s' : '30s'} 
              />
            </div>

            {/* Right Column: Leaderboard & Next Goal */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 text-xs font-extrabold tracking-wider uppercase text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                  <span>LEADERBOARD</span>
                  <Trophy className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
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

              <div className="bg-teal-400/10 dark:bg-teal-400/5 border border-teal-400/30 dark:border-teal-400/20 rounded-xl p-5">
                <div className="text-[11px] font-bold tracking-wider uppercase text-teal-600 dark:text-teal-400">NEXT GOAL</div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                  Complete 3 Paragraph Lessons to unlock the <strong className="text-teal-600 dark:text-teal-300 font-semibold">'Consistency'</strong> badge.
                </p>
                <button 
                  onClick={() => setActiveTab('lessons')}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 bg-teal-400 text-slate-950 font-bold rounded-lg text-xs hover:bg-teal-300 transition-colors shadow-xs"
                >
                  <span>Explore Lessons</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

        {activeTab === 'lessons' && (
          <LessonsView />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView />
        )}

        {activeTab === 'profile' && (
          <ProfileAuthView />
        )}

        {activeTab !== 'home' && activeTab !== 'speedtest' && activeTab !== 'lessons' && activeTab !== 'dashboard' && activeTab !== 'leaderboard' && activeTab !== 'profile' && (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Keyboard className="w-12 h-12 text-teal-400 mx-auto mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold capitalize text-slate-900 dark:text-white">{activeTab} Section</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Module ready! Select "Practice" or "Lessons" to start typing right now.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500 dark:text-slate-500">
        Typing Master Pro &copy; {new Date().getFullYear()} &bull; Professional Polish Theme
      </footer>
    </div>
  );
}

