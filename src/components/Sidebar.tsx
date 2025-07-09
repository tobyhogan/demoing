import type { Flashcard } from '../types/flashcard';

interface SidebarProps {
  cards: Flashcard[];
  currentIndex: number;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ cards, currentIndex, isOpen }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Cards to Review</h2>
            <p className="text-sm text-gray-600">{cards.length} remaining</p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {cards.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No cards to review
              </div>
            ) : (
              <div className="p-2">
                {cards.map((card, index) => (
                  <div
                    key={card.id}
                    className={`
                      p-3 mb-2 rounded-lg border transition-colors
                      ${index === currentIndex 
                        ? 'bg-blue-50 border-blue-200' 
                        : index < currentIndex 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                        ${index === currentIndex 
                          ? 'bg-blue-500 text-white' 
                          : index < currentIndex 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-300 text-gray-600'
                        }
                      `}>
                        {index < currentIndex ? '✓' : index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {card.front}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
