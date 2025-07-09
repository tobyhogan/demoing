import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import type { Flashcard, Deck } from './types/flashcard';
import { createNewCard, createNewDeck } from './utils/spacedRepetition';
import { sampleFlashcards, sampleDecks } from './data/sampleCards';
import { HomePage } from './components/HomePage';
import { DeckRoute } from './routes/DeckRoute';
import { StudyRoute } from './routes/StudyRoute';
import { AddCardRoute } from './routes/AddCardRoute';
import { CreateDeckRoute } from './routes/CreateDeckRoute';
import { createSlug } from './utils/urlUtils';

function App() {
  const [cards, setCards] = useState<Flashcard[]>(sampleFlashcards);
  const [decks, setDecks] = useState<Deck[]>(sampleDecks);

  const handleAddCard = (front: string, back: string, deckId: string) => {
    const newCard = createNewCard(front, back, deckId);
    setCards(prev => [...prev, newCard]);
    
    // Update deck card count
    setDecks(prev => prev.map(deck => 
      deck.id === deckId 
        ? { ...deck, cardCount: deck.cardCount + 1 }
        : deck
    ));
  };

  const handleCreateDeck = (name: string, description: string, color: string) => {
    const newDeck = createNewDeck(name, description, color);
    setDecks(prev => [...prev, newDeck]);
  };

  const handleUpdateCard = (updatedCard: Flashcard) => {
    setCards(prev => prev.map(card => 
      card.id === updatedCard.id ? updatedCard : card
    ));
  };

  const handleStudyDeck = (deckId: string) => {
    if (deckId === 'all') {
      window.location.href = '/study/all';
    } else {
      const deck = decks.find(d => d.id === deckId);
      if (deck) {
        const slug = createSlug(deck.name);
        window.location.href = `/study/${slug}`;
      }
    }
  };

  const handleAddCardToDeck = (deckId: string) => {
    const deck = decks.find(d => d.id === deckId);
    if (deck) {
      const slug = createSlug(deck.name);
      window.location.href = `/add-card?deck=${slug}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                onAddCardToDeck={handleAddCardToDeck}
                onStudyDeck={handleStudyDeck}
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
