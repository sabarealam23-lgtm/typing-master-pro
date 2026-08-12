import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, CheckCircle, CheckCircle2, ArrowRight, RotateCcw, 
  Zap, Target, Award, Sparkles, Star, Play, ChevronLeft, 
  Trophy, Lock
} from 'lucide-react';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface Lesson {
  id: number;
  title: string;
  category: 'Home Row' | 'Top Row' | 'Bottom Row';
  description: string;
  handPositionHint: string;
  content: string;
}

export interface LessonProgress {
  stars: number;
  maxWpm: number;
  maxAccuracy: number;
  completed: boolean;
}

export const TYPING_LESSONS: Lesson[] = [
  // Level 1: Home Row Basics (Very Easy)
  {
    id: 1,
    title: 'Lesson 1: Index Fingers (F & J)',
    category: 'Home Row',
    description: 'Master the anchor keys F and J using your left and right index fingers.',
    handPositionHint: 'Rest left index finger on F (feel the tactile bump) and right index on J.',
    content: 'f j ff jj fjfj jfjf f j f j'
  },
  {
    id: 2,
    title: 'Lesson 2: Adding Middle Fingers (D & K)',
    category: 'Home Row',
    description: 'Use your middle fingers to reach D and K on the home row.',
    handPositionHint: 'Left middle finger rests on D, right middle finger rests on K.',
    content: 'd k dd kk dkdk fjdk dkfj d k d k'
  },
  {
    id: 3,
    title: 'Lesson 3: Adding Ring Fingers (S & L)',
    category: 'Home Row',
    description: 'Use your ring fingers for S and L on the home row.',
    handPositionHint: 'Left ring finger rests on S, right ring finger rests on L.',
    content: 's l ss ll slsl sdkj fslk s l s l'
  },
  {
    id: 4,
    title: 'Lesson 4: Adding Pinky Fingers (A & ;)',
    category: 'Home Row',
    description: 'Master outer home row keys A and semicolon ; using pinky fingers.',
    handPositionHint: 'Left pinky finger on A, right pinky finger on semicolon ;.',
    content: 'a ; aa ;; a;a; asdf jkl; a ; a ;'
  },
  {
    id: 5,
    title: 'Lesson 5: Full Home Row Practice',
    category: 'Home Row',
    description: 'Combine all home row keys to type real English words.',
    handPositionHint: 'Keep all fingers gently resting on A S D F and J K L ;.',
    content: 'asdf jkl; dad ask fall glad flask'
  },

  // Level 2: Top Row Intro
  {
    id: 6,
    title: 'Lesson 6: Top Row E and I Keys',
    category: 'Top Row',
    description: 'Reach up with left middle finger for E and right middle finger for I.',
    handPositionHint: 'Left middle reaches up to E, right middle reaches up to I.',
    content: 'e i ee ii ed ik ded kik side kid'
  },
  {
    id: 7,
    title: 'Lesson 7: Top Row R and U Keys',
    category: 'Top Row',
    description: 'Reach up with left index finger for R and right index finger for U.',
    handPositionHint: 'Left index reaches up to R, right index reaches up to U.',
    content: 'r u rr uu fr ju red rug fur jug'
  },
  {
    id: 8,
    title: 'Lesson 8: Top Row T and Y Keys',
    category: 'Top Row',
    description: 'Extend index fingers upwards and inwards to reach T and Y.',
    handPositionHint: 'Left index reaches T, right index reaches Y.',
    content: 't y tt yy ft jy try toy yet tray'
  },
  {
    id: 9,
    title: 'Lesson 9: Top Row Outer Keys (Q, W, O, P)',
    category: 'Top Row',
    description: 'Complete the top row with ring and pinky finger reaches.',
    handPositionHint: 'Left pinky: Q, Left ring: W, Right ring: O, Right pinky: P.',
    content: 'q w o p quit wet out pot power'
  },

  // Level 3: Bottom Row & Full Keyboard
  {
    id: 10,
    title: 'Lesson 10: Bottom Row C and V Keys',
    category: 'Bottom Row',
    description: 'Reach down with left middle finger for C and left index for V.',
    handPositionHint: 'Left middle reaches down to C, left index reaches down to V.',
    content: 'c v cc vv call van cave vice'
  },
  {
    id: 11,
    title: 'Lesson 11: Bottom Row B and N Keys',
    category: 'Bottom Row',
    description: 'Reach down with left index finger for B and right index for N.',
    handPositionHint: 'Left index reaches down to B, right index reaches down to N.',
    content: 'b n bb nn ban bin noble bank'
  },
  {
    id: 12,
    title: 'Lesson 12: Simple Sentences (Pangram)',
    category: 'Bottom Row',
    description: 'Practice the classic pangram containing every letter in the English alphabet.',
    handPositionHint: 'Maintain smooth typing rhythm across all three keyboard rows.',
    content: 'the quick brown fox jumps over the lazy dog'
  }
];

