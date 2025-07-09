export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: number; // 0-3 (higher = easier)
  nextReview: Date;
  interval: number; // days until next review
  repetitions: number;
  easeFactor: number;
  deckId: string; // Add deck association
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  color: string;
  cardCount: number;
}

export type DifficultyLevel = 'again' | 'hard' | 'medium' | 'easy';

export type AppView = 'home' | 'study' | 'add-card' | 'create-deck' | 'view-deck';

export interface StudySession {
  cardsToReview: Flashcard[];
  currentCardIndex: number;
  showAnswer: boolean;
  selectedDeckId: string;
}
