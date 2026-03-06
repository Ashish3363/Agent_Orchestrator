# Design Document: Multi-Agent Task Orchestration System

## Architectural Decisions & Rationale

**1. FastAPI for Backend:**
- **Why:** FastAPI is built on Starlette and intrinsically supports asynchronous operations, making it extremely straightforward to handle long-running agent workflows and stream data back to the client via Server-Sent Events (SSE) without blocking the main event loop.
- **Why SSE over WebSockets:** WebSockets allow full bi-directional communication, but for this specific use case, the pattern is overwhelmingly uni-directional after the initial task submission: the server pushes status updates to the client. SSE (`sse-starlette`) is simpler to implement, works natively over standard HTTP, easily passes through standard load balancers, and seamlessly supports auto-reconnection on the client side via the browser's native `EventSource` API.

**2. State Machine Orchestrator:**
- The orchestration logic is modeled as a state machine where the current status (`planning`, `researching`, `writing`, `reviewing`, `revising`, `done`) determines the active agent. 
- A central `TaskState` object is passed sequentially. Each agent receives the state, performs its specific logic, and returns a dictionary of state updates, adhering to the pure `Agent` base protocol. The Orchestrator applies these updates.
- This decoupled design makes it trivial to add new agents, re-order the pipeline, or introduce complex branching logic without modifying the agents themselves.

**3. Next.js (App Router) + Tailwind CSS:**
- Next.js provides a robust React framework. Tailwind CSS was utilized to rapidly build a premium, glassmorphic user interface.
- Native React Hooks (`useEffect` and `useState`) elegantly handle the `EventSource` connection, updating the DOM dynamically as SSE events stream in, providing the user with a real-time activity log and progress stepper without manual polling.

## Trade-Offs Considered

**Polling vs WebSockets vs SSE:**
- *Polling* is easy but inefficient and leads to delayed UX updates.
- *WebSockets* provide real-time bi-directional messaging, but add complexity (ping/pong logic, stateful connections, harder to load balance).
- *SSE* hits the sweet spot: real-time, low-overhead, one-way event streaming over HTTP.

**Sync vs Async execution:**
- Handled via Python's `async/await` and `asyncio`. Running agents synchronously would block the FastAPI worker, preventing other users from interacting with the app or querying task status. Asynchronous execution guarantees high concurrency for the orchestrator.

**In-Memory Storage vs Database:**
- To keep the system lightweight and portable for this assignment, state is tracked via a global Python dictionary `tasks_db`. In a real-world scenario, this would be replaced by Redis (for fast transient state tracking + pub/sub) and PostgreSQL (for permanent log storage).

## Future Improvements (With More Time)

1. **Database Persistence:** Integrate PostgreSQL and SQLAlchemy to persist tasks so they survive server restarts.
2. **Real LLM Integration:** Connect the agents to OpenAI or Anthropic APIs utilizing frameworks like LangChain or AutoGen, allowing true generative results based on user input.
3. **Agent Graph Engine:** Instead of a hardcoded linear state machine, implement a Directed Acyclic Graph (DAG) for the orchestrator (e.g., using `LangGraph`), allowing agents to spawn dynamic parallel sub-tasks dynamically.
4. **Celery / Redis Worker Queue:** Offload long-running agent tasks to a background distributed task queue (like Celery) rather than running them directly within the FastAPI asyncio event loop.
5. **Cancel/Pause Functionality:** Allow the user to inject a cancellation token over the API to gracefully halt a runaway agent pipeline.

## Assumptions Made

- The agents' actual cognitive work is abstracted away and simulated using hardcoded templates and `asyncio.sleep()`.
- The user is running the application on a local development environment. Security aspects (Auth, CORS strictness, Rate Limiting) have been minimized for development ease.
- The revision feedback loop is modeled logically but simplified (triggering exactly once via a counter on the Reviewer agent) to demonstrate the capability without creating infinite loops.
