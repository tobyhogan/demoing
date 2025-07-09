-- Insert sample decks
INSERT OR REPLACE INTO decks (id, name, description, color, card_count) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'General Knowledge', 'Basic facts and trivia', 'bg-blue-500', 4),
('550e8400-e29b-41d4-a716-446655440001', 'Science', 'Scientific facts and concepts', 'bg-green-500', 2),
('550e8400-e29b-41d4-a716-446655440002', 'Literature', 'Books, authors, and literary works', 'bg-purple-500', 1),
('550e8400-e29b-41d4-a716-446655440003', 'History', 'Historical events and dates', 'bg-red-500', 1);

-- Insert sample flashcards
INSERT OR REPLACE INTO flashcards (id, deck_id, front, back, difficulty, next_review, interval_days, repetitions, ease_factor) VALUES
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'What is the capital of France?', 'Paris', 0, CURRENT_TIMESTAMP, 0, 0, 2.5),
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'What is 2 + 2?', '4', 0, CURRENT_TIMESTAMP, 0, 0, 2.5),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Who wrote Romeo and Juliet?', 'William Shakespeare', 0, CURRENT_TIMESTAMP, 0, 0, 2.5),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'What is the largest planet in our solar system?', 'Jupiter', 0, CURRENT_TIMESTAMP, 0, 0, 2.5),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'What year did World War II end?', '1945', 0, CURRENT_TIMESTAMP, 0, 0, 2.5),
('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'What is the chemical symbol for gold?', 'Au', 0, CURRENT_TIMESTAMP, 0, 0, 2.5),
('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'How many sides does a hexagon have?', '6', 0, CURRENT_TIMESTAMP, 0, 0, 2.5),
('660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'What is the speed of light in vacuum?', '299,792,458 meters per second', 0, CURRENT_TIMESTAMP, 0, 0, 2.5);
