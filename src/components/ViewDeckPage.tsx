import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Deck, Flashcard } from '../types/flashcard';
import { getCardsToReview } from '../utils/spacedRepetition';
import { createSlug } from '../utils/urlUtils';

interface ViewDeckPageProps {
  deck: Deck;
  cards: Flashcard[];
  onStudyDeck: () => void;
  onBack: () => void;
}

export function ViewDeckPage({ deck, cards, onStudyDeck, onBack }: ViewDeckPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const deckCards = cards.filter(card => card.deckId === deck.id);
  const reviewCards = getCardsToReview(deckCards);
  
  const filteredCards = deckCards.filter(card =>
    card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.back.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Due now';
    if (diffDays === 1) return 'Due tomorrow';
    return `Due in ${diffDays} days`;
  };

  const getCardStatus = (card: Flashcard) => {
    const isReviewCard = reviewCards.some(reviewCard => reviewCard.id === card.id);
    if (isReviewCard) return { status: 'Due', color: 'bg-red-100 text-red-800' };
    if (card.repetitions === 0) return { status: 'New', color: 'bg-blue-100 text-blue-800' };
    return { status: 'Learning', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              title="Back to Home"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-4 h-4 rounded-full ${deck.color}`} />
                <h1 className="text-2xl font-bold text-gray-900">{deck.name}</h1>
              </div>
              {deck.description && (
                <p className="text-gray-600">{deck.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{deckCards.length}</div>
            <div className="text-sm text-gray-600">Total Cards</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{reviewCards.length}</div>
            <div className="text-sm text-gray-600">Due for Review</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {deckCards.filter(card => card.repetitions > 0).length}
            </div>
            <div className="text-sm text-gray-600">Learned Cards</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {reviewCards.length > 0 && (
            <button
              onClick={onStudyDeck}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              📚 Study Now ({reviewCards.length} cards)
            </button>
          )}
          <button
            onClick={() => navigate(`/add-card?deck=${createSlug(deck.name)}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            ➕ Add Card to This Deck
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Cards List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredCards.length === 0 ? (
          <div className="p-8 text-center">
            {deckCards.length === 0 ? (
              <div>
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cards yet</h3>
                <p className="text-gray-600 mb-4">Start building your deck by adding some flashcards!</p>
                <button
                  onClick={() => navigate(`/add-card?deck=${createSlug(deck.name)}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Add Your First Card
                </button>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cards found</h3>
                <p className="text-gray-600">Try adjusting your search term.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredCards.map((card) => {
              const cardStatus = getCardStatus(card);
              return (
                <div key={card.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cardStatus.color}`}>
                          {cardStatus.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(card.nextReview)}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Question:</h4>
                        <p className="text-gray-700">{card.front}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Answer:</h4>
                        <p className="text-gray-700">{card.back}</p>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Repetitions</div>
                        <div className="text-lg font-semibold text-gray-900">{card.repetitions}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {filteredCards.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {filteredCards.length} of {deckCards.length} cards
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}
    </div>
  );
}
