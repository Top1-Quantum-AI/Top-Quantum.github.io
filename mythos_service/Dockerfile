# OpenMythos microservice – Python 3.11 slim image
FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for better layer caching
COPY mythos_service/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the open_mythos package and the service entrypoint
COPY open_mythos/ ./open_mythos/
COPY mythos_service/app.py ./app.py

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
