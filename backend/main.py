from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
import uuid
import asyncio

from models import TaskRequest, TaskState
from orchestrator import Orchestrator

app = FastAPI(title="Multi-Agent Task Orchestrator")

# Enable CORS for frontend Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In dev, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store
tasks_db = {}
orchestrator = Orchestrator()

@app.post("/api/tasks")
async def create_task(request: TaskRequest):
    task_id = str(uuid.uuid4())
    state = TaskState(task_id=task_id, query=request.query, status="planning")
    tasks_db[task_id] = state
    return {"task_id": task_id, "status": "planning"}

@app.get("/api/tasks/{task_id}")
async def get_task(task_id: str):
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks_db[task_id]

@app.get("/api/tasks/{task_id}/events")
async def get_task_events(task_id: str):
    if task_id not in tasks_db:
        raise HTTPException(status_code=404, detail="Task not found")
        
    state = tasks_db[task_id]
    
    # SSE Stream generator wrapper
    async def event_generator():
        # Trigger orchestration
        async for event in orchestrator.run_pipeline(state):
            yield event
            
    return EventSourceResponse(event_generator())

# To run: uvicorn main:app --reload --port 8000
