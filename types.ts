/**
 * Global Type Definitions for Typing Master Pro
 */

export type NavigationTab = 
  | 'home' 
  | 'practice' 
  | 'lessons' 
  | 'speedtest' 
  | 'dashboard' 
  | 'leaderboard' 
  | 'profile' 
  | 'admin' 
  | 'about' 
  | 'contact' 
  | 'login' 
  | 'signup';

export type ThemeMode = 'light' | 'dark';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  isAdmin?: boolean;
}

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  timeSpentSeconds: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}
