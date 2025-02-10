# AI-Powered Mapping Application

A full-stack application combining Next.js frontends with Python AI backend and Mapbox integration.

## Project Overview

This project consists of two main components:
- A primary Next.js frontend with Mapbox integration for geographic visualization
- A Python backend running AI models, with its own Next.js admin interface

## Architecture

### Frontend Stack
- **Framework**: Next.js
- **Mapping**: Mapbox GL JS
- **Styling**: Tailwind
- **UI library**: Shadcn

### Backend Stack
- **AI Server**: Python
- **Admin Interface**: Next.js
- **API Framework**: FastAPI
- **Database**: Supabase

## Prerequisites

- Node.js (v18 or higher)
- Python 3.8+
- Mapbox API key
- Gemini API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/maneedasshrestha/CodeYatra.git  
cd CodeYatra
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install admin frontend dependencies:
```bash
cd ../admin-frontend
npm install
```

4. Set up Python environment and install backend dependencies:
```bash
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Configuration

1. Create `.env.local` in the frontend directory:
```
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
API_BASE_URL=your_backend_url
```

2. Create `.env` in the backend directory:
```
MODEL_PATH=path_to_ai_model
DATABASE_URL=your_database_url
```

## Running the Application[//]: # (TODO: change the frontend, admin-frontend and backend directories)

### Frontend
```bash
cd frontend
npm run dev

```
The admin interface will be available at `http://localhost:3000`

### Backend
```bash
cd backend
python main1.py
```
Note: It is recommended that user create  virtual environment inside the backend folder and install all dependencies there.
The API will be available at `http://localhost:8080`

## Project Structure

```
├── frontend/               # Main Next.js frontend
│   ├── components/        # React components
│   ├── pages/            # Next.js pages
│   └── public/           # Static assets

│
└── backend/              # Python backend

```

## API Documentation

### Main Endpoints


- `POST /api/predict`: Run AI model prediction
  Input: image file

- `POST /api/analyze`: Retrieve visualization data
  Input: Csv file
- `POST /api/chat`: Run chatbot
  Input String object



## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## License
MIT
