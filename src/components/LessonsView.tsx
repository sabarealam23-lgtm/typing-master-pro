import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, CheckCircle, Lock, ArrowRight, RotateCcw, Zap, Target, Award, Sparkles } from 'lucide-react';

export interface Lesson {
  id: number;
  title: string;
  category: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  description: string;
  handPositionHint: string;
  content: string;
}

export const TYPING_LESSONS: Lesson[] = [
  {
    id: 1,
    title: 'Lesson 1: Home Row Keys',
    category: 'Beginner',
    description: 'Master the core index, middle, and ring finger keys on the home row.',
    handPositionHint: 'Rest left hand fingers on A S D F and right hand fingers on J K L ;',
    content: 'asdf jkl; asdf jkl; ffdj jjfk asdf jkl; ff jj kk ll ss aa dd ff jj kk ll'
  },
  {
    id: 2,
    title: 'Lesson 2: Top Row Keys',
    category: 'Beginner',
    description: 'Reach upward with your fingers to practice Q W E R T and Y U I O P.',
    handPositionHint: 'Keep wrists resting lightly. Reach index fingers to T and Y.',
    content: 'qwer tyui op qwer tyui op ru ty wi eo qp qwer tyui op qwert yuiop'
  },
  {
    id: 3,
    title: 'Lesson 3: Bottom Row Keys',
    category: 'Beginner',
    description: 'Reach downward to practice Z X C V B and N M , . /',
    handPositionHint: 'Move fingers down without lifting your palm too high off the desk.',
    content: 'zxcv bnm zxcv bnm, . / zxcv bnm zxcv bnm, . / zxcv bnm zxcv'
  },
  {
    id: 4,
    title: 'Lesson 4: Numbers & Symbols',
    category: 'Intermediate',
    description: 'Learn top number row keys and basic punctuation symbols.',
    handPositionHint: 'Extend top fingers to 1 2 3 4 5 6 7 8 9 0 and hold Shift for symbols.',
    content: '12345 67890 !@#$% ^&*() 12345 67890 !@#$% ^&*() 10 20 30 40 50'
  },
  {
    id: 5,
    title: 'Lesson 5: Common Word Drills',
    category: 'Intermediate',
    description: 'Combine all rows to type high-frequency English words smoothly.',
    handPositionHint: 'Maintain steady typing rhythm rather than rushing individual letters.',
    content: 'the and for that with have this from speak learn practice speed typing quick'
  },
  {
    id: 6,
    title: 'Lesson 6: Full Sentence Practice',
    category: 'Intermediate',
    description: 'Practice full sentences with capitalization and punctuation.',
    handPositionHint: 'Use opposite hand Shift keys for capital letters.',
    content: 'Practice makes perfect. Always focus on accuracy before increasing speed.'
  },
  {
    id: 7,
    title: 'Lesson 7: Paragraph Endurance',
    category: 'Advanced',
    description: 'Sustain muscle memory over longer passages of text.',
    handPositionHint: 'Breathe evenly and maintain relaxed shoulders during long typing runs.',
    content: 'Touch typing allows you to focus purely on your creative ideas without looking down at the keyboard. Regular practice builds effortless confidence.'
  },
  {
    id: 8,
    title: 'Lesson 8: Programming Code',
    category: 'Master',
    description: 'Type real JavaScript and HTML code blocks with special brackets.',
    handPositionHint: 'Use pinky fingers for brackets { } [ ] and semi-colons ;',
    content: 'const greet = (name) => { return `Hello ${name}!`; }; console.log(greet("World"));'
  }
];

