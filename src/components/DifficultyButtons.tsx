import type { DifficultyLevel } from '../types/flashcard';

interface DifficultyButtonsProps {
  onSelect: (difficulty: DifficultyLevel) => void;
}

export function DifficultyButtons({ onSelect }: DifficultyButtonsProps) {
  const buttons = [
    {
      level: 'again' as DifficultyLevel,
      label: 'Again',
      color: 'bg-red-600 hover:bg-red-700',
      description: 'Completely forgot'
    },
    {
      level: 'hard' as DifficultyLevel,
      label: 'Hard',
      color: 'bg-orange-600 hover:bg-orange-700',
      description: 'Difficult to recall'
    },
    {
      level: 'medium' as DifficultyLevel,
      label: 'Medium',
      color: 'bg-yellow-600 hover:bg-yellow-700',
      description: 'Some hesitation'
    },
    {
      level: 'easy' as DifficultyLevel,
      label: 'Easy',
      color: 'bg-green-600 hover:bg-green-700',
      description: 'Perfect recall'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
        How well did you know this?
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {buttons.map((button) => (
          <button
            key={button.level}
            onClick={() => onSelect(button.level)}
            className={`
              ${button.color} text-white font-medium py-3 px-4 rounded-lg 
              transition-colors text-center
            `}
          >
            <div className="text-sm font-semibold">{button.label}</div>
            <div className="text-xs opacity-90 mt-1">{button.description}</div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Your answer affects when you'll see this card next
      </div>
    </div>
  );
}
