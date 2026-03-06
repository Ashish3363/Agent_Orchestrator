import asyncio
import json
from models import TaskState, AgentEvent
from agents.implementations import PlannerAgent, ResearcherAgent, WriterAgent, ReviewerAgent
from typing import AsyncGenerator

class Orchestrator:
    def __init__(self):
        self.agents = {
            "planning": PlannerAgent(),
            "researching": ResearcherAgent(),
            "writing": WriterAgent(),
            "reviewing": ReviewerAgent()
        }

    async def run_pipeline(self, state: TaskState) -> AsyncGenerator[dict, None]:
        """
        Executes the agent pipeline and yields Server-Sent Events (SSE).
        """
        def build_event(agent_id: str, status: str, message: str, data: dict = None):
            event = AgentEvent(agent_id=agent_id, status=status, message=message, data=data)
            return {"data": event.model_dump_json()}

        while state.status != "done":
            current_phase = state.status
            
            # Handle special revision state routing back to writing
            if current_phase == "revising":
                state.status = "writing"
                current_phase = "writing"
                
            agent = self.agents.get(current_phase)
            if not agent:
                yield build_event("System", "error", f"Unknown phase: {current_phase}")
                break

            state.current_agent = agent.agent_id
            yield build_event(agent.agent_id, "starting", f"{agent.agent_id} is starting phase: {current_phase}", {"state": state.model_dump()})

            try:
                # Execute agent logic
                updates = await agent.execute(state)
                
                # Apply updates to state
                for key, value in updates.items():
                    if hasattr(state, key):
                        setattr(state, key, value)

                # Determine next state
                if "status" not in updates:
                    if current_phase == "planning":
                        state.status = "researching"
                    elif current_phase == "researching":
                        state.status = "writing"
                    elif current_phase == "writing":
                        state.status = "reviewing"
                    elif current_phase == "reviewing":
                        state.status = "done"

                yield build_event(agent.agent_id, "completed", f"{agent.agent_id} finished.", {"state": state.model_dump()})

            except Exception as e:
                yield build_event(agent.agent_id, "error", f"Error during execution: {str(e)}")
                state.status = "done" # fail safe
                break
            
            await asyncio.sleep(1) # Small pause between agents for visual effect

        yield build_event("System", "done", "Pipeline execution complete.", {"state": state.model_dump()})
