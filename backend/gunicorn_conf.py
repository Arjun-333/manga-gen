import os

# Gunicorn configuration logic
bind = f'0.0.0.0:{os.getenv("PORT", "8000")}'
workers = 1  # Single worker for free tier stability
worker_class = 'uvicorn.workers.UvicornWorker'
timeout = 120  # 2 minute timeout (increased from default 30s)
keepalive = 5
threads = 2
max_requests = 1000
max_requests_jitter = 50
preload_app = False  # Disable preload to save memory on boot
