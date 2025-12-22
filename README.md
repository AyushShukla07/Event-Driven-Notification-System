# Event-Driven Notification System

A scalable backend system to process and deliver notifications
(email, SMS, push) using an event-driven architecture.

## Features
- JWT-secured event ingestion API
- Redis-based rate limiting
- Idempotent event handling
- Asynchronous processing with BullMQ
- Retry with exponential backoff
- Dead Letter Queue (DLQ)
- Manual retry via admin API
- Distributed tracing using correlationId
- Metrics & health endpoints
- Graceful shutdown

## Tech Stack
- Node.js, Express
- Redis, BullMQ
- MongoDB
- Docker

## Key Endpoints
- POST /api/events
- GET /api/metrics
- GET /api/health
- POST /api/admin/retry
- GET /api/debug/trace/:correlationId
