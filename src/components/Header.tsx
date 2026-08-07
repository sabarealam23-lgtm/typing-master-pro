import React, { useState } from 'react';
import { NavigationTab, ThemeMode } from '../types';
import { 
  Keyboard, 
  Sun, 
  Moon, 
  User, 
  Trophy, 
  BookOpen, 
  Gauge, 
  LayoutDashboard, 
  Menu, 
  X,
  Flame
} from 'lucide-react';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Practice', icon: <Flame className="w-4 h-4" /> },
    { id: 'lessons', label: 'Lessons', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'speedtest', label: 'Tests', icon: <Gauge className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
  ];

  const handleTabClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-400 text-slate-950 flex items-center justify-center font-extrabold shadow-md shadow-teal-400/20 group-hover:scale-105 transition-transform">
              <Keyboard className="w-5 h-5" />
            </div>
            <div className="flex items-center font-extrabold tracking-tight text-lg">
              <span className="text-teal-500 dark:text-teal-400">TYPING</span>
              <span className="text-slate-900 dark:text-white ml-1.5">MASTER PRO</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Level Badge */}
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded bg-teal-500/10 dark:bg-teal-400/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 dark:border-teal-400/30 text-xs font-bold tracking-wider">
              LVL 24
            </span>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to Day / Light Mode' : 'Switch to Night / Dark Mode'}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Profile / Auth Button */}
            <button
              onClick={() => handleTabClick('profile')}
              className={`flex items-center gap-2 p-1.5 rounded-full border-2 border-teal-400 bg-slate-100 dark:bg-slate-800 hover:scale-105 transition-transform ${
                activeTab === 'profile' ? 'ring-2 ring-teal-400' : ''
              }`}
              title="User Account & Profile"
            >
              <User className="w-4 h-4 text-teal-500 dark:text-teal-400" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                activeTab === item.id
                  ? 'bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 border border-slate-300 dark:border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <button
            onClick={() => handleTabClick('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              activeTab === 'profile'
                ? 'bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400 border border-slate-300 dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Account</span>
          </button>
        </div>
      )}
    </header>
  );
};
