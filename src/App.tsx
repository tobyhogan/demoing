import { useState, useEffect } from 'react';
import type { Flashcard, DifficultyLevel } from './types/flashcard';
import { updateCardAfterReview, getCardsToReview } from './utils/spacedRepetition';
import { sampleFlashcards } from './data/sampleCards';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CardDisplay } from './components/CardDisplay';
import { DifficultyButtons } from './components/DifficultyButtons';

function App() {
  const [cards, setCards] = useState<Flashcard[]>(sampleFlashcards);
  const [cardsToReview, setCardsToReview] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const reviewCards = getCardsToReview(cards);
    setCardsToReview(reviewCards);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  }, [cards]);

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    if (cardsToReview.length === 0) return;

    const currentCard = cardsToReview[currentCardIndex];
    const updatedCard = updateCardAfterReview(currentCard, difficulty);
    
    // Update the card in the main cards array
    const updatedCards = cards.map(card => 
      card.id === currentCard.id ? updatedCard : card
    );
    setCards(updatedCards);

    // Move to next card or finish session
    if (currentCardIndex < cardsToReview.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      // Session complete, refresh cards to review
      const newReviewCards = getCardsToReview(updatedCards);
      setCardsToReview(newReviewCards);
      setCurrentCardIndex(0);
      setShowAnswer(false);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const currentCard = cardsToReview[currentCardIndex];

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
        />
        
        <main className="flex-1 flex items-center justify-center p-4">
          {cardsToReview.length > 0 ? (
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
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                🎉 All caught up!
              </h2>
              <p className="text-gray-600">
                No cards to review right now. Come back later!
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
