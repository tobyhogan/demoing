import { db } from '../lib/sqlite';
import type { Deck } from '../types/flashcard';

interface DeckRow {
  id: string;
  name: string;
  description: string;
  color: string;
  card_count: number;
  created_at: string;
  updated_at: string;
}

export class DeckService {
  static async getAllDecks(): Promise<Deck[]> {
    const query = `
      SELECT 
        id,
        name,
        description,
        color,
        card_count,
        created_at,
        updated_at
      FROM decks 
      ORDER BY name ASC
    `;
    
    const rows = await db.all<DeckRow>(query);
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      color: row.color,
      cardCount: row.card_count,
    }));
  }

  static async getDeckById(id: string): Promise<Deck | null> {
    const query = `
      SELECT 
        id,
        name,
        description,
        color,
        card_count,
        created_at,
        updated_at
      FROM decks 
      WHERE id = ?
    `;
    
    const row = await db.get<DeckRow>(query, [id]);
    if (!row) return null;
    
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      color: row.color,
      cardCount: row.card_count,
    };
  }

  static async createDeck(name: string, description: string, color: string): Promise<Deck> {
    const id = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    
    const query = `
      INSERT INTO decks (id, name, description, color)
      VALUES (?, ?, ?, ?)
    `;
    
    await db.run(query, [id, name, description, color]);
    
    return {
      id,
      name,
      description,
      color,
      cardCount: 0,
    };
  }

  static async updateDeck(id: string, updates: Partial<Omit<Deck, 'id' | 'cardCount'>>): Promise<Deck | null> {
    const fields = [];
    const values = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.color !== undefined) {
      fields.push('color = ?');
      values.push(updates.color);
    }

    if (fields.length === 0) {
      return this.getDeckById(id);
    }

    values.push(id);
    const query = `
      UPDATE decks 
      SET ${fields.join(', ')}
      WHERE id = ?
    `;

    const result = await db.run(query, values);
    if (result.changes === 0) return null;
    
    return this.getDeckById(id);
  }

  static async deleteDeck(id: string): Promise<boolean> {
    const query = 'DELETE FROM decks WHERE id = ?';
    const result = await db.run(query, [id]);
    return result.changes > 0;
  }
}
