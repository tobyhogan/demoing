import { useNavigate, useLocation } from 'react-router-dom';
import { AddCardPage } from '../components/AddCardPage';
import { findDeckBySlug } from '../utils/urlUtils';
import type { Deck } from '../types/flashcard';

interface AddCardRouteProps {
  decks: Deck[];
  onAddCard: (front: string, back: string, deckId: string) => Promise<void>;
}

export function AddCardRoute({ decks, onAddCard }: AddCardRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we came from a specific deck
  const searchParams = new URLSearchParams(location.search);
  const deckSlug = searchParams.get('deck');
  
  let preselectedDeckId = '';
  if (deckSlug) {
    const foundDeckId = findDeckBySlug(decks, deckSlug);
    if (foundDeckId) {
      preselectedDeckId = foundDeckId;
    }
  }

  const handleAddCard = async (front: string, back: string, deckId: string) => {
    try {
      await onAddCard(front, back, deckId);
      
      // Navigate back to the deck if we came from one, otherwise go home
      if (preselectedDeckId) {
        const deck = decks.find(d => d.id === deckId);
        if (deck) {
          const slug = deck.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
          navigate(`/decks/${slug}`);
          return;
        }
      }
      navigate('/');
    } catch (error) {
      console.error('Failed to add card:', error);
      // You could add error handling here (toast notification, etc.)
    }
  };

  const handleCancel = () => {
    if (preselectedDeckId) {
      const deck = decks.find(d => d.id === preselectedDeckId);
      if (deck) {
        const slug = deck.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        navigate(`/decks/${slug}`);
        return;
      }
    }
    navigate('/');
  };

  return (
    <AddCardPage
      decks={decks}
      onAddCard={handleAddCard}
      onCancel={handleCancel}
      preselectedDeckId={preselectedDeckId}
    />
  );
}
