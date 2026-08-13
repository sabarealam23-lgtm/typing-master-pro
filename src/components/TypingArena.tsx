import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Zap, Target, Clock, CheckCircle2, Award, Download, CloudCheck, AlertCircle, Shuffle } from 'lucide-react';
import { TypingStats } from '../types';
import { generateCertificatePDF } from '../utils/certificate';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type PracticeMode = '30s' | '60s' | '120s' | '300s' | '600s' | 'words' | 'paragraph';

const SAMPLE_TEXT_POOLS: Record<PracticeMode, string[]> = {
  '30s': [
    'success is not final failure is not fatal it is the courage to continue that counts practice makes perfect every keystroke brings you closer to your typing goal focus on rhythm and precision',
    'action is the foundational key to all success keep moving forward with steady hands and clear mind speed comes naturally when accuracy becomes second nature practice every day',
    'small daily improvements over time lead to stunning results master your muscle memory stay focused on the screen and feel the keys beneath your fingertips without looking down',
    'great achievement requires patience and persistent effort type smoothly maintain a soft touch on the keyboard and let your speed grow with continuous focused practice',
    'clarity of mind leads to speed of execution focus on each character as it appears keep a calm breathing rhythm and watch your words per minute reach new heights'
  ],
  '60s': [
    'in the world of software development speed and precision are invaluable skills typing efficiently allows your thoughts to flow seamlessly into code without interruption practice daily to build muscle memory and increase your words per minute effortlessly',
    'developing great typing skills opens up new levels of productivity whether you are writing essays building web apps or communicating with teammates typing with confidence lets your mind concentrate entirely on problem solving',
    'the secret to fast typing is relaxing your hands and maintaining a steady rhythmic flow rushing leads to errors which slow you down far more than a deliberate accurate pace focus on accuracy first and speed will follow',
    'technology moves fast and those who master digital tools stay ahead of the curve good ergonomics proper finger position and consistent daily sessions will transform your typing performance within just a few weeks',
    'every master was once a beginner through deliberate practice you teach your fingers to move instinctively across the home row top row and bottom row until complex words feel effortless to execute'
  ],
  '120s': [
    'programming is the art of telling a computer what to do through clear instructions typing with speed and accuracy gives engineers a massive advantage when writing code designing algorithms and communicating in fast paced agile development environments keep practicing every day',
    'learning to touch type is one of the most rewarding investments you can make for your digital career when you no longer need to look at your keyboard to find letters your thought process remains completely uninterrupted enabling deep work and creative breakthroughs',
    'building speed on the keyboard requires a balanced approach combining accuracy proper finger placement and consistent practice routines short daily sessions are significantly more effective than occasional marathon practice sessions because muscle memory consolidates during rest',
    'modern work environments demand quick communication and effortless content creation from crafting detailed documentation to reviewing code pull requests fast typing empowers you to express ideas instantly and collaborate effectively with remote teams around the globe'
  ],
  '300s': [
    'technology is rapidly transforming the world around us and mastering key digital skills has become essential for personal and professional growth. typing quickly and accurately allows you to express your ideas effortlessly, write documentation without fatigue, build complex software systems, and communicate with team members across the globe. as you develop speed, focus on maintaining clean form and steady rhythm. consistency is the foundation of high typing proficiency. keep pushing your limits every single day.',
    'the journey of mastering the keyboard is built on discipline, patience, and repetition. every session trains your central nervous system to recognize letter combinations and spatial relationships across the keys. as your fingers gain familiar rhythm, your mental energy shifts from searching for keys to creating complex ideas, writing elegant prose, or architecting robust codebases.',
    'effective digital communication relies heavily on the fluidity of your typing speed. when your fingers move in harmony with your mind, writing long articles, generating reports, or drafting technical emails becomes an enjoyable, frictionless experience. remember to maintain good posture, keep your wrists elevated, and take short breaks to stay fresh and comfortable during extended typing sessions.'
  ],
  '600s': [
    'the ability to type at a high speed with flawless accuracy is one of the most underrated superpowers in modern computing. whether you are writing code, composing emails, crafting essays, or managing projects, fast typing eliminates the cognitive bottleneck between thought and execution. when your fingers move effortlessly across the home row, your brain can focus entirely on problem solving and creativity rather than hunting for keys. build habits that emphasize posture, finger placement, and calm accuracy. with persistent practice, your typing speed will reach incredible heights.',
    'achieving mastery over the physical keyboard unlocks an entirely new dimension of cognitive flow. in computer science and digital literature alike, the speed at which you can translate thoughts into digital reality directly impacts your output and problem-solving depth. when technical friction disappears, your focus remains locked on high-level logic, design patterns, and creative storytelling. cultivate patience, practice with intention every day, and enjoy the lifelong benefit of rapid, accurate typing.',
    'typing is a physical craft that rewards consistency above all else. just as musicians practice scales to build dexterity, typists practice letter patterns, common n-grams, and punctuation combinations to build neuromuscular speed. by maintaining high accuracy standards and staying relaxed under timed pressure, you condition your hands to perform with effortless elegance across any keyboard layout.'
  ],
  'words': [
    'keyboard rhythm accuracy velocity cursor tactile mechanics keystroke latency response dexterity digital workflow productivity master proficiency lightning',
    'function variable syntax logic algorithm compilation database interface architecture network protocol component asynchronous optimization responsive dynamic',
    'precision momentum agility focus dexterity execution sequence buffer stream terminal render compiler framework engine operational capacity benchmark',
    'spectrum frequency harmonic resonance amplitude signal bandwidth telemetry quantum matrix vector canvas coordinate geometry calculus equation formula',
    'synthesis synergy catalyst horizon momentum zenith pinnacle benchmark milestone paradigm initiative trajectory standard foundation protocol architecture'
  ],
  'paragraph': [
    'Great typists are not born; they are forged through dedicated daily practice. By focusing on maintaining high accuracy over raw speed, your fingers naturally develop muscle memory, allowing you to hit keys instinctively without ever looking down at your keyboard.',
    'When you practice typing, aim for consistency in your rhythm rather than bursts of rapid keystrokes. A steady, uninterrupted flow produces fewer errors and ultimately yields a significantly higher net words per minute than typing quickly and constantly correcting mistakes.',
    'Touch typing is an essential modern skill that bridges the gap between human thought and digital execution. By placing your index fingers on the tactile bumps of the F and J anchor keys, you establish a reliable home base from which every key on the keyboard is easily reachable.',
    'The key to building lasting typing speed is maintaining relaxed hands, wrists, and shoulders. Tensing up under pressure causes fatigue and increases mistake rates. Keep a gentle touch on the keys and let accuracy drive your natural speed growth.'
  ]
};

