import { useState, useEffect, useCallback } from 'react';
import type { Deck, Flashcard } from '../types/flashcard';
import { deckApi, cardApi } from '../lib/api';
import { createSlug, findDeckBySlug } from '../utils/urlUtils';

export interface AppState {
  decks: Deck[];
  cards: Flashcard[];
  loading: boolean;
  error: string | null;
}

export function useAppData() {
  const [state, setState] = useState<AppState>({
    decks: [],
    cards: [],
    loading: true,
    error: null,
  });

  // Load initial data
  const loadData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const [decks, cards] = await Promise.all([
        deckApi.getAll(),
        cardApi.getAll(),
      ]);
      
      setState({
        decks,
        cards,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to load data from API:', error);
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: `Failed to connect to server. Please make sure the server is running on port 3001.`,
      }));
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Deck operations
  const createDeck = useCallback(async (name: string, description: string, color: string) => {
    try {
      const newDeck = await deckApi.create(name, description, color);
      setState(prev => ({
        ...prev,
        decks: [...prev.decks, newDeck],
      }));
      return newDeck;
    } catch (error) {
      console.error('Error creating deck:', error);
      throw error;
    }
  }, []);

  const updateDeck = useCallback(async (id: string, updates: Partial<Omit<Deck, 'id' | 'cardCount'>>) => {
    try {
      const updatedDeck = await deckApi.update(id, updates);
      setState(prev => ({
        ...prev,
        decks: prev.decks.map(deck => deck.id === id ? updatedDeck : deck),
      }));
      return updatedDeck;
    } catch (error) {
      console.error('Error updating deck:', error);
      throw error;
    }
  }, []);

  const deleteDeck = useCallback(async (id: string) => {
    try {
      await deckApi.delete(id);
      setState(prev => ({
        ...prev,
        decks: prev.decks.filter(deck => deck.id !== id),
        cards: prev.cards.filter(card => card.deckId !== id),
      }));
    } catch (error) {
      console.error('Error deleting deck:', error);
      throw error;
    }
  }, []);

  // Card operations
  const createCard = useCallback(async (deckId: string, front: string, back: string) => {
    try {
      const newCard = await cardApi.create(deckId, front, back);
      setState(prev => ({
        ...prev,
        cards: [...prev.cards, newCard],
        decks: prev.decks.map(deck => 
          deck.id === deckId 
            ? { ...deck, cardCount: deck.cardCount + 1 }
            : deck
        ),
      }));
      return newCard;
    } catch (error) {
      console.error('Error creating card:', error);
      throw error;
    }
  }, []);

  const updateCard = useCallback(async (id: string, updates: Partial<Omit<Flashcard, 'id' | 'deckId'>>) => {
    try {
      const updatedCard = await cardApi.update(id, updates);
      setState(prev => ({
        ...prev,
        cards: prev.cards.map(card => card.id === id ? updatedCard : card),
      }));
      return updatedCard;
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  }, []);

  const deleteCard = useCallback(async (id: string) => {
    try {
      const cardToDelete = state.cards.find(card => card.id === id);
      await cardApi.delete(id);
      
      setState(prev => ({
        ...prev,
        cards: prev.cards.filter(card => card.id !== id),
        decks: cardToDelete 
          ? prev.decks.map(deck => 
              deck.id === cardToDelete.deckId 
                ? { ...deck, cardCount: Math.max(0, deck.cardCount - 1) }
                : deck
            )
          : prev.decks,
      }));
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  }, [state.cards]);

  // Helper functions for navigation
  const getDeckBySlug = useCallback((slug: string): Deck | null => {
    const deckId = findDeckBySlug(state.decks, slug);
    return state.decks.find(deck => deck.id === deckId) || null;
  }, [state.decks]);

  const navigateToStudy = useCallback((deckId: string) => {
    if (deckId === 'all') {
      window.location.href = '/study/all';
    } else {
      const deck = state.decks.find(d => d.id === deckId);
      if (deck) {
        const slug = createSlug(deck.name);
        window.location.href = `/study/${slug}`;
      }
    }
  }, [state.decks]);

  const navigateToAddCard = useCallback((deckId: string) => {
    const deck = state.decks.find(d => d.id === deckId);
    if (deck) {
      const slug = createSlug(deck.name);
      window.location.href = `/add-card?deck=${slug}`;
    }
  }, [state.decks]);

  return {
    ...state,
    loadData,
    createDeck,
    updateDeck,
    deleteDeck,
    createCard,
    updateCard,
    deleteCard,
    getDeckBySlug,
    navigateToStudy,
    navigateToAddCard,
  };
}
