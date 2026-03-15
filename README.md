# AI Assistant (TypeScript)

This project is a simple AI chat application example based on TypeScript that separates the backend (Hono + Google Generative AI) and the frontend (Vite + React).

**Privacy Warning**: Do not commit files containing API keys or sensitive data (e.g., `backend/.env`). Use `backend/.env.example` to demonstrate the required environment variables.

**Features**:

* Lightweight: React frontend with simple UI components.
* Fast backend using Hono and Google Generative AI.

---

## Project Structure

* `backend/` — Hono server, API endpoints.
* `frontend/` — React application (Vite).

## Prerequisites

* Node.js (v18 or newer recommended).
* npm or yarn.
* Google Generative AI (Gemini) API Key — save as `GEMINI_API_KEY`.

---

## Installation & Setup

1. Clone this repository.

### Backend

```bash
cd backend
npm install
cp .env.example .env     # then fill in GEMINI_API_KEY in backend/.env
npm run dev              # development (watch mode)
# or for production: npm run start

```

The backend server runs on `http://localhost:3000` (port configured in `backend/src/index.ts`).

### Frontend

```bash
cd frontend
npm install
npm run dev

```

The frontend uses Vite; by default, it will be available at `http://localhost:5173` (or the port specified by Vite).

---

## API

* **Endpoint**: `POST /api/chat`
* **Content-Type**: `application/json`
* **Request Body Example**:

```json
{ "message": "Hello, please explain..." }

```

* **Success Response Example**:

```json
{ "reply": "... AI response ..." }

```

* **Error Response**: Contains `error` and `message` properties.

---

## Environment Variables

* `GEMINI_API_KEY` — The Google Generative AI API key required by the backend.

Use the `backend/.env.example` file as a template. **Do not commit** the `backend/.env` file containing real values.

---

## Security & Open Source

* Ensure the `backend/.env` file is added to `.gitignore` before pushing to a public remote.
* If the repository accidentally contains an API key in previous commits, consider rotating the key and cleaning the git history (e.g., `git rm --cached backend/.env`, then commit and push). Use caution when removing keys from history—this requires additional steps.

## Contribution

* Fork the repo, create a new branch, make your changes, and open a Pull Request.