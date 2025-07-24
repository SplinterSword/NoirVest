FROM python:3.13-alpine AS builder

# Install build dependencies only in builder
RUN apk add --no-cache \
    build-base \
    libffi-dev \
    musl-dev \
    gcc \
    python3-dev \
    linux-headers

WORKDIR /app

COPY requirements.txt .

# Install dependencies in a virtual environment
RUN python -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir --upgrade pip && \
    /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

# ---- Final image ----
FROM python:3.13-alpine

# Install runtime dependencies only (no build tools)
RUN apk add --no-cache libffi

# Create user
RUN adduser -D myuser

WORKDIR /app

COPY --from=builder /opt/venv /opt/venv
COPY . .

# Set permissions
RUN chown -R myuser:myuser /app

USER myuser

ENV PATH="/opt/venv/bin:$PATH"

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
