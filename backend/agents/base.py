from typing import Any, Dict
from models import TaskState
import asyncio

class Agent:
    def __init__(self, agent_id: str):
        self.agent_id = agent_id

    async def execute(self, state: TaskState) -> Dict[str, Any]:
        """
        Executes the agent's logic.
        Should return a dictionary of updates to be applied to the TaskState.
        """
        raise NotImplementedError("Subclasses must implement execute")

    async def simulate_work(self, seconds: int = 2):
        """Helper to simulate processing time."""
        await asyncio.sleep(seconds)
