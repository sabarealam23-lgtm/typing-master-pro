import React from 'react';
import { 
  Zap, 
  Target, 
  Clock, 
  Trophy, 
  Flame, 
  Award, 
  TrendingUp, 
  BarChart2, 
  CheckCircle2, 
  Calendar,
  Sparkles
} from 'lucide-react';

interface HistoryItem {
  id: string;
  mode: string;
  wpm: number;
  accuracy: number;
  date: string;
}

const MOCK_HISTORY: HistoryItem[] = [
  { id: '1', mode: '60s Speed Test', wpm: 84, accuracy: 98, date: 'Today, 10:24 AM' },
  { id: '2', mode: '30s Speed Test', wpm: 79, accuracy: 96, date: 'Today, 09:15 AM' },
  { id: '3', mode: 'Paragraph Practice', wpm: 75, accuracy: 99, date: 'Yesterday' },
  { id: '4', mode: 'Home Row Drill', wpm: 92, accuracy: 100, date: 'Yesterday' },
  { id: '5', mode: '15s Sprint', wpm: 88, accuracy: 95, date: '3 days ago' },
];

const ACHIEVEMENTS = [
  { id: 1, title: 'Speed Demon', desc: 'Reach 80+ WPM in a test', unlocked: true, icon: <Zap className="w-5 h-5 text-amber-400" /> },
  { id: 2, title: 'Accuracy Master', desc: 'Maintain 98%+ accuracy', unlocked: true, icon: <Target className="w-5 h-5 text-teal-400" /> },
  { id: 3, title: 'Consistency King', desc: 'Complete 10 tests in a day', unlocked: true, icon: <Flame className="w-5 h-5 text-rose-400" /> },
  { id: 4, title: 'Lesson Graduate', desc: 'Finish all 8 beginner-to-master lessons', unlocked: false, icon: <Award className="w-5 h-5 text-purple-400" /> },
];

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg transition-colors">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-400/10 text-teal-600 dark:text-teal-300 border border-teal-400/30">
            <Sparkles className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
            <span>Pro Performance Analytics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Your Typing Command Center</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Track your speed progression, accuracy metrics, and practice milestones.</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl">
          <div className="p-3 bg-teal-400/10 rounded-lg text-teal-600 dark:text-teal-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Current Rank</div>
            <div className="text-lg font-extrabold text-teal-600 dark:text-teal-300">Advanced Typist</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Top 12% Worldwide</div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Average WPM</div>
            <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">78</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +12% this week
            </div>
          </div>
          <div className="p-3 bg-teal-400/10 rounded-xl text-teal-600 dark:text-teal-400 border border-teal-400/20">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Avg Accuracy</div>
            <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 mt-1">98.4%</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">High Precision</div>
          </div>
          <div className="p-3 bg-teal-400/10 rounded-xl text-teal-600 dark:text-teal-400 border border-teal-400/20">
            <Target className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Daily Streak</div>
            <div className="text-3xl font-extrabold text-amber-500 dark:text-amber-400 mt-1">12 Days</div>
            <div className="text-xs text-amber-600 dark:text-amber-300 mt-1">Consistency Streak</div>
          </div>
          <div className="p-3 bg-amber-400/10 rounded-xl text-amber-500 dark:text-amber-400 border border-amber-400/20">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Tests Completed</div>
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">142</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total Sessions</div>
          </div>
          <div className="p-3 bg-emerald-400/10 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-400/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Chart Simulation & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* WPM Progress Visual */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                <span>Speed Progress Trend</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">WPM over your last 7 practice tests</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-300 rounded-lg border border-slate-200 dark:border-slate-700">
              Peak: 102 WPM
            </span>
          </div>

          {/* Bar chart representation */}
          <div className="h-48 flex items-end justify-between gap-3 px-2 pt-4 border-b border-slate-200 dark:border-slate-800">
            {[
              { label: 'Test 1', wpm: 62 },
              { label: 'Test 2', wpm: 68 },
              { label: 'Test 3', wpm: 71 },
              { label: 'Test 4', wpm: 75 },
              { label: 'Test 5', wpm: 82 },
              { label: 'Test 6', wpm: 88 },
              { label: 'Test 7', wpm: 102 },
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.wpm}
                </span>
                <div 
                  className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-teal-400 dark:hover:bg-teal-400 rounded-t-lg transition-all duration-300" 
                  style={{ height: `${(bar.wpm / 110) * 100}%` }}
                ></div>
                <span className="text-[10px] font-semibold text-slate-500">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Unlocked Badges */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <span>Achievements & Badges</span>
          </h3>

          <div className="space-y-3">
            {ACHIEVEMENTS.map((item) => (
              <div 
                key={item.id} 
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-colors ${
                  item.unlocked 
                    ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white' 
                    : 'bg-slate-100/40 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 text-slate-400 dark:text-slate-500 opacity-60'
                }`}
              >
                <div className={`p-2.5 rounded-lg ${item.unlocked ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700' : 'bg-slate-100 dark:bg-slate-900/40'}`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">{item.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.desc}</div>
                </div>
                {item.unlocked && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Typing History Log */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-500 dark:text-teal-400" />
            <span>Recent Practice History</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Showing last 5 sessions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4">Speed</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {MOCK_HISTORY.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">{item.mode}</td>
                  <td className="py-3 px-4 font-extrabold text-teal-600 dark:text-teal-400">{item.wpm} WPM</td>
                  <td className="py-3 px-4 font-semibold text-teal-600 dark:text-teal-300">{item.accuracy}%</td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
