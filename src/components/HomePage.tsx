import type { Deck, Flashcard } from '../types/flashcard';
import { getCardsToReview } from '../utils/spacedRepetition';

interface HomePageProps {
  decks: Deck[];
  cards: Flashcard[];
  onStartStudy: (deckId: string) => void;
  onAddCard: () => void;
  onCreateDeck: () => void;
}

export function HomePage({ decks, cards, onStartStudy, onAddCard, onCreateDeck }: HomePageProps) {
  const getReviewCountForDeck = (deckId: string) => {
    const deckCards = cards.filter(card => card.deckId === deckId);
    return getCardsToReview(deckCards).length;
  };

  const totalReviewCount = getCardsToReview(cards).length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">📚 Flashcards</h1>
        <p className="text-gray-600">Master your knowledge with spaced repetition</p>
        
        {totalReviewCount > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800">
              🔔 You have <span className="font-semibold">{totalReviewCount}</span> cards ready for review!
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onAddCard}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
          >
            <div className="text-2xl mb-2">➕</div>
            <h3 className="font-semibold text-gray-900 mb-1">Add New Card</h3>
            <p className="text-gray-600 text-sm">Create a new flashcard for any deck</p>
          </button>
          
          <button
            onClick={onCreateDeck}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-left"
          >
            <div className="text-2xl mb-2">📁</div>
            <h3 className="font-semibold text-gray-900 mb-1">Create New Deck</h3>
            <p className="text-gray-600 text-sm">Organize your cards into new categories</p>
          </button>
          
          {totalReviewCount > 0 && (
            <button
              onClick={() => onStartStudy('all')}
              className="p-6 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-left"
            >
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="font-semibold mb-1">Study All Cards</h3>
              <p className="text-green-100 text-sm">Review {totalReviewCount} cards from all decks</p>
            </button>
          )}
        </div>
      </div>

      {/* Decks Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Decks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => {
            const reviewCount = getReviewCountForDeck(deck.id);
            const totalCards = cards.filter(card => card.deckId === deck.id).length;
            
            return (
              <div
                key={deck.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className={`h-4 ${deck.color}`} />
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{deck.name}</h3>
                  {deck.description && (
                    <p className="text-gray-600 text-sm mb-4">{deck.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-500 text-sm">{totalCards} cards</span>
                    {reviewCount > 0 && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        {reviewCount} to review
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => onStartStudy(deck.id)}
                    disabled={reviewCount === 0}
                    className={`
                      w-full py-2 px-4 rounded-md font-medium transition-colors
                      ${reviewCount > 0
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {reviewCount > 0 ? 'Study Now' : 'No cards to review'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
