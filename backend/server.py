"""
SAI TECH Backend - Express Proxy Wrapper
"""
import subprocess
import os
import time
import asyncio
from fastapi import FastAPI, Request, Response
from starlette.middleware.cors import CORSMiddleware
import httpx

app = FastAPI(title="SAI TECH API Proxy")

EXPRESS_URL = "http://127.0.0.1:3001"
EXPRESS_DIR = "/app/backend-express"
express_process = None

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["https://saitech-frontend.vercel.app", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

def start_express():
    global express_process
    subprocess.run(["pkill", "-f", "node server.js"], capture_output=True)
    time.sleep(1)
    print("Generating Prisma client...")
    subprocess.run(["npx", "prisma", "generate"], cwd=EXPRESS_DIR, capture_output=True)
    env = os.environ.copy()
    env["PORT"] = "3001"
    env["NODE_ENV"] = "development"
    log_file = open("/var/log/supervisor/express.log", "a")
    express_process = subprocess.Popen(
        ["node", "server.js"],
        cwd=EXPRESS_DIR,
        env=env,
        stdout=log_file,
        stderr=log_file
    )
    print(f"Express backend started on port 3001 (PID: {express_process.pid})")
    for i in range(10):
        time.sleep(1)
        try:
            import urllib.request
            urllib.request.urlopen(f"{EXPRESS_URL}/api/health", timeout=2)
            print("Express backend is ready!")
            return express_process
        except:
            print(f"Waiting for Express to start... ({i+1}/10)")
    return express_process

@app.on_event("startup")
async def startup_event():
    start_express()

@app.on_event("shutdown")
async def shutdown_event():
    global express_process
    if express_process:
        express_process.terminate()
        try:
            express_process.wait(timeout=5)
        except:
            express_process.kill()

# ✅ CORS Headers manually add karo har response mein
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "https://saitech-frontend.vercel.app",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def proxy_api(request: Request, path: str):
    
    # ✅ OPTIONS preflight request handle karo
    if request.method == "OPTIONS":
        return Response(status_code=200, headers=CORS_HEADERS)

    async with httpx.AsyncClient(timeout=30.0) as client:
        url = f"{EXPRESS_URL}/api/{path}"
        body = await request.body()
        headers = {k: v for k, v in request.headers.items() if k.lower() != 'host'}

        try:
            response = await client.request(
                method=request.method,
                url=url,
                content=body if body else None,
                headers=headers,
                params=dict(request.query_params),
            )
            excluded_headers = {'content-encoding', 'content-length', 'transfer-encoding', 'connection'}
            response_headers = {
                k: v for k, v in response.headers.items()
                if k.lower() not in excluded_headers
            }
            # ✅ CORS headers merge karo
            response_headers.update(CORS_HEADERS)

            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=response_headers,
                media_type=response.headers.get("content-type")
            )
        except httpx.ConnectError:
            return Response(
                content='{"error": "Backend service unavailable"}',
                status_code=503,
                headers=CORS_HEADERS,
                media_type="application/json"
            )
        except Exception as e:
            return Response(
                content=f'{{"error": "Proxy error: {str(e)}"}}',
                status_code=500,
                headers=CORS_HEADERS,
                media_type="application/json"
            )

@app.api_route("/uploads/{path:path}", methods=["GET"])
async def proxy_uploads(request: Request, path: str):
    async with httpx.AsyncClient(timeout=30.0) as client:
        url = f"{EXPRESS_URL}/uploads/{path}"
        try:
            response = await client.get(url)
            return Response(
                content=response.content,
                status_code=response.status_code,
                media_type=response.headers.get("content-type")
            )
        except:
            return Response(status_code=404)
