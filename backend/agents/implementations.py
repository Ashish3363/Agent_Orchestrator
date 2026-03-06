from typing import Any, Dict
from models import TaskState
from .base import Agent

class PlannerAgent(Agent):
    def __init__(self):
        super().__init__("Planner")

    async def execute(self, state: TaskState) -> Dict[str, Any]:
        await self.simulate_work(2)
        query_topic = state.query.split(" of ")[-1] if " of " in state.query else state.query
        
        # Build more specific subtasks based on the query
        subtasks = [
            f"Define key concepts and history of '{query_topic}'",
            f"Analyze the primary architecture and components of '{query_topic}'",
            f"Gather pros, cons, and industry use-cases for '{query_topic}'",
            f"Synthesize comprehensive conclusion"
        ]
        return {"subtasks": subtasks}

class ResearcherAgent(Agent):
    def __init__(self):
        super().__init__("Researcher")

    async def execute(self, state: TaskState) -> Dict[str, Any]:
        await self.simulate_work(3)
        research_data = {}
        query_topic = state.query.split(" of ")[-1] if " of " in state.query else state.query
        
        for i, task in enumerate(state.subtasks):
            if i == 0:
                content = f"The historical context of **{query_topic}** reveals significant evolution over the past decade. It originated from the need to solve complex scaling and organizational issues. Key concepts involve modularity, isolation of concerns, and robust system design. Early enterprise adopters reported up to a 40% reduction in deployment bottlenecks."
            elif i == 1:
                content = f"Architecturally, systems leveraging **{query_topic}** rely on distributed data management and lightweight communication protocols (like HTTP/REST, GraphQL, or gRPC). Components are designed to be independently deployable, which inherently increases organizational agility but requires sophisticated orchestration platforms (e.g., Kubernetes) and CI/CD pipelines."
            elif i == 2:
                content = f"### Pros:\n- **Scalability**: Components scale independently based on demand.\n- **Flexibility**: Technology agnostic boundaries allow polyglot programming.\n- **Resilience**: Fault isolation prevents cascading failures.\n\n### Cons:\n- **Complexity**: Monitoring, tracing, and debugging distributed systems is significantly harder.\n- **Overhead**: Network latency between components and data consistency challenges.\n\n*Use-cases*: Large e-commerce platforms, hyper-scale SaaS applications, and high-traffic streaming services."
            else:
                content = f"In conclusion, adopting strategies around **{query_topic}** is a strategic architectural decision that trades operational complexity for organizational scaling and agility. It is not a silver bullet for all projects, but highly effective for massive enterprise environments anticipating rapid growth."
            
            research_data[f"task_{i}"] = content
            
        return {"research_data": research_data}

class WriterAgent(Agent):
    def __init__(self):
        super().__init__("Writer")

    async def execute(self, state: TaskState) -> Dict[str, Any]:
        await self.simulate_work(2)
        
        # Combine research into a draft report
        combined_research = "\n\n".join([f"## {list(state.subtasks)[int(k.split('_')[1])]}\n{v}" for k, v in state.research_data.items() if state.subtasks])

        draft = f"# Comprehensive Analysis Report\n**Context:** {state.query}\n\n**Executive Summary**\nThis report provides an in-depth technical analysis and synthesis of the requested topic, evaluating its architecture, benefits, and challenges based on current industry standards.\n\n{combined_research}"
        return {"draft": draft}

class ReviewerAgent(Agent):
    def __init__(self):
        super().__init__("Reviewer")
        self.revisions_requested = 0

    async def execute(self, state: TaskState) -> Dict[str, Any]:
        await self.simulate_work(2)
        
        # Simulate a 1-time revision loop if it hasn't happened yet
        if self.revisions_requested == 0:
            self.revisions_requested += 1
            feedback = "The draft is highly detailed, but the Executive Summary needs to be bolder, and the formatting could be polished. Please revise."
            return {"status": "revising", "feedback": feedback, "final_report": None}
        else:
            # Second time around, approve it
            final_report = state.draft.replace("**Executive Summary**", "### ✨ Executive Summary (Peer-Reviewed) ✨\n*Note: This report has been thoroughly peer-reviewed and approved for technical accuracy.*")
            return {"status": "done", "final_report": final_report, "feedback": "All revisions incorporated perfectly. Approved for final release."}