export const LessonsView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [userInput, setUserInput] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [completedLessonStats, setCompletedLessonStats] = useState<Record<number, LessonProgress>>(() => {
    try {
      const saved = localStorage.getItem('club_typing_lessons_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [completedSummary, setCompletedSummary] = useState<{
    wpm: number;
    accuracy: number;
    mistakes: number;
    stars: number;
    passed: boolean;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const hasSavedRef = useRef<boolean>(false);

  const currentLesson = TYPING_LESSONS.find(l => l.id === selectedLessonId) || null;

  // Check if a lesson is unlocked
  const isLessonUnlocked = (lessonId: number): boolean => {
    if (lessonId === 1) return true;
    const prev = completedLessonStats[lessonId - 1];
    return Boolean(prev?.completed && prev?.maxAccuracy >= 80);
  };

  // Sync progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('club_typing_lessons_progress', JSON.stringify(completedLessonStats));
    } catch (e) {
      console.error("Failed to save progress to localStorage", e);
    }
  }, [completedLessonStats]);

  const resetLesson = () => {
    setUserInput('');
    setIsCompleted(false);
    setStartTime(null);
    setShowSummaryModal(false);
    setCompletedSummary(null);
    hasSavedRef.current = false;
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  useEffect(() => {
    if (selectedLessonId !== null) {
      resetLesson();
    }
  }, [selectedLessonId]);

  const handleLessonComplete = (val: string) => {
    if (hasSavedRef.current || !currentLesson) return;
    hasSavedRef.current = true;
    setIsCompleted(true);

    let correct = 0;
    let mistakes = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === currentLesson.content[i]) correct++;
      else mistakes++;
    }

    const elapsedSeconds = startTime ? Math.max((Date.now() - startTime) / 1000, 1) : 1;
    const minutes = elapsedSeconds / 60;
    const finalWpm = Math.round((correct / 5) / minutes);
    const finalAccuracy = val.length > 0 ? Math.round((correct / val.length) * 100) : 100;
    const finalMistakes = mistakes;
    const currentLessonId = `lesson-${currentLesson.id}`;

    // Calculate stars: 3 stars for >= 95% acc & >= 25 wpm, 2 stars for >= 85% acc & >= 15 wpm, 1 star for >= 80% acc
    let stars = 0;
    if (finalAccuracy >= 95 && finalWpm >= 25) {
      stars = 3;
    } else if (finalAccuracy >= 85 && finalWpm >= 15) {
      stars = 2;
    } else if (finalAccuracy >= 80) {
      stars = 1;
    } else {
      stars = 0;
    }

    const passed = finalAccuracy >= 80;

    // Save state locally
    setCompletedLessonStats(prev => {
      const existing = prev[currentLesson.id];
      return {
        ...prev,
        [currentLesson.id]: {
          stars: Math.max(existing?.stars || 0, stars),
          maxWpm: Math.max(existing?.maxWpm || 0, finalWpm),
          maxAccuracy: Math.max(existing?.maxAccuracy || 0, finalAccuracy),
          completed: passed || Boolean(existing?.completed)
        }
      };
    });

    setCompletedSummary({
      wpm: finalWpm,
      accuracy: finalAccuracy,
      mistakes: finalMistakes,
      stars,
      passed
    });

    setShowSummaryModal(true);

    // EXACT Firestore Save Logic requested by user prompt
    if (auth.currentUser) {
      console.log("Triggering Firestore save for Lesson, UID:", auth.currentUser.uid);
      addDoc(collection(db, "users", auth.currentUser.uid, "history"), {
        wpm: Number(finalWpm) || 0,
        accuracy: Number(finalAccuracy) || 0,
        mistakes: Number(finalMistakes) || 0,
        createdAt: serverTimestamp(),
        mode: "lesson",
        lessonId: currentLessonId || "lesson"
      })
      .then(() => {
        alert("Lesson Progress Saved Successfully!");
        console.log("Lesson score written to Firestore!");
      })
      .catch((err: any) => {
        alert("Lesson Save Error: " + err.message);
        console.error("Lesson Save Error:", err);
      });
    } else {
      console.log("No authenticated user present when lesson finished.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isCompleted || !currentLesson) return;

    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    setUserInput(val);

    if (val.length >= currentLesson.content.length) {
      handleLessonComplete(val);
    }
  };

  // Real-time HUD calculations
  const calculateRealtimeHUD = () => {
    if (!currentLesson) return { wpm: 0, accuracy: 100, mistakes: 0, progressPct: 0 };

    let correct = 0;
    let mistakes = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === currentLesson.content[i]) correct++;
      else mistakes++;
    }

    const elapsedSeconds = startTime ? Math.max((Date.now() - startTime) / 1000, 1) : 1;
    const minutes = elapsedSeconds / 60;
    const wpm = Math.round((correct / 5) / minutes);
    const accuracy = userInput.length > 0 ? Math.round((correct / userInput.length) * 100) : 100;
    const progressPct = Math.min(Math.round((userInput.length / currentLesson.content.length) * 100), 100);

    return { wpm, accuracy, mistakes, progressPct };
  };

  const hud = calculateRealtimeHUD();

  const categories = ['All', 'Home Row', 'Top Row', 'Bottom Row'];

  const filteredLessons = TYPING_LESSONS.filter(
    l => activeCategory === 'All' || l.category === activeCategory
  );

  const totalCompleted = (Object.values(completedLessonStats) as LessonProgress[]).filter(s => s.completed).length;

  // Render Star Icons Helper
  const renderStars = (count: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3].map((starIndex) => (
          <Star
            key={starIndex}
            className={`w-4 h-4 ${
              starIndex <= count
                ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                : 'text-slate-300 dark:text-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* SECTION 1: MAIN DASHBOARD GRID (IF NO LESSON SELECTED) */}
      {selectedLessonId === null ? (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-teal-500/10 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-400/20 border border-teal-400/30 rounded-full text-teal-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                  <span>Club Typing Step-by-Step Curriculum</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Beginner to Touch Typist
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                  Start from the basics! Master index fingers on the home row, systematically unlock new keys, and build 80%+ accuracy to advance.
                </p>
              </div>

              {/* Progress Stat Card */}
              <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 sm:p-5 flex items-center gap-5 min-w-[220px]">
                <div className="w-12 h-12 rounded-xl bg-teal-400/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{totalCompleted} / {TYPING_LESSONS.length}</div>
                  <div className="text-xs text-slate-400 font-medium">Lessons Mastered</div>
                  <div className="w-28 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-teal-400 transition-all duration-500" 
                      style={{ width: `${(totalCompleted / TYPING_LESSONS.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-teal-400 text-slate-950 shadow-md shadow-teal-400/20'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid of Lesson Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredLessons.map((lesson) => {
              const progress = completedLessonStats[lesson.id];
              const isCompleted = progress?.completed;
              const unlocked = isLessonUnlocked(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => {
                    setSelectedLessonId(lesson.id);
                  }}
                  className={`group bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs transition-all duration-200 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:shadow-lg ${
                    unlocked
                      ? 'border-slate-200 dark:border-slate-800 hover:border-teal-400/60 dark:hover:border-teal-400/60'
                      : 'border-slate-200/60 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Category & Status / Lock Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-teal-400/10 text-teal-700 dark:text-teal-300 border border-teal-400/20">
                        {lesson.category}
                      </span>
                      {isCompleted ? (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </div>
                      ) : unlocked ? (
                        <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold">Ready</span>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-xs font-semibold">
                          <Lock className="w-3 h-3" />
                          <span>Locked</span>
                        </div>
                      )}
                    </div>

                    {/* Lesson Title & Description */}
                    <div>
                      <h3 className={`text-base font-bold transition-colors ${
                        unlocked
                          ? 'text-slate-900 dark:text-white group-hover:text-teal-500'
                          : 'text-slate-700 dark:text-slate-300 group-hover:text-teal-500'
                      }`}>
                        {lesson.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {lesson.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Stats & Launch CTA */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      {isCompleted ? (
                        <div className="space-y-0.5">
                          {renderStars(progress.stars)}
                          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {progress.maxWpm} WPM • {progress.maxAccuracy}% Acc
                          </div>
                        </div>
                      ) : unlocked ? (
                        <div className="flex items-center gap-1 text-slate-300 dark:text-slate-700">
                          {renderStars(0)}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 font-medium">
                          Reach 80%+ accuracy on Lesson {lesson.id - 1}
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLessonId(lesson.id);
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                        unlocked
                          ? 'bg-slate-100 dark:bg-slate-800 group-hover:bg-teal-400 group-hover:text-slate-950 text-slate-700 dark:text-slate-300'
                          : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-teal-400 group-hover:text-slate-950 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {unlocked ? (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* SECTION 2: CLUB TYPING STYLE TYPING ARENA */
        <div className="space-y-5">
          {/* Top Bar: Back Button & Lesson Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:px-6 shadow-xs">
            <button
              onClick={() => setSelectedLessonId(null)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer w-fit"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Lessons</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 bg-teal-400/10 text-teal-700 dark:text-teal-300 rounded-lg border border-teal-400/20">
                {currentLesson?.category}
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {currentLesson?.title}
              </h2>
            </div>
          </div>

          {/* Real-time Minimal Club Typing HUD Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center text-teal-500">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Speed</div>
                <div className="text-xl font-black text-slate-900 dark:text-white">{hud.wpm} <span className="text-xs font-normal text-slate-500">WPM</span></div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Accuracy</div>
                <div className="text-xl font-black text-slate-900 dark:text-white">{hud.accuracy}%</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Mistakes</div>
                <div className="text-xl font-black text-slate-900 dark:text-white">{hud.mistakes}</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500">
                <Award className="w-5 h-5" />
              </div>
              <div className="w-full pr-2">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Progress</div>
                <div className="text-xl font-black text-slate-900 dark:text-white">{hud.progressPct}%</div>
              </div>
            </div>
          </div>

          {/* Hand Position Hint Banner */}
          {currentLesson?.handPositionHint && (
            <div className="bg-teal-400/10 border border-teal-400/20 rounded-2xl p-3.5 sm:px-5 flex items-center gap-3 text-xs font-semibold text-teal-800 dark:text-teal-300">
              <span className="text-base">💡</span>
              <span><strong>Finger Placement:</strong> {currentLesson.handPositionHint}</span>
            </div>
          )}

          {/* Typing Arena Box */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="relative bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl min-h-[220px] flex flex-col justify-between cursor-text overflow-hidden transition-all"
          >
            {/* Progress Bar Top Edge */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
              <div 
                className="h-full bg-teal-400 transition-all duration-200 shadow-[0_0_12px_rgba(45,212,191,0.8)]" 
                style={{ width: `${hud.progressPct}%` }}
              />
            </div>

            {/* Hidden Input */}
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              disabled={isCompleted}
              className="absolute opacity-0 pointer-events-none"
              autoFocus
            />

            {/* Character Stream Canvas */}
            <div className="font-mono text-2xl sm:text-3xl md:text-4xl leading-relaxed tracking-wider select-none my-auto p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-inner">
              {currentLesson?.content.split('').map((char, index) => {
                let color = 'text-slate-500 opacity-60';
                let bg = '';

                if (index < userInput.length) {
                  if (userInput[index] === char) {
                    color = 'text-emerald-400 font-extrabold drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]';
                    bg = 'bg-emerald-500/10 rounded-xs';
                  } else {
                    color = 'text-rose-400 font-extrabold underline decoration-rose-500 decoration-4';
                    bg = 'bg-rose-500/20 rounded-xs';
                  }
                } else if (index === userInput.length) {
                  // Active Character Cursor
                  bg = 'bg-teal-400 text-slate-950 font-black rounded-xs ring-2 ring-teal-400/60 shadow-lg shadow-teal-400/40 animate-pulse px-0.5';
                  color = 'text-slate-950';
                }

                return (
                  <span key={index} className={`${color} ${bg} transition-all duration-75`}>
                    {char}
                  </span>
                );
              })}
            </div>

            {/* Arena Footer Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <button
                  onClick={resetLesson}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-700"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
                  <span>Restart Lesson</span>
                </button>
              </div>

              <div className="text-xs text-slate-400 font-medium hidden sm:block">
                Click inside box or type directly to begin
              </div>
            </div>
          </div>

          {/* SUMMARY MODAL OVERLAY ON LESSON COMPLETE */}
          {showSummaryModal && completedSummary && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-400 via-amber-400 to-emerald-400" />

                <div className="space-y-2 pt-2">
                  <div className="w-16 h-16 rounded-2xl bg-teal-400/10 border border-teal-400/20 mx-auto flex items-center justify-center text-teal-400">
                    <Sparkles className="w-8 h-8 animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Lesson Completed!</h3>
                  <p className="text-xs text-slate-400">
                    {completedSummary.passed ? (
                      <span className="text-emerald-400 font-bold">Great job! You unlocked the next lesson.</span>
                    ) : (
                      <span className="text-amber-400 font-bold">Achieve 80%+ accuracy to unlock the next lesson.</span>
                    )}
                  </p>
                </div>

                {/* Star Rating Display */}
                <div className="flex justify-center items-center gap-2 py-2">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-8 h-8 ${
                        s <= completedSummary.stars
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] scale-110'
                          : 'text-slate-800'
                      } transition-all duration-300`}
                    />
                  ))}
                </div>

                {/* Score Stats Grid */}
                <div className="grid grid-cols-3 gap-3 bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <div>
                    <div className="text-2xl font-black text-teal-400">{completedSummary.wpm}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">WPM</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-emerald-400">{completedSummary.accuracy}%</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-rose-400">{completedSummary.mistakes}</div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-0.5">Mistakes</div>
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={resetLesson}
                    className="w-full sm:w-1/2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs transition-colors cursor-pointer border border-slate-700"
                  >
                    Try Again
                  </button>
                  {selectedLessonId !== null && selectedLessonId < TYPING_LESSONS.length && completedSummary.passed ? (
                    <button
                      onClick={() => {
                        setSelectedLessonId(prev => (prev ? prev + 1 : 1));
                      }}
                      className="w-full sm:w-1/2 py-3 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-teal-400/20"
                    >
                      <span>Next Lesson</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedLessonId(null)}
                      className="w-full sm:w-1/2 py-3 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      All Lessons
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
