# Flashcards App Setup Instructions

## Prerequisites

1. **Node.js** (v18 or higher)
2. **pnpm** (or npm/yarn)
3. **PostgreSQL** (v12 or higher)

## Database Setup

1. **Install PostgreSQL** if you haven't already:
   - Windows: Download from https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql postgresql-contrib`

2. **Create the database**:
   ```sql
   CREATE DATABASE flashcards;
   ```

3. **Update environment variables** (if needed):
   Edit `.env` file and update the database connection details:
   ```
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=flashcards
   DB_PASSWORD=your_password
   DB_PORT=5432
   ```

4. **Setup database schema and seed data**:
   ```bash
   pnpm run db:setup
   ```

## Running the Application

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start the backend server**:
   ```bash
   pnpm run server:dev
   ```
   The API server will start on http://localhost:3001

3. **Start the frontend** (in a new terminal):
   ```bash
   pnpm run dev
   ```
   The React app will start on http://localhost:5173

## Project Structure

- `src/server/server.ts` - Express API server
- `src/lib/api.ts` - Frontend API client
- `src/hooks/useAppData.ts` - React hook for data management
- `src/services/` - Database service layer
- `database/` - SQL schema and seed files

## API Endpoints

- **GET** `/api/decks` - Get all decks
- **POST** `/api/decks` - Create a new deck
- **GET** `/api/cards` - Get all cards (supports query params: `deckId`, `dueOnly`)
- **POST** `/api/cards` - Create a new card
- **PUT** `/api/cards/:id` - Update a card (used for spaced repetition)

## Features

- ✅ Create and manage decks
- ✅ Add flashcards to decks
- ✅ Study with spaced repetition algorithm
- ✅ PostgreSQL persistence
- ✅ REST API with Express
- ✅ React frontend with TypeScript
- ✅ URL-based navigation

## Troubleshooting

- Make sure PostgreSQL is running
- Check that the database connection settings in `.env` are correct
- Ensure both the API server and React dev server are running
- Check browser console and server logs for any errors