export const LessonsView: React.FC = () => {
  const [selectedLessonId, setSelectedLessonId] = useState<number>(1);
  const [userInput, setUserInput] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const currentLesson = TYPING_LESSONS.find(l => l.id === selectedLessonId) || TYPING_LESSONS[0];

  const resetLesson = () => {
    setUserInput('');
    setIsCompleted(false);
    setStartTime(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => {
    resetLesson();
  }, [selectedLessonId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isCompleted) return;

    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    setUserInput(val);

    if (val.length >= currentLesson.content.length) {
      setIsCompleted(true);
      if (!completedLessonIds.includes(currentLesson.id)) {
        setCompletedLessonIds(prev => [...prev, currentLesson.id]);
      }
    }
  };

  // Stats calculation
  const calculateStats = () => {
    let correct = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === currentLesson.content[i]) correct++;
    }

    const elapsedSeconds = startTime ? Math.max((Date.now() - startTime) / 1000, 1) : 1;
    const minutes = elapsedSeconds / 60;
    const wpm = Math.round((correct / 5) / minutes);
    const accuracy = userInput.length > 0 ? Math.round((correct / userInput.length) * 100) : 100;

    return { wpm, accuracy, time: Math.round(elapsedSeconds) };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Lesson Selector Header Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-500 dark:text-teal-400" />
              <span>Step-by-Step Typing Academy</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Start from zero (Home Row) and progress to Master Level (Code & Paragraphs).
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-teal-400/10 text-teal-600 dark:text-teal-400 border border-teal-400/30 rounded-full">
            {completedLessonIds.length} / {TYPING_LESSONS.length} Completed
          </span>
        </div>

        {/* Level List Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {TYPING_LESSONS.map((lesson) => {
            const isSelected = lesson.id === selectedLessonId;
            const isDone = completedLessonIds.includes(lesson.id);

            return (
              <button
                key={lesson.id}
                onClick={() => setSelectedLessonId(lesson.id)}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-teal-400/10 border-teal-400 text-slate-900 dark:text-white shadow-sm'
                    : isDone
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-800 dark:text-slate-200'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    lesson.category === 'Beginner' ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' :
                    lesson.category === 'Intermediate' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300' :
                    lesson.category === 'Advanced' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' :
                    'bg-purple-500/20 text-purple-700 dark:text-purple-300'
                  }`}>
                    {lesson.category}
                  </span>
                  {isDone && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                </div>
                <div className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{lesson.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Lesson Interactive Arena */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-lg transition-colors">
        {/* Lesson Overview Banner */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Active Exercise</span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">{currentLesson.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{currentLesson.description}</p>
          </div>
          <div className="p-3 bg-teal-400/10 border border-teal-400/20 rounded-lg text-xs text-teal-700 dark:text-teal-300 font-medium max-w-xs">
            💡 <strong>Finger Guide:</strong> {currentLesson.handPositionHint}
          </div>
        </div>

        {/* Typing Input Canvas */}
        <div 
          onClick={() => inputRef.current?.focus()}
          className="relative bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6 min-h-[160px] flex flex-col justify-center cursor-text"
        >
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            disabled={isCompleted}
            className="absolute opacity-0 pointer-events-none"
            autoFocus
          />

          <div className="font-mono text-xl md:text-2xl leading-relaxed tracking-wide select-none p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 shadow-inner">
            {currentLesson.content.split('').map((char, index) => {
              let color = 'text-slate-400 dark:text-slate-500';
              let bg = '';

              if (index < userInput.length) {
                if (userInput[index] === char) {
                  color = 'text-teal-600 dark:text-teal-300 font-semibold dark:drop-shadow-[0_0_8px_rgba(45,212,191,0.25)]';
                } else {
                  color = 'text-rose-600 dark:text-rose-400 font-bold underline decoration-rose-500 decoration-2';
                  bg = 'bg-rose-500/20 rounded-xs';
                }
              } else if (index === userInput.length) {
                bg = 'bg-teal-400 text-slate-950 font-bold px-1 rounded-xs animate-pulse shadow-md shadow-teal-400/50';
              }

              return (
                <span key={index} className={`${color} ${bg} transition-all duration-75`}>
                  {char}
                </span>
              );
            })}
          </div>

          {/* Interactive Virtual Keyboard Preview */}
          <div className="mt-8 space-y-2 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex justify-center gap-1.5">
              {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(key => {
                const active = currentLesson.content[userInput.length]?.toUpperCase() === key;
                return (
                  <span key={key} className={`w-8 sm:w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm border transition-all duration-100 ${
                    active 
                      ? 'bg-teal-400 text-slate-950 border-teal-300 shadow-lg shadow-teal-400/40 -translate-y-0.5 scale-105 ring-2 ring-teal-400/30' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700/80 border-b-2 border-b-slate-300 dark:border-b-slate-950 shadow-xs'
                  }`}>
                    {key}
                  </span>
                );
              })}
            </div>
            <div className="flex justify-center gap-1.5">
              {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'].map(key => {
                const active = currentLesson.content[userInput.length]?.toUpperCase() === key;
                return (
                  <span key={key} className={`w-8 sm:w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm border transition-all duration-100 ${
                    active 
                      ? 'bg-teal-400 text-slate-950 border-teal-300 shadow-lg shadow-teal-400/40 -translate-y-0.5 scale-105 ring-2 ring-teal-400/30' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700/80 border-b-2 border-b-slate-300 dark:border-b-slate-950 shadow-xs'
                  }`}>
                    {key}
                  </span>
                );
              })}
            </div>
            <div className="flex justify-center gap-1.5">
              {['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.'].map(key => {
                const active = currentLesson.content[userInput.length]?.toUpperCase() === key;
                return (
                  <span key={key} className={`w-8 sm:w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm border transition-all duration-100 ${
                    active 
                      ? 'bg-teal-400 text-slate-950 border-teal-300 shadow-lg shadow-teal-400/40 -translate-y-0.5 scale-105 ring-2 ring-teal-400/30' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700/80 border-b-2 border-b-slate-300 dark:border-b-slate-950 shadow-xs'
                  }`}>
                    {key}
                  </span>
                );
              })}
            </div>
            {/* Spacebar Row */}
            <div className="flex justify-center pt-1">
              {(() => {
                const isSpaceActive = currentLesson.content[userInput.length] === ' ';
                return (
                  <span className={`w-48 sm:w-64 h-9 rounded-lg flex items-center justify-center font-bold text-xs uppercase tracking-widest border transition-all duration-100 ${
                    isSpaceActive 
                      ? 'bg-teal-400 text-slate-950 border-teal-300 shadow-lg shadow-teal-400/40 -translate-y-0.5 scale-102 ring-2 ring-teal-400/30' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700/80 border-b-2 border-b-slate-300 dark:border-b-slate-950 shadow-xs'
                  }`}>
                    SPACE
                  </span>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Control Footer */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={resetLesson}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
            <span>Restart Exercise</span>
          </button>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="text-slate-500 dark:text-slate-400">Accuracy: <strong className="text-teal-600 dark:text-teal-400">{stats.accuracy}%</strong></span>
            <span className="text-slate-500 dark:text-slate-400">Speed: <strong className="text-teal-600 dark:text-teal-400">{stats.wpm} WPM</strong></span>
          </div>
        </div>

        {/* Completion Modal */}
        {isCompleted && (
          <div className="bg-teal-400/10 border border-teal-400/40 rounded-xl p-6 text-center space-y-4">
            <Sparkles className="w-10 h-10 text-teal-500 dark:text-teal-400 mx-auto animate-bounce" />
            <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white">Lesson Completed!</h4>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Great job! You typed this lesson with <strong>{stats.accuracy}% accuracy</strong> at <strong>{stats.wpm} WPM</strong>.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={resetLesson}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold rounded-lg text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Try Again
              </button>
              {selectedLessonId < TYPING_LESSONS.length && (
                <button
                  onClick={() => setSelectedLessonId(prev => prev + 1)}
                  className="flex items-center gap-2 px-5 py-2 bg-teal-400 text-slate-950 font-bold rounded-lg text-xs hover:bg-teal-300 transition-colors shadow-xs"
                >
                  <span>Next Lesson</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
