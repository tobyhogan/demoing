import { db } from '../lib/sqlite';
import type { Flashcard } from '../types/flashcard';

interface FlashcardRow {
  id: string;
  deck_id: string;
  front: string;
  back: string;
  difficulty: number;
  next_review: string;
  interval_days: number;
  repetitions: number;
  ease_factor: number;
  created_at: string;
  updated_at: string;
}

export class FlashcardService {
  static async getAllCards(): Promise<Flashcard[]> {
    const query = `
      SELECT 
        id,
        deck_id,
        front,
        back,
        difficulty,
        next_review,
        interval_days,
        repetitions,
        ease_factor,
        created_at,
        updated_at
      FROM flashcards 
      ORDER BY created_at DESC
    `;
    
    const rows = await db.all<FlashcardRow>(query);
    return rows.map(this.mapRowToFlashcard);
  }

  static async getCardsByDeckId(deckId: string): Promise<Flashcard[]> {
    const query = `
      SELECT 
        id,
        deck_id,
        front,
        back,
        difficulty,
        next_review,
        interval_days,
        repetitions,
        ease_factor,
        created_at,
        updated_at
      FROM flashcards 
      WHERE deck_id = ?
      ORDER BY created_at DESC
    `;
    
    const rows = await db.all<FlashcardRow>(query, [deckId]);
    return rows.map(this.mapRowToFlashcard);
  }

  static async getCardsDueForReview(): Promise<Flashcard[]> {
    const query = `
      SELECT 
        id,
        deck_id,
        front,
        back,
        difficulty,
        next_review,
        interval_days,
        repetitions,
        ease_factor,
        created_at,
        updated_at
      FROM flashcards 
      WHERE datetime(next_review) <= datetime('now')
      ORDER BY next_review ASC
    `;
    
    const rows = await db.all<FlashcardRow>(query);
    return rows.map(this.mapRowToFlashcard);
  }

  static async getCardsDueForReviewByDeck(deckId: string): Promise<Flashcard[]> {
    const query = `
      SELECT 
        id,
        deck_id,
        front,
        back,
        difficulty,
        next_review,
        interval_days,
        repetitions,
        ease_factor,
        created_at,
        updated_at
      FROM flashcards 
      WHERE deck_id = ? AND datetime(next_review) <= datetime('now')
      ORDER BY next_review ASC
    `;
    
    const rows = await db.all<FlashcardRow>(query, [deckId]);
    return rows.map(this.mapRowToFlashcard);
  }

  static async getCardById(id: string): Promise<Flashcard | null> {
    const query = `
      SELECT 
        id,
        deck_id,
        front,
        back,
        difficulty,
        next_review,
        interval_days,
        repetitions,
        ease_factor,
        created_at,
        updated_at
      FROM flashcards 
      WHERE id = ?
    `;
    
    const row = await db.get<FlashcardRow>(query, [id]);
    if (!row) return null;
    
    return this.mapRowToFlashcard(row);
  }

  static async createCard(deckId: string, front: string, back: string): Promise<Flashcard> {
    const id = Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    
    const query = `
      INSERT INTO flashcards (id, deck_id, front, back)
      VALUES (?, ?, ?, ?)
    `;
    
    await db.run(query, [id, deckId, front, back]);
    
    const card = await this.getCardById(id);
    if (!card) throw new Error('Failed to create card');
    
    return card;
  }

  static async updateCard(id: string, updates: Partial<Omit<Flashcard, 'id' | 'deckId'>>): Promise<Flashcard | null> {
    const fields = [];
    const values = [];

    if (updates.front !== undefined) {
      fields.push('front = ?');
      values.push(updates.front);
    }
    if (updates.back !== undefined) {
      fields.push('back = ?');
      values.push(updates.back);
    }
    if (updates.difficulty !== undefined) {
      fields.push('difficulty = ?');
      values.push(updates.difficulty);
    }
    if (updates.nextReview !== undefined) {
      fields.push('next_review = ?');
      values.push(updates.nextReview.toISOString());
    }
    if (updates.interval !== undefined) {
      fields.push('interval_days = ?');
      values.push(updates.interval);
    }
    if (updates.repetitions !== undefined) {
      fields.push('repetitions = ?');
      values.push(updates.repetitions);
    }
    if (updates.easeFactor !== undefined) {
      fields.push('ease_factor = ?');
      values.push(updates.easeFactor);
    }

    if (fields.length === 0) {
      return this.getCardById(id);
    }

    values.push(id);
    const query = `
      UPDATE flashcards 
      SET ${fields.join(', ')}
      WHERE id = ?
    `;

    const result = await db.run(query, values);
    if (result.changes === 0) return null;
    
    return this.getCardById(id);
  }

  static async deleteCard(id: string): Promise<boolean> {
    const query = 'DELETE FROM flashcards WHERE id = ?';
    const result = await db.run(query, [id]);
    return result.changes > 0;
  }

  private static mapRowToFlashcard(row: FlashcardRow): Flashcard {
    return {
      id: row.id,
      deckId: row.deck_id,
      front: row.front,
      back: row.back,
      difficulty: row.difficulty,
      nextReview: new Date(row.next_review),
      interval: row.interval_days,
      repetitions: row.repetitions,
      easeFactor: row.ease_factor,
    };
  }
}
