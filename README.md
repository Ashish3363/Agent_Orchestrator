# Agent_Orchestrator

A lightweight platform where multiple AI agents collaborate to complete a complex task. This project implements a backend orchestration system using FastAPI and a modern frontend using Next.js and Tailwind CSS.

## Features
- **Backend Orchestrator**: A FastAPI service that manages the execution flow of 4 distinct agents (Planner, Researcher, Writer, Reviewer).
- **Simulated Agents**: Agents simulate processing time and return structured data to update the global task state.
- **Revision Loop**: The Reviewer agent can trigger a revision loop, sending the draft back to the Writer agent for improvements.
- **Real-Time Streaming**: The backend uses Server-Sent Events (SSE) to stream execution logs and state updates to the client in real time.
- **Premium Frontend UI**: A dynamic, glassmorphic React/Next.js dashboard that visualizes the pipeline's progress, displays a live terminal activity log, and renders the final markdown report.

## Prerequisites
- Node.js (v18+)
- Python (3.10+)

## Setup Instructions

### 1. Backend

Open a terminal and navigate to the `backend` directory:
```bash
cd backend
```

Create a virtual environment and activate it:
```bash
# Windows
python -m venv venv
.\venv\Scripts\Activate.ps1

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

Install the dependencies:
```bash
pip install fastapi uvicorn pydantic sse-starlette python-dotenv
```

Start the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```
The backend will be running at `http://127.0.0.1:8000`.

### 2. Frontend

Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
```

Install Node dependencies:
```bash
npm install
```

Start the Next.js development server:
```bash
npm run dev
```

The frontend will be running at `http://localhost:3000`.

### 3. Usage

1. Open `http://localhost:3000` in your web browser.
2. Enter a complex task query (e.g., "Research the pros and cons of microservices vs. monoliths and produce a summary report.")
3. Click **Launch**.
4. Watch the real-time execution! The progress visualizer will show which agent is active, the terminal will print live SSE events, and the system will simulate a revision loop before presenting the Final Output.


Demonstration video --> https://drive.google.com/file/d/1xIGShLnCAypnIVv6hpXYJFtTXDvjD7kV/view?usp=sharing
