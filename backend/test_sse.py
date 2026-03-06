import urllib.request
import json
import time

def test_pipeline():
    print("Submitting task...")
    req = urllib.request.Request(
        "http://127.0.0.1:8001/api/tasks", 
        data=json.dumps({"query": "What are microservices?"}).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        task_id = data['task_id']
        print(f"Task created with ID: {task_id}")
        
    print("Listening to SSE stream...")
    req = urllib.request.Request(f"http://127.0.0.1:8001/api/tasks/{task_id}/events")
    with urllib.request.urlopen(req) as p:
        for line in p:
            decoded_line = line.decode('utf-8').strip()
            if decoded_line:
                print(decoded_line.encode("cp1252", errors="ignore").decode("cp1252"))

if __name__ == "__main__":
    test_pipeline()
