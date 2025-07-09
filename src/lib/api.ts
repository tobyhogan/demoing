import type { Deck, Flashcard } from '../types/flashcard';

const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for making API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  
  // Handle 204 No Content responses
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}

// Deck API functions
export const deckApi = {
  async getAll(): Promise<Deck[]> {
    return apiRequest<Deck[]>('/decks');
  },

  async getById(id: string): Promise<Deck> {
    return apiRequest<Deck>(`/decks/${id}`);
  },

  async create(name: string, description: string, color: string): Promise<Deck> {
    return apiRequest<Deck>('/decks', {
      method: 'POST',
      body: JSON.stringify({ name, description, color }),
    });
  },

  async update(id: string, updates: Partial<Omit<Deck, 'id' | 'cardCount'>>): Promise<Deck> {
    return apiRequest<Deck>(`/decks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest<void>(`/decks/${id}`, {
      method: 'DELETE',
    });
  },
};

// Flashcard API functions
export const cardApi = {
  async getAll(): Promise<Flashcard[]> {
    return apiRequest<Flashcard[]>('/cards');
  },

  async getByDeckId(deckId: string): Promise<Flashcard[]> {
    return apiRequest<Flashcard[]>(`/cards?deckId=${deckId}`);
  },

  async getDueForReview(): Promise<Flashcard[]> {
    return apiRequest<Flashcard[]>('/cards?dueOnly=true');
  },

  async getDueForReviewByDeck(deckId: string): Promise<Flashcard[]> {
    return apiRequest<Flashcard[]>(`/cards?deckId=${deckId}&dueOnly=true`);
  },

  async getById(id: string): Promise<Flashcard> {
    return apiRequest<Flashcard>(`/cards/${id}`);
  },

  async create(deckId: string, front: string, back: string): Promise<Flashcard> {
    return apiRequest<Flashcard>('/cards', {
      method: 'POST',
      body: JSON.stringify({ deckId, front, back }),
    });
  },

  async update(id: string, updates: Partial<Omit<Flashcard, 'id' | 'deckId'>>): Promise<Flashcard> {
    return apiRequest<Flashcard>(`/cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest<void>(`/cards/${id}`, {
      method: 'DELETE',
    });
  },
};

// Health check
export const healthApi = {
  async check(): Promise<{ status: string; timestamp: string }> {
    return apiRequest<{ status: string; timestamp: string }>('/health');
  },
};
