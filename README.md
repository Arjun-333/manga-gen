# Manga Chapter Generator

A full-stack AI application that generates manga chapters from story ideas. It features a **Preview Mode** for fast iteration and a **Final Mode** for high-quality output, complete with a drag-and-drop chapter editor.

![Manga Generator UI](https://via.placeholder.com/800x400?text=Manga+Generator+UI)

## Features

- **Story to Script**: Converts a simple prompt into a structured manga script with panels and dialogue.
- **Character Generation**: Automatically creates character profiles based on the story.
- **Dual Mode Image Generation**:
  - **Preview Mode**: Fast, lower resolution images for storyboarding.
  - **Final Mode**: High-quality, consistent images for the final chapter.
- **Chapter Editor**: Drag-and-drop interface to arrange panels and edit dialogue bubbles.
- **Premium UI**: Modern, responsive design with smooth animations and dark mode support.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Konva.js.
- **Backend**: FastAPI, Python 3.11.
- **AI Integration**: Mocked for development (ready for integration with OpenAI/Anthropic/Replicate).

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will start at `http://127.0.0.1:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser.

## Deployment

### Frontend (Vercel)

The frontend is configured for Vercel. Simply connect your repository to Vercel and deploy.

- `vercel.json` handles local API rewrites.

### Backend (Railway/Render)

The backend includes a `Procfile` and `runtime.txt` for easy deployment on platforms like Railway or Render.

- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Project Structure

```
manga-gen/
├── backend/            # FastAPI Backend
│   ├── main.py        # API Endpoints
│   ├── models.py      # Pydantic Models
│   └── services.py    # Business Logic (AI Mock)
├── frontend/           # Next.js Frontend
│   ├── src/app/       # App Router Pages
│   ├── src/components/# React Components
│   └── src/lib/       # Utilities
└── README.md          # Documentation
```

## License

MIT
