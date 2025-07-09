import { useParams, useNavigate } from 'react-router-dom';
import { StudyPage } from '../components/StudyPage';
import { findDeckBySlug } from '../utils/urlUtils';
import type { Deck, Flashcard } from '../types/flashcard';

interface StudyRouteProps {
  decks: Deck[];
  cards: Flashcard[];
  onUpdateCard: (card: Flashcard) => Promise<void>;
}

export function StudyRoute({ decks, cards, onUpdateCard }: StudyRouteProps) {
  const { deckSlug } = useParams();
  const navigate = useNavigate();

  if (!deckSlug) {
    navigate('/');
    return null;
  }

  let deckId: string;
  let deckName: string;

  if (deckSlug === 'all') {
    deckId = 'all';
    deckName = 'All Decks';
  } else {
    const foundDeckId = findDeckBySlug(decks, deckSlug);
    const deck = decks.find(d => d.id === foundDeckId);
    
    if (!deck) {
      navigate('/');
      return null;
    }
    
    deckId = deck.id;
    deckName = deck.name;
  }

  return (
    <StudyPage
      cards={cards}
      deckId={deckId}
      deckName={deckName}
      onUpdateCard={onUpdateCard}
      onExit={() => navigate('/')}
    />
  );
}
