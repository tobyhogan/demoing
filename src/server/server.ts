import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { DeckService } from '../services/deckService';
import { FlashcardService } from '../services/flashcardService';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Deck routes
app.get('/api/decks', async (_req, res) => {
  try {
    const decks = await DeckService.getAllDecks();
    res.json(decks);
  } catch (error) {
    console.error('Error fetching decks:', error);
    res.status(500).json({ error: 'Failed to fetch decks' });
  }
});

app.get('/api/decks/:id', async (req, res) => {
  try {
    const deck = await DeckService.getDeckById(req.params.id);
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    res.json(deck);
  } catch (error) {
    console.error('Error fetching deck:', error);
    res.status(500).json({ error: 'Failed to fetch deck' });
  }
});

app.post('/api/decks', async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    if (!name || !description || !color) {
      return res.status(400).json({ error: 'Name, description, and color are required' });
    }
    
    const deck = await DeckService.createDeck(name, description, color);
    res.status(201).json(deck);
  } catch (error) {
    console.error('Error creating deck:', error);
    res.status(500).json({ error: 'Failed to create deck' });
  }
});

app.put('/api/decks/:id', async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const deck = await DeckService.updateDeck(req.params.id, { name, description, color });
    
    if (!deck) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    
    res.json(deck);
  } catch (error) {
    console.error('Error updating deck:', error);
    res.status(500).json({ error: 'Failed to update deck' });
  }
});

app.delete('/api/decks/:id', async (req, res) => {
  try {
    const success = await DeckService.deleteDeck(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Deck not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting deck:', error);
    res.status(500).json({ error: 'Failed to delete deck' });
  }
});

// Flashcard routes
app.get('/api/cards', async (req, res) => {
  try {
    const { deckId, dueOnly } = req.query;
    
    let cards;
    if (deckId && dueOnly === 'true') {
      cards = await FlashcardService.getCardsDueForReviewByDeck(deckId as string);
    } else if (deckId) {
      cards = await FlashcardService.getCardsByDeckId(deckId as string);
    } else if (dueOnly === 'true') {
      cards = await FlashcardService.getCardsDueForReview();
    } else {
      cards = await FlashcardService.getAllCards();
    }
    
    res.json(cards);
  } catch (error) {
    console.error('Error fetching cards:', error);
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

app.get('/api/cards/:id', async (req, res) => {
  try {
    const card = await FlashcardService.getCardById(req.params.id);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
  } catch (error) {
    console.error('Error fetching card:', error);
    res.status(500).json({ error: 'Failed to fetch card' });
  }
});

app.post('/api/cards', async (req, res) => {
  try {
    const { deckId, front, back } = req.body;
    
    if (!deckId || !front || !back) {
      return res.status(400).json({ error: 'Deck ID, front, and back are required' });
    }
    
    const card = await FlashcardService.createCard(deckId, front, back);
    res.status(201).json(card);
  } catch (error) {
    console.error('Error creating card:', error);
    res.status(500).json({ error: 'Failed to create card' });
  }
});

app.put('/api/cards/:id', async (req, res) => {
  try {
    const updates = req.body;
    const card = await FlashcardService.updateCard(req.params.id, updates);
    
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    res.json(card);
  } catch (error) {
    console.error('Error updating card:', error);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

app.delete('/api/cards/:id', async (req, res) => {
  try {
    const success = await FlashcardService.deleteCard(req.params.id);
    
    if (!success) {
      return res.status(404).json({ error: 'Card not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting card:', error);
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
