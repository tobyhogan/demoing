export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: number; // 0-3 (higher = easier)
  nextReview: Date;
  interval: number; // days until next review
  repetitions: number;
  easeFactor: number;
}

export type DifficultyLevel = 'again' | 'hard' | 'medium' | 'easy';

export interface StudySession {
  cardsToReview: Flashcard[];
  currentCardIndex: number;
  showAnswer: boolean;
}
