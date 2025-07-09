import { useState } from 'react';
import type { Deck } from '../types/flashcard';

interface AddCardPageProps {
  decks: Deck[];
  onAddCard: (front: string, back: string, deckId: string) => Promise<void>;
  onCancel: () => void;
  preselectedDeckId?: string;
}

export function AddCardPage({ decks, onAddCard, onCancel, preselectedDeckId }: AddCardPageProps) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [selectedDeckId, setSelectedDeckId] = useState(preselectedDeckId || decks[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim() || !selectedDeckId) return;

    setIsSubmitting(true);
    
    try {
      await onAddCard(front.trim(), back.trim(), selectedDeckId);
      
      // Reset form
      setFront('');
      setBack('');
      setSelectedDeckId(decks[0]?.id || '');
      
      // Show success message briefly
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    } catch {
      setIsSubmitting(false);
    }
  };

  const selectedDeck = decks.find(deck => deck.id === selectedDeckId);

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">➕ Add New Flashcard</h1>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600">Create a new flashcard to add to your collection</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Deck Selection */}
        <div>
          <label htmlFor="deck" className="block text-sm font-medium text-gray-700 mb-2">
            Select Deck
          </label>
          <select
            id="deck"
            value={selectedDeckId}
            onChange={(e) => setSelectedDeckId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.name}
              </option>
            ))}
          </select>
          {selectedDeck && (
            <div className="mt-2 flex items-center">
              <div className={`w-3 h-3 rounded-full ${selectedDeck.color} mr-2`} />
              <span className="text-sm text-gray-600">{selectedDeck.description}</span>
            </div>
          )}
        </div>

        {/* Question */}
        <div>
          <label htmlFor="front" className="block text-sm font-medium text-gray-700 mb-2">
            Question (Front)
          </label>
          <textarea
            id="front"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="Enter your question here..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required
          />
        </div>

        {/* Answer */}
        <div>
          <label htmlFor="back" className="block text-sm font-medium text-gray-700 mb-2">
            Answer (Back)
          </label>
          <textarea
            id="back"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="Enter the answer here..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required
          />
        </div>

        {/* Preview */}
        {front && back && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Question:</div>
                <div className="text-sm text-gray-900">{front}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Answer:</div>
                <div className="text-sm text-gray-900">{back}</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!front.trim() || !back.trim() || !selectedDeckId || isSubmitting}
            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md transition-colors"
          >
            {isSubmitting ? 'Adding...' : 'Add Card'}
          </button>
        </div>
      </form>
    </div>
  );
}
