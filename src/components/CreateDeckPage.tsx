import { useState } from 'react';

interface CreateDeckPageProps {
  onCreateDeck: (name: string, description: string, color: string) => void;
  onCancel: () => void;
}

const deckColors = [
  { name: 'Blue', value: 'bg-blue-500', border: 'border-blue-500', ring: 'ring-blue-500' },
  { name: 'Green', value: 'bg-green-500', border: 'border-green-500', ring: 'ring-green-500' },
  { name: 'Purple', value: 'bg-purple-500', border: 'border-purple-500', ring: 'ring-purple-500' },
  { name: 'Red', value: 'bg-red-500', border: 'border-red-500', ring: 'ring-red-500' },
  { name: 'Yellow', value: 'bg-yellow-500', border: 'border-yellow-500', ring: 'ring-yellow-500' },
  { name: 'Indigo', value: 'bg-indigo-500', border: 'border-indigo-500', ring: 'ring-indigo-500' },
  { name: 'Pink', value: 'bg-pink-500', border: 'border-pink-500', ring: 'ring-pink-500' },
  { name: 'Gray', value: 'bg-gray-500', border: 'border-gray-500', ring: 'ring-gray-500' },
];

export function CreateDeckPage({ onCreateDeck, onCancel }: CreateDeckPageProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(deckColors[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    
    try {
      onCreateDeck(name.trim(), description.trim(), selectedColor);
      
      // Reset form
      setName('');
      setDescription('');
      setSelectedColor(deckColors[0].value);
      
      // Show success message briefly
      setTimeout(() => {
        setIsSubmitting(false);
      }, 500);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">📁 Create New Deck</h1>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-600">Create a new deck to organize your flashcards</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Deck Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Deck Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter deck name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            maxLength={50}
          />
          <div className="text-xs text-gray-500 mt-1">{name.length}/50 characters</div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this deck is about..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            maxLength={200}
          />
          <div className="text-xs text-gray-500 mt-1">{description.length}/200 characters</div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Deck Color
          </label>
          <div className="grid grid-cols-4 gap-3">
            {deckColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setSelectedColor(color.value)}
                className={`
                  relative p-3 rounded-lg border-2 transition-all
                  ${selectedColor === color.value
                    ? `${color.border} ring-2 ${color.ring} ring-opacity-50`
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className={`w-8 h-8 ${color.value} rounded-full mx-auto mb-1`} />
                <div className="text-xs text-gray-600">{color.name}</div>
                {selectedColor === color.value && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        {name && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden max-w-xs">
              <div className={`h-4 ${selectedColor}`} />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
                {description && (
                  <p className="text-gray-600 text-sm mb-3">{description}</p>
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-500 text-sm">0 cards</span>
                </div>
                <div className="w-full py-2 px-4 bg-gray-100 text-gray-400 rounded-md text-sm text-center">
                  No cards to review
                </div>
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
            disabled={!name.trim() || isSubmitting}
            className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md transition-colors"
          >
            {isSubmitting ? 'Creating...' : 'Create Deck'}
          </button>
        </div>
      </form>
    </div>
  );
}
