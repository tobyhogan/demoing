interface HeaderProps {
  reviewCount: number;
  onMenuToggle: () => void;
  deckName?: string;
  onExit?: () => void;
}

export function Header({ reviewCount, onMenuToggle, deckName, onExit }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {onExit && (
            <button
              onClick={onExit}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              title="Back to Home"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {deckName ? `Studying: ${deckName}` : 'Flashcards'}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {reviewCount} to review
          </div>
        </div>
      </div>
    </header>
  );
}
