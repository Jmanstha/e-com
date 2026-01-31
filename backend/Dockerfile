# syntax=docker/dockerfile:1
# This line tells Docker to use the latest version of the Dockerfile syntax.

# Define the Python version as a variable so it's easy to update in one place.
ARG PYTHON_VERSION=3.12.3

# Use a "slim" version of Python. It's much smaller than the full version,
# containing only what’s needed to run Python—saving disk space and download time.
FROM python:${PYTHON_VERSION}-slim as base

# Optimization: Stop Python from generating .pyc files (compiled bytecode).
# In a container, we want to keep the file system clean.
ENV PYTHONDONTWRITEBYTECODE=1

# Optimization: Ensure Python output (like print statements and errors) 
# is sent straight to the terminal/logs instead of being buffered. 
# This helps you see logs in real-time.
ENV PYTHONUNBUFFERED=1

# Set the "home base" folder inside the container. 
# Every command after this happens inside the /app directory.
WORKDIR /src

# SECURITY: By default, Docker runs as 'root' (admin). This is dangerous.
# This block creates a 'dummy' user named 'appuser' with no privileges
# so that if your app is hacked, the attacker doesn't have root access.
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

# SPEED: This part installs your libraries.
# It uses a 'mount' to cache your pip downloads. If you add one new library, 
# Docker won't re-download everything from scratch; it pulls from the cache.
# It also uses a 'bind' to read requirements.txt without permanently 
# copying it into an image layer yet.
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt

# SECURITY: Switch away from 'root' to the limited user we created earlier.
USER appuser

# Copy all the files from your local 'backend' folder into the container '/app' folder.
# This happens AFTER 'pip install' so that if you change your code, 
# Docker doesn't have to re-install your libraries (caching!).
COPY . .

# Documentation: Tells the person running the container that the app listens on port 8000.
EXPOSE 8000

# THE FINALE: The command that actually starts your server.
# --host 0.0.0.0 is REQUIRED to make the app reachable from outside the container.
# Make sure 'main:app' matches your filename (main.py) and FastAPI variable (app).
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
