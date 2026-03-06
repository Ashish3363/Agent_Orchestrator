from pydantic import BaseModel
from typing import List, Optional, Any

class TaskRequest(BaseModel):
    query: str

class AgentEvent(BaseModel):
    agent_id: str
    status: str
    message: str
    data: Optional[Any] = None

class TaskState(BaseModel):
    task_id: str
    query: str
    status: str # "planning", "researching", "writing", "reviewing", "done", "revising"
    current_agent: Optional[str] = None
    subtasks: List[str] = []
    research_data: dict = {}
    draft: Optional[str] = None
    feedback: Optional[str] = None
    final_report: Optional[str] = None
