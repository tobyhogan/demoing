import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import type { Flashcard } from './types/flashcard';
import { useAppData } from './hooks/useAppData';
import { HomePage } from './components/HomePage';
import { DeckRoute } from './routes/DeckRoute';
import { StudyRoute } from './routes/StudyRoute';
import { AddCardRoute } from './routes/AddCardRoute';
import { CreateDeckRoute } from './routes/CreateDeckRoute';

function App() {
  const {
    decks,
    cards,
    loading,
    error,
    isOffline,
    createCard,
    createDeck,
    updateCard,
    navigateToStudy,
  } = useAppData();

  // Wrapper function to convert from Flashcard object to API format
  const handleUpdateCard = async (updatedCard: Flashcard) => {
    const { id, ...updates } = updatedCard;
    await updateCard(id, updates);
  };

  // Wrapper functions for route components
  const handleAddCard = async (front: string, back: string, deckId: string) => {
    try {
      await createCard(deckId, front, back);
    } catch (error) {
      console.error('Failed to add card:', error);
      // You could add toast notifications here
    }
  };

  const handleCreateDeck = async (name: string, description: string, color: string) => {
    try {
      await createDeck(name, description, color);
    } catch (error) {
      console.error('Failed to create deck:', error);
      // You could add toast notifications here
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Offline notification banner */}
      {isOffline && (
        <div className="bg-yellow-500 text-white px-4 py-2 text-center">
          ⚠️ Running in offline mode with sample data. Database connection not available.
        </div>
      )}
      
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage
                decks={decks}
                cards={cards}
              />
            } 
          />
          
          <Route 
            path="/decks/:deckSlug" 
            element={
              <DeckRoute
                decks={decks}
                cards={cards}
                onStudyDeck={navigateToStudy}
              />
            } 
          />
          
          <Route 
            path="/study/:deckSlug" 
            element={
              <StudyRoute
                decks={decks}
                cards={cards}
                onUpdateCard={handleUpdateCard}
              />
            } 
          />
          
          <Route 
            path="/add-card" 
            element={
              <AddCardRoute
                decks={decks}
                onAddCard={handleAddCard}
              />
            } 
          />
          
          <Route 
            path="/create-deck" 
            element={
              <CreateDeckRoute
                onCreateDeck={handleCreateDeck}
              />
            } 
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
