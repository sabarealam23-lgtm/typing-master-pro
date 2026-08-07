import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Zap, Target, Clock, CheckCircle2, Award, Download, FileCheck } from 'lucide-react';
import { TypingStats } from '../types';
import { generateCertificatePDF } from '../utils/certificate';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../firebase';

export type PracticeMode = '15s' | '30s' | '60s' | '120s' | 'words' | 'paragraph';

const SAMPLE_TEXTS: Record<PracticeMode, string> = {
  '15s': 'the quick brown fox jumps over the lazy dog speed accuracy focus clarity power knowledge learning technology algorithm developer frontend code mastery',
  '30s': 'success is not final failure is not fatal it is the courage to continue that counts practice makes perfect every keystroke brings you closer to your typing goal focus on rhythm and precision',
  '60s': 'in the world of software development speed and precision are invaluable skills typing efficiently allows your thoughts to flow seamlessly into code without interruption practice daily to build muscle memory and increase your words per minute effortlessly',
  '120s': 'programming is the art of telling a computer what to do through clear instructions typing with speed and accuracy gives engineers a massive advantage when writing code designing algorithms and communicating in fast paced agile development environments keep practicing every day',
  'words': 'keyboard rhythm accuracy velocity cursor tactile mechanics keystroke latency response dexterity digital workflow productivity master proficiency lightning',
  'paragraph': 'Great typists are not born; they are forged through dedicated daily practice. By focusing on maintaining high accuracy over raw speed, your fingers naturally develop muscle memory, allowing you to hit keys instinctively without ever looking down at your keyboard.'
};

interface TypingArenaProps {
  initialMode?: PracticeMode;
  onFinish?: (stats: TypingStats) => void;
}

export const TypingArena: React.FC<TypingArenaProps> = ({ 
  initialMode = '30s',
  onFinish 
}) => {
  const [mode, setMode] = useState<PracticeMode>(initialMode);
  const [text, setText] = useState<string>(SAMPLE_TEXTS[initialMode]);
  const [userInput, setUserInput] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);

  const inputRef = useRef<HTMLInputElement>(null);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Initialize timer limit based on mode
  const getModeDuration = (m: PracticeMode): number => {
    if (m === '15s') return 15;
    if (m === '30s') return 30;
    if (m === '60s') return 60;
    if (m === '120s') return 120;
    return 60; // default for passage modes
  };

  const resetTest = useCallback((newMode?: PracticeMode) => {
    const activeM = newMode || mode;
    setMode(activeM);
    setText(SAMPLE_TEXTS[activeM]);
    setUserInput('');
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(getModeDuration(activeM));
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [mode]);

  // Timer Countdown Effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0 && !isFinished) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsFinished(true);
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, isFinished]);

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

    if (!isActive && val.length > 0) {
      setIsActive(true);
    }

    setUserInput(val);

    // Auto finish if full text typed
    if (val.length >= text.length) {
      setIsFinished(true);
      setIsActive(false);
    }
  };

  // Calculate Real-time Stats
  const calculateStats = (): TypingStats => {
    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) correct++;
      else incorrect++;
    }

    const duration = getModeDuration(mode);
    const timeSpent = isActive || isFinished ? duration - timeLeft : 1;
    const minutes = Math.max(timeSpent, 1) / 60;
    
    const wpm = Math.round((correct / 5) / minutes);
    const rawWpm = Math.round((userInput.length / 5) / minutes);
    const accuracy = userInput.length > 0 ? Math.round((correct / userInput.length) * 100) : 100;

    return {
      wpm: isNaN(wpm) ? 0 : wpm,
      rawWpm: isNaN(rawWpm) ? 0 : rawWpm,
      accuracy: isNaN(accuracy) ? 100 : accuracy,
      timeSpentSeconds: timeSpent,
      correctChars: correct,
      incorrectChars: incorrect,
      totalChars: userInput.length
    };
  };

  const stats = calculateStats();

  return (
    <div className="w-full space-y-6">
      {/* Mode Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <span className="text-slate-500 uppercase px-2">Timer:</span>
          {(['15s', '30s', '60s', '120s'] as PracticeMode[]).map(m => (
            <button
              key={m}
              onClick={() => resetTest(m)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                mode === m 
                  ? 'bg-teal-400 text-slate-950 font-bold border-teal-300 shadow-xs' 
                  : 'bg-slate-800 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              {m}
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

        <button
          onClick={() => resetTest()}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
          <span>Restart (Esc)</span>
        </button>
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

      {/* Main Interactive Typing Arena */}
      <div 
        onClick={() => inputRef.current?.focus()}
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 min-h-[220px] flex flex-col justify-center cursor-text shadow-lg group transition-colors"
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

        {/* Character Display */}
        <div className="font-mono text-xl sm:text-2xl leading-relaxed tracking-wide select-none p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 shadow-inner">
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

        {/* Interactive Virtual Keyboard Preview */}
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
          {/* Spacebar Row */}
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

      {/* Finished Summary Modal / Card */}
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

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => generateCertificatePDF({ stats, mode, user: currentUser })}
              className="flex-1 py-3 px-4 bg-teal-400 hover:bg-teal-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Certificate</span>
            </button>

            <button
              onClick={() => resetTest()}
              className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
