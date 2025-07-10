import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Deck, Flashcard } from '../types/flashcard';
import { getCardsToReview } from '../utils/spacedRepetition';
import { createSlug } from '../utils/urlUtils';

interface HomePageProps {
  decks: Deck[];
  cards: Flashcard[];
  onUpdateDeck: (id: string, updates: Partial<Omit<Deck, 'id' | 'cardCount'>>) => Promise<Deck>;
  onDeleteDeck: (id: string) => Promise<void>;
}

export function HomePage({ decks, cards, onUpdateDeck, onDeleteDeck }: HomePageProps) {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editingDeck, setEditingDeck] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteConfirmDeck, setDeleteConfirmDeck] = useState<Deck | null>(null);
  
  const getReviewCountForDeck = (deckId: string) => {
    const deckCards = cards.filter(card => card.deckId === deckId);
    return getCardsToReview(deckCards).length;
  };

  const totalReviewCount = getCardsToReview(cards).length;

  const handleRename = async (deckId: string, newName: string) => {
    if (newName.trim() && newName !== decks.find(d => d.id === deckId)?.name) {
      try {
        await onUpdateDeck(deckId, { name: newName.trim() });
      } catch (error) {
        console.error('Failed to rename deck:', error);
      }
    }
    setEditingDeck(null);
    setOpenDropdown(null);
  };

  const handleDelete = async (deckId: string) => {
    const deck = decks.find(d => d.id === deckId);
    if (deck) {
      setDeleteConfirmDeck(deck);
    }
    setOpenDropdown(null);
  };

  const confirmDelete = async () => {
    if (deleteConfirmDeck) {
      try {
        await onDeleteDeck(deleteConfirmDeck.id);
      } catch (error) {
        console.error('Failed to delete deck:', error);
      }
    }
    setDeleteConfirmDeck(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmDeck(null);
  };

  const startRename = (deck: Deck) => {
    setEditingDeck(deck.id);
    setEditName(deck.name);
    setOpenDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

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
          {/*
          <button
            onClick={() => navigate('/add-card')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-left"
          >
            <div className="text-2xl mb-2">➕</div>
            <h3 className="font-semibold text-gray-900 mb-1">Add New Card</h3>
            <p className="text-gray-600 text-sm">Create a new flashcard for any deck</p>
          </button>
          */}
          
          <button
            onClick={() => navigate('/create-deck')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-left"
          >
            <div className="text-2xl mb-2">📁</div>
            <h3 className="font-semibold text-gray-900 mb-1">Create New Deck</h3>
            <p className="text-gray-600 text-sm">Organize your cards into new categories</p>
          </button>
          
          {totalReviewCount > 0 && (
            <button
              onClick={() => navigate('/study/all')}
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
            const deckSlug = createSlug(deck.name);
            
            return (
              <div
                key={deck.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow relative"
              >
                <div className={`h-4 ${deck.color}`} />
                
                {/* Three dots menu */}
                <div className="absolute top-6 right-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDropdown(openDropdown === deck.id ? null : deck.id);
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                  
                  {openDropdown === deck.id && (
                    <div className="absolute right-0 top-8 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startRename(deck);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-md"
                      >
                        Rename
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(deck.id);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-md"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div 
                    className="cursor-pointer mb-4"
                    onClick={() => navigate(`/decks/${deckSlug}`)}
                  >
                    {editingDeck === deck.id ? (
                      <div className="mb-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={() => handleRename(deck.id, editName)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleRename(deck.id, editName);
                            } else if (e.key === 'Escape') {
                              setEditingDeck(null);
                            }
                          }}
                          className="w-full px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {deck.name}
                      </h3>
                    )}
                    {deck.description && (
                      <p className="text-gray-600 text-sm mb-4">{deck.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">{totalCards} cards</span>
                      {reviewCount > 0 && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          {reviewCount} to review
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate(`/study/${deckSlug}`)}
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
                    
                    <button
                      onClick={() => navigate(`/decks/${deckSlug}`)}
                      className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      View Deck ({totalCards})
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmDeck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Deck</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<span className="font-medium">{deleteConfirmDeck.name}</span>"? 
              This will also delete all cards in the deck. This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Deck
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
