import React, { useState } from 'react';
import { Trophy, Medal, Crown, Zap, Target, Search, Filter, Sparkles, User, Flame } from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  name: string;
  wpm: number;
  accuracy: number;
  testsCount: number;
  streak: number;
  badge: string;
  avatarBg: string;
  isCurrentUser?: boolean;
}

const LEADERBOARD_DATA: LeaderboardUser[] = [
  { rank: 1, name: 'CyberTypist_99', wpm: 168, accuracy: 99.8, testsCount: 1420, streak: 45, badge: 'Grandmaster', avatarBg: 'bg-amber-500' },
  { rank: 2, name: 'LightningKeys', wpm: 154, accuracy: 99.2, testsCount: 980, streak: 32, badge: 'Master', avatarBg: 'bg-slate-300' },
  { rank: 3, name: 'VeloType', wpm: 145, accuracy: 98.9, testsCount: 750, streak: 28, badge: 'Master', avatarBg: 'bg-amber-700' },
  { rank: 4, name: 'ProFingers', wpm: 138, accuracy: 98.5, testsCount: 620, streak: 19, badge: 'Diamond', avatarBg: 'bg-indigo-500' },
  { rank: 5, name: 'SwiftFinger_X', wpm: 129, accuracy: 98.1, testsCount: 510, streak: 14, badge: 'Diamond', avatarBg: 'bg-teal-500' },
  { rank: 6, name: 'KeyNinja', wpm: 122, accuracy: 97.8, testsCount: 430, streak: 11, badge: 'Platinum', avatarBg: 'bg-purple-500' },
  { rank: 7, name: 'You (Current User)', wpm: 102, accuracy: 98.4, testsCount: 142, streak: 12, badge: 'Gold', avatarBg: 'bg-teal-400 text-slate-950 font-bold', isCurrentUser: true },
  { rank: 8, name: 'TactileTouch', wpm: 98, accuracy: 96.9, testsCount: 310, streak: 8, badge: 'Gold', avatarBg: 'bg-blue-500' },
  { rank: 9, name: 'MatrixClacker', wpm: 92, accuracy: 96.5, testsCount: 280, streak: 5, badge: 'Silver', avatarBg: 'bg-emerald-500' },
  { rank: 10, name: 'AlphaType', wpm: 88, accuracy: 95.9, testsCount: 210, streak: 3, badge: 'Silver', avatarBg: 'bg-rose-500' },
];

export const LeaderboardView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alltime' | '60s' | 'daily'>('alltime');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const topThree = LEADERBOARD_DATA.slice(0, 3);
  const filteredList = LEADERBOARD_DATA.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg transition-colors">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-700 dark:text-amber-300 border border-amber-400/30 mb-2">
            <Trophy className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Global Typing Leaderboard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">World Champions & Top Typists</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">Compete with typists worldwide and claim your spot on the hall of fame.</p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('alltime')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'alltime' ? 'bg-teal-400 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            All Time
          </button>
          <button
            onClick={() => setActiveTab('60s')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === '60s' ? 'bg-teal-400 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            60s Sprint
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'daily' ? 'bg-teal-400 text-slate-950 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            Daily Challenge
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 2nd Place */}
        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 text-center shadow-md relative order-2 md:order-1 flex flex-col items-center">
          <Medal className="w-8 h-8 text-slate-400 dark:text-slate-300 mb-2" />
          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xl flex items-center justify-center border-2 border-slate-400 shadow-md mb-3">
            2
          </div>
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{topThree[1].name}</h3>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">{topThree[1].badge}</span>
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 w-full flex justify-around text-xs">
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Speed</div>
              <div className="text-base font-extrabold text-teal-600 dark:text-teal-400">{topThree[1].wpm} WPM</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Accuracy</div>
              <div className="text-base font-extrabold text-teal-600 dark:text-teal-300">{topThree[1].accuracy}%</div>
            </div>
          </div>
        </div>

        {/* 1st Place */}
        <div className="bg-gradient-to-b from-amber-500/10 via-white dark:via-slate-900 to-white dark:to-slate-900 border-2 border-amber-400/60 rounded-2xl p-6 text-center shadow-xl relative order-1 md:order-2 flex flex-col items-center transform md:-translate-y-2">
          <div className="absolute -top-3 px-3 py-0.5 bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase rounded-full shadow-md flex items-center gap-1">
            <Crown className="w-3 h-3" /> #1 Champion
          </div>
          <Crown className="w-10 h-10 text-amber-500 dark:text-amber-400 mb-2 mt-2 animate-bounce" />
          <div className="w-20 h-20 rounded-full bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center border-4 border-amber-300 shadow-xl mb-3">
            1
          </div>
          <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">{topThree[0].name}</h3>
          <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider mt-0.5">{topThree[0].badge}</span>
          <div className="mt-4 pt-4 border-t border-amber-400/20 w-full flex justify-around text-xs">
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Speed</div>
              <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400">{topThree[0].wpm} WPM</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Accuracy</div>
              <div className="text-lg font-extrabold text-teal-600 dark:text-teal-300">{topThree[0].accuracy}%</div>
            </div>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 text-center shadow-md relative order-3 flex flex-col items-center">
          <Medal className="w-8 h-8 text-amber-600 mb-2" />
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 font-extrabold text-xl flex items-center justify-center border-2 border-amber-600 shadow-md mb-3">
            3
          </div>
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{topThree[2].name}</h3>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-0.5">{topThree[2].badge}</span>
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 w-full flex justify-around text-xs">
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Speed</div>
              <div className="text-base font-extrabold text-teal-600 dark:text-teal-400">{topThree[2].wpm} WPM</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Accuracy</div>
              <div className="text-base font-extrabold text-teal-600 dark:text-teal-300">{topThree[2].accuracy}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table with Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-500 dark:text-teal-400" />
            <span>Full Rankings</span>
          </h3>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search typist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Typist</th>
                <th className="py-3 px-4">Speed</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Streak</th>
                <th className="py-3 px-4">Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredList.map((user) => (
                <tr 
                  key={user.rank} 
                  className={`transition-colors ${
                    user.isCurrentUser 
                      ? 'bg-teal-400/10 font-bold border-l-4 border-l-teal-400 text-slate-900 dark:text-white' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3.5 px-4 font-black">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${
                      user.rank === 1 ? 'bg-amber-400 text-slate-950 font-extrabold' :
                      user.rank === 2 ? 'bg-slate-300 text-slate-950 font-extrabold' :
                      user.rank === 3 ? 'bg-amber-700 text-white font-extrabold' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      #{user.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${user.avatarBg} flex items-center justify-center text-xs shadow-xs`}>
                      {user.name.charAt(0)}
                    </div>
                    <span>{user.name}</span>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-teal-600 dark:text-teal-400">{user.wpm} WPM</td>
                  <td className="py-3.5 px-4 font-bold text-teal-600 dark:text-teal-300">{user.accuracy}%</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> {user.streak}d
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 uppercase">
                      {user.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
