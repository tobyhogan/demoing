import { useParams, useNavigate } from 'react-router-dom';
import { ViewDeckPage } from '../components/ViewDeckPage';
import { findDeckBySlug } from '../utils/urlUtils';
import type { Deck, Flashcard } from '../types/flashcard';

interface DeckRouteProps {
  decks: Deck[];
  cards: Flashcard[];
  onStudyDeck: (deckId: string) => void;
}

export function DeckRoute({ decks, cards, onStudyDeck }: DeckRouteProps) {
  const { deckSlug } = useParams();
  const navigate = useNavigate();

  if (!deckSlug) {
    navigate('/');
    return null;
  }

  const deckId = findDeckBySlug(decks, deckSlug);
  const deck = decks.find(d => d.id === deckId);

  if (!deck) {
    navigate('/');
    return null;
  }

  return (
    <ViewDeckPage
      deck={deck}
      cards={cards}
      onStudyDeck={() => onStudyDeck(deck.id)}
      onBack={() => navigate('/')}
    />
  );
}
