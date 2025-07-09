import { useState, useEffect } from 'react';
import type { Flashcard, DifficultyLevel } from '../types/flashcard';
import { updateCardAfterReview, getCardsToReview } from '../utils/spacedRepetition';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CardDisplay } from './CardDisplay';
import { DifficultyButtons } from './DifficultyButtons';

interface StudyPageProps {
  cards: Flashcard[];
  deckId: string;
  deckName: string;
  onUpdateCard: (updatedCard: Flashcard) => Promise<void>;
  onExit: () => void;
}

export function StudyPage({ cards, deckId, deckName, onUpdateCard, onExit }: StudyPageProps) {
  const [cardsToReview, setCardsToReview] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const deckCards = deckId === 'all' ? cards : cards.filter(card => card.deckId === deckId);
    const reviewCards = getCardsToReview(deckCards);
    setCardsToReview(reviewCards);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  }, [cards, deckId]);

  const handleDifficultySelect = async (difficulty: DifficultyLevel) => {
    if (cardsToReview.length === 0) return;

    const currentCard = cardsToReview[currentCardIndex];
    const updatedCard = updateCardAfterReview(currentCard, difficulty);
    
    try {
      // Update the card
      await onUpdateCard(updatedCard);

      // Move to next card or finish session
      if (currentCardIndex < cardsToReview.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
        setShowAnswer(false);
      } else {
        // Session complete
        onExit();
      }
    } catch (error) {
      console.error('Failed to update card:', error);
      // You could add error handling here
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const currentCard = cardsToReview[currentCardIndex];

  if (cardsToReview.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header 
          reviewCount={0}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          deckName={deckName}
          onExit={onExit}
        />
        
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              All caught up!
            </h2>
            <p className="text-gray-600 mb-6">
              No cards to review in {deckName === 'All Decks' ? 'any deck' : deckName} right now. Come back later!
            </p>
            <button
              onClick={onExit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        cards={cardsToReview}
        currentIndex={currentCardIndex}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col">
        <Header 
          reviewCount={cardsToReview.length}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          deckName={deckName}
          onExit={onExit}
        />
        
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <CardDisplay 
              card={currentCard}
              showAnswer={showAnswer}
              onShowAnswer={handleShowAnswer}
              cardIndex={currentCardIndex}
              totalCards={cardsToReview.length}
            />
            
            {showAnswer && (
              <DifficultyButtons onSelect={handleDifficultySelect} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
