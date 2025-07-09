import { useState } from 'react';
import type { Flashcard, Deck, AppView } from './types/flashcard';
import { createNewCard, createNewDeck } from './utils/spacedRepetition';
import { sampleFlashcards, sampleDecks } from './data/sampleCards';
import { HomePage } from './components/HomePage';
import { StudyPage } from './components/StudyPage';
import { AddCardPage } from './components/AddCardPage';
import { CreateDeckPage } from './components/CreateDeckPage';

function App() {
  const [cards, setCards] = useState<Flashcard[]>(sampleFlashcards);
  const [decks, setDecks] = useState<Deck[]>(sampleDecks);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedDeckId, setSelectedDeckId] = useState<string>('');

  const handleStartStudy = (deckId: string) => {
    setSelectedDeckId(deckId);
    setCurrentView('study');
  };

  const handleAddCard = (front: string, back: string, deckId: string) => {
    const newCard = createNewCard(front, back, deckId);
    setCards(prev => [...prev, newCard]);
    
    // Update deck card count
    setDecks(prev => prev.map(deck => 
      deck.id === deckId 
        ? { ...deck, cardCount: deck.cardCount + 1 }
        : deck
    ));
    
    setCurrentView('home');
  };

  const handleCreateDeck = (name: string, description: string, color: string) => {
    const newDeck = createNewDeck(name, description, color);
    setDecks(prev => [...prev, newDeck]);
    setCurrentView('home');
  };

  const handleUpdateCard = (updatedCard: Flashcard) => {
    setCards(prev => prev.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    ));
  };

  const handleExitStudy = () => {
    setCurrentView('home');
    setSelectedDeckId('');
  };

  const handleShowAddCard = () => {
    setCurrentView('add-card');
  };

  const handleShowCreateDeck = () => {
    setCurrentView('create-deck');
  };

  const handleCancelAddCard = () => {
    setCurrentView('home');
  };

  const handleCancelCreateDeck = () => {
    setCurrentView('home');
  };

  const getDeckName = (deckId: string) => {
    if (deckId === 'all') return 'All Decks';
    return decks.find(deck => deck.id === deckId)?.name || 'Unknown Deck';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'home' && (
        <HomePage
          decks={decks}
          cards={cards}
          onStartStudy={handleStartStudy}
          onAddCard={handleShowAddCard}
          onCreateDeck={handleShowCreateDeck}
        />
      )}
      
      {currentView === 'study' && (
        <StudyPage
          cards={cards}
          deckId={selectedDeckId}
          deckName={getDeckName(selectedDeckId)}
          onUpdateCard={handleUpdateCard}
          onExit={handleExitStudy}
        />
      )}
      
      {currentView === 'add-card' && (
        <AddCardPage
          decks={decks}
          onAddCard={handleAddCard}
          onCancel={handleCancelAddCard}
        />
      )}
      
      {currentView === 'create-deck' && (
        <CreateDeckPage
          onCreateDeck={handleCreateDeck}
          onCancel={handleCancelCreateDeck}
        />
      )}
    </div>
  );
}

export default App;
