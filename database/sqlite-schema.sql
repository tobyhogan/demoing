-- SQLite schema for flashcards app

-- Create decks table
CREATE TABLE IF NOT EXISTS decks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT NOT NULL,
    card_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
    id TEXT PRIMARY KEY,
    deck_id TEXT NOT NULL,
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    difficulty INTEGER DEFAULT 0,
    next_review DATETIME DEFAULT CURRENT_TIMESTAMP,
    interval_days INTEGER DEFAULT 0,
    repetitions INTEGER DEFAULT 0,
    ease_factor REAL DEFAULT 2.5,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_flashcards_deck_id ON flashcards(deck_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_next_review ON flashcards(next_review);

-- Create trigger to update deck card count
CREATE TRIGGER IF NOT EXISTS update_deck_card_count_insert
    AFTER INSERT ON flashcards
BEGIN
    UPDATE decks 
    SET card_count = card_count + 1 
    WHERE id = NEW.deck_id;
END;

CREATE TRIGGER IF NOT EXISTS update_deck_card_count_delete
    AFTER DELETE ON flashcards
BEGIN
    UPDATE decks 
    SET card_count = card_count - 1 
    WHERE id = OLD.deck_id;
END;

-- Create trigger to update timestamps
CREATE TRIGGER IF NOT EXISTS update_decks_timestamp
    AFTER UPDATE ON decks
BEGIN
    UPDATE decks 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_flashcards_timestamp
    AFTER UPDATE ON flashcards
BEGIN
    UPDATE flashcards 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.id;
END;
