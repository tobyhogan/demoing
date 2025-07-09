import type { Flashcard, DifficultyLevel } from '../types/flashcard';

export function updateCardAfterReview(card: Flashcard, difficulty: DifficultyLevel): Flashcard {
  const newCard = { ...card };
  
  switch (difficulty) {
    case 'again':
      newCard.repetitions = 0;
      newCard.interval = 1;
      newCard.easeFactor = Math.max(1.3, newCard.easeFactor - 0.2);
      break;
      
    case 'hard':
      newCard.repetitions += 1;
      newCard.interval = Math.max(1, Math.round(newCard.interval * 1.2));
      newCard.easeFactor = Math.max(1.3, newCard.easeFactor - 0.15);
      break;
      
    case 'medium':
      newCard.repetitions += 1;
      if (newCard.repetitions === 1) {
        newCard.interval = 1;
      } else if (newCard.repetitions === 2) {
        newCard.interval = 6;
      } else {
        newCard.interval = Math.round(newCard.interval * newCard.easeFactor);
      }
      break;
      
    case 'easy':
      newCard.repetitions += 1;
      if (newCard.repetitions === 1) {
        newCard.interval = 4;
      } else if (newCard.repetitions === 2) {
        newCard.interval = 6;
      } else {
        newCard.interval = Math.round(newCard.interval * newCard.easeFactor);
      }
      newCard.easeFactor += 0.15;
      break;
  }
  
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newCard.interval);
  newCard.nextReview = nextReview;
  
  return newCard;
}

export function getCardsToReview(cards: Flashcard[]): Flashcard[] {
  const now = new Date();
  return cards.filter(card => card.nextReview <= now);
}

export function createNewDeck(name: string, description: string, color: string): { id: string; name: string; description: string; color: string; cardCount: number } {
  return {
    id: crypto.randomUUID(),
    name,
    description,
    color,
    cardCount: 0,
  };
}

export function createNewCard(front: string, back: string, deckId: string): Flashcard {
  return {
    id: crypto.randomUUID(),
    front,
    back,
    difficulty: 0,
    nextReview: new Date(),
    interval: 0,
    repetitions: 0,
    easeFactor: 2.5,
    deckId,
  };
}