const getRandomText = (m?: string, currentText?: string): string => {
  const modeKey = (m && m in SAMPLE_TEXT_POOLS) ? (m as PracticeMode) : '60s';
  const pool = SAMPLE_TEXT_POOLS[modeKey];
  if (pool.length === 1) return pool[0];
  const filtered = currentText ? pool.filter(t => t !== currentText) : pool;
  const choicePool = filtered.length > 0 ? filtered : pool;
  const randomIndex = Math.floor(Math.random() * choicePool.length);
  return choicePool[randomIndex];
};

interface TypingArenaProps {
  initialMode?: PracticeMode;
  onFinish?: (stats: TypingStats) => void;
}

export const TypingArena: React.FC<TypingArenaProps> = ({ 
  initialMode = '60s',
  onFinish 
}) => {
  const [mode, setMode] = useState<PracticeMode>(initialMode);
  const [text, setText] = useState<string>(() => getRandomText(initialMode));
  const [userInput, setUserInput] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (initialMode === '30s') return 30;
    if (initialMode === '60s') return 60;
    if (initialMode === '120s') return 120;
    if (initialMode === '300s') return 300;
    if (initialMode === '600s') return 600;
    return 60;
  });
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const inputRef = useRef<HTMLInputElement>(null);
  const hasSavedRef = useRef<boolean>(false);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Initialize timer limit based on mode
  const getModeDuration = (m: PracticeMode): number => {
    if (m === '30s') return 30;
    if (m === '60s') return 60;
    if (m === '120s') return 120;
    if (m === '300s') return 300;
    if (m === '600s') return 600;
    return 60;
  };

  const resetTest = useCallback((newMode?: PracticeMode) => {
    const activeM = newMode || mode;
    setMode(activeM);
    setText(prevText => getRandomText(activeM, prevText));
    setUserInput('');
    setIsActive(false);
    setIsFinished(false);
    setStartTime(null);
    setSaveStatus('idle');
    hasSavedRef.current = false;
    setTimeLeft(getModeDuration(activeM));
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [mode]);

  // Calculate Real-time Stats
  const calculateStats = (overrideInput?: string): TypingStats => {
    const input = overrideInput !== undefined ? overrideInput : userInput;
    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === text[i]) correct++;
      else incorrect++;
    }

    const duration = getModeDuration(mode);

    let timeSpentSeconds = 0;
    if (isFinished) {
      if (startTime) {
        timeSpentSeconds = Math.min((Date.now() - startTime) / 1000, duration);
      } else {
        timeSpentSeconds = duration - timeLeft;
      }
    } else if (isActive && startTime) {
      timeSpentSeconds = (Date.now() - startTime) / 1000;
    } else {
      timeSpentSeconds = 0;
    }

    timeSpentSeconds = Math.max(timeSpentSeconds, 0);

    if (timeSpentSeconds < 3) {
      const accuracy = input.length > 0 ? Math.round((correct / input.length) * 100) : 100;
      return {
        wpm: 0,
        rawWpm: 0,
        accuracy: isNaN(accuracy) ? 100 : accuracy,
        timeSpentSeconds: Math.round(timeSpentSeconds),
        correctChars: correct,
        incorrectChars: incorrect,
        totalChars: input.length
      };
    }

    const minutes = timeSpentSeconds / 60;
    const wpm = Math.round((correct / 5) / minutes);
    const rawWpm = Math.round((input.length / 5) / minutes);
    const accuracy = input.length > 0 ? Math.round((correct / input.length) * 100) : 100;

    return {
      wpm: isNaN(wpm) || !isFinite(wpm) ? 0 : wpm,
      rawWpm: isNaN(rawWpm) || !isFinite(rawWpm) ? 0 : rawWpm,
      accuracy: isNaN(accuracy) ? 100 : accuracy,
      timeSpentSeconds: Math.round(timeSpentSeconds),
      correctChars: correct,
      incorrectChars: incorrect,
      totalChars: input.length
    };
  };

  const stats = calculateStats();

  // Test Finish Action
  const finishTest = useCallback((overrideInput?: string) => {
    if (hasSavedRef.current) return;
    hasSavedRef.current = true;
    setIsFinished(true);
    setIsActive(false);

    const finalStats = calculateStats(overrideInput);
    if (onFinish) {
      onFinish(finalStats);
    }

    if (auth.currentUser) {
      setSaveStatus('saving');
      addDoc(collection(db, "users", auth.currentUser.uid, "history"), {
        wpm: Number(finalStats.wpm) || 0,
        accuracy: Number(finalStats.accuracy) || 0,
        mistakes: Number(finalStats.incorrectChars) || 0,
        createdAt: serverTimestamp(),
        mode: mode || "standard"
      })
      .then(() => {
        setSaveStatus('saved');
      })
      .catch((err) => {
        setSaveStatus('error');
        console.error("Firestore Save Error:", err);
      });
    }
  }, [userInput, text, mode, timeLeft, onFinish]);

  // Timer Countdown Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0 && !isFinished) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft <= 0 && !isFinished) {
      finishTest();
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, isFinished, finishTest]);

  // Keyboard shortcut listener for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        resetTest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetTest]);

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isFinished) return;

    const slicedVal = val.slice(0, text.length);

    if (!isActive && slicedVal.length > 0) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    setUserInput(slicedVal);

    if (slicedVal.length >= text.length) {
      finishTest(slicedVal);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Mode Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <span className="text-slate-500 uppercase px-2">Timer:</span>
          {(['30s', '60s', '120s', '300s', '600s'] as PracticeMode[]).map(m => (
            <button
              key={m}
              onClick={() => resetTest(m)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                mode === m 
                  ? 'bg-teal-400 text-slate-950 font-bold border-teal-300 shadow-xs' 
                  : 'bg-slate-800 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              {m === '60s' ? '1 Min' : m === '120s' ? '2 Min' : m === '300s' ? '5 Min' : m === '600s' ? '10 Min' : m}
            </button>
          ))}

          <span className="text-slate-400 dark:text-slate-500 uppercase px-2 ml-2">Type:</span>
          {(['words', 'paragraph'] as PracticeMode[]).map(m => (
            <button
              key={m}
              onClick={() => resetTest(m)}
              className={`px-3 py-1.5 rounded-lg border capitalize transition-all ${
                mode === m 
                  ? 'bg-teal-400 text-slate-950 font-bold border-teal-300 shadow-xs' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {isActive && (
            <button
              onClick={() => finishTest()}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-teal-400 hover:bg-teal-300 text-slate-950 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Finish Test</span>
            </button>
          )}
          <button
            onClick={() => resetTest()}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
            <span>Change Text</span>
          </button>
          <button
            onClick={() => resetTest()}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
            <span>Restart (Esc)</span>
          </button>
        </div>
      </div>

      {/* Real-time Stat Counter Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-teal-500 dark:text-teal-400" /> WPM
          </span>
          <span className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">{stats.wpm}</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-teal-500 dark:text-teal-400" /> Accuracy
          </span>
          <span className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">{stats.accuracy}%</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" /> Time Left
          </span>
          <span className="text-2xl font-extrabold text-amber-500 dark:text-amber-400">{timeLeft}s</span>
        </div>
      </div>

      {/* Main Interactive Typing Arena (Wide Landscape Text Area) */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 cursor-text shadow-lg group transition-colors w-full"
      >
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          disabled={isFinished}
          className="absolute opacity-0 pointer-events-none"
          autoFocus
        />

        {/* Character Display Box (Wide Landscape Settings) */}
        <div className="font-mono text-[1.25rem] sm:text-[1.35rem] leading-[1.8] tracking-wide select-none p-6 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 shadow-inner min-h-[160px] max-h-[260px] overflow-y-auto break-words w-full">
          {text.split('').map((char, index) => {
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
              bg = 'bg-teal-400 text-slate-950 font-bold animate-pulse px-1 rounded-xs shadow-md shadow-teal-400/50';
            }

            return (
              <span key={index} className={`${color} ${bg} transition-all duration-75`}>
                {char}
              </span>
            );
          })}
        </div>

        {!isActive && !isFinished && userInput.length === 0 && (
          <div className="mt-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 animate-pulse flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-teal-400"></span>
            Click here or press any key to start typing...
          </div>
        )}

        {/* Interactive Virtual Keyboard */}
        <div className="mt-8 space-y-2 pt-6 border-t border-slate-200 dark:border-slate-800/80">
          <div className="flex justify-center gap-1.5">
            {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(key => {
              const active = text[userInput.length]?.toUpperCase() === key;
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
              const active = text[userInput.length]?.toUpperCase() === key;
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
              const active = text[userInput.length]?.toUpperCase() === key;
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
          <div className="flex justify-center pt-1">
            {(() => {
              const isSpaceActive = text[userInput.length] === ' ';
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

      {/* Finished Summary Modal */}
      {isFinished && (
        <div className="bg-white dark:bg-slate-900 border border-teal-400/40 rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <div className="inline-flex p-3 rounded-full bg-teal-400/10 text-teal-500 dark:text-teal-400">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Test Completed!</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
            <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Final WPM</div>
              <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">{stats.wpm}</div>
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Accuracy</div>
              <div className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">{stats.accuracy}%</div>
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Correct Chars</div>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{stats.correctChars}</div>
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Errors</div>
              <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">{stats.incorrectChars}</div>
            </div>
          </div>

          <div className="py-1">
            {currentUser ? (
              saveStatus === 'saving' ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-400/30 animate-pulse">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Saving score to cloud history...</span>
                </div>
              ) : saveStatus === 'saved' ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-teal-400/10 text-teal-600 dark:text-teal-300 border border-teal-400/30">
                  <CloudCheck className="w-4 h-4 text-teal-500 dark:text-teal-400" />
                  <span>Saved to your Cloud History</span>
                </div>
              ) : saveStatus === 'error' ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Cloud sync failed (score saved locally)</span>
                </div>
              ) : null
            ) : (
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 p-2.5 rounded-xl text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2">
                <span>💡 Guest Mode: Sign in to save your typing history & track progress over time.</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => generateCertificatePDF({ stats, mode, user: currentUser })}
              className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Certificate</span>
            </button>

            <button
              onClick={() => resetTest()}
              className="flex-1 py-3 px-4 bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              <span>Next Practice</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};