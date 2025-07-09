import type { Flashcard } from '../types/flashcard';

interface CardDisplayProps {
  card: Flashcard;
  showAnswer: boolean;
  onShowAnswer: () => void;
  cardIndex: number;
  totalCards: number;
}

export function CardDisplay({ card, showAnswer, onShowAnswer, cardIndex, totalCards }: CardDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500 w-[82px]">
            Card {cardIndex + 1} of {totalCards}
          </span>
          <div className="w-full bg-gray-200 rounded-full h-2 mx-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((cardIndex + 1) / totalCards) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Question</h3>
          <p className="text-xl text-gray-900 mb-8">{card.front}</p>
        </div>
      </div>
      
      {showAnswer ? (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4 text-center">Answer</h3>
          <p className="text-xl text-gray-900 text-center">{card.back}</p>
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={onShowAnswer}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Show Answer
          </button>
        </div>
      )}
    </div>
  );
}
