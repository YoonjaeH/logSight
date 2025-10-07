# 🚀 LogSight: Self-Hostable Observability Platform

A lightweight, high-throughput observability platform for developers to ingest, analyze, and visualize custom application events and errors in real-time.

## ✨ Overview

In a world of complex applications, understanding what's happening in real-time is crucial. Commercial observability tools like Datadog or Sentry are powerful but can be expensive and complex for personal projects or small-to-medium applications.

LogSight is a **self-hostable alternative** designed to provide developers with core observability features without the overhead. It provides:

- High-throughput ingestion endpoint
- Resilient data processing pipeline  
- Clean, real-time dashboard for monitoring application health
- User behavior tracking and instant error debugging

This project showcases a modern, scalable microservices architecture with a responsive frontend.

## 🏛️ System Architecture

LogSight is built on a distributed, asynchronous architecture to handle high volumes of incoming data without losing a single event.

```
[Client App] → [Ingestion API] → [RabbitMQ] → [Processing Worker] → [TimescaleDB]
                     ↓                                ↓
              [Backend API] ← [Dashboard] ← [Authentication]
                     ↓
              [Alerting Service]
```

### Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Client Snippet** | JavaScript | Lightweight event capture from applications |
| **Ingestion Endpoint** | Go | High-performance event reception and queuing |
| **Message Queue** | RabbitMQ | Durable buffer for decoupled processing |
| **Processing Worker** | Python | Event consumption, cleaning, and aggregation |
| **Database** | TimescaleDB | Time-series optimized PostgreSQL storage |
| **Backend API** | Python/FastAPI | Data serving and business logic |
| **Frontend** | Next.js | Responsive real-time dashboard |
| **Authentication** | Clerk | Secure user management |
| **Alerting Service** | Python/Celery Beat | Scheduled alert monitoring and notifications |

## 🌟 Features

- **High-Throughput Data Ingestion**: Go-based endpoint handling thousands of requests per second
- **Real-Time Analytics Dashboard**: Responsive Next.js frontend with live data visualization
- **Asynchronous Processing**: RabbitMQ ensures zero data loss during traffic spikes
- **Time-Series Optimized Storage**: TimescaleDB hypertables for lightning-fast queries
- **Secure Authentication**: Complete user management with Clerk integration
- **Protected API Endpoints**: JWT-secured backend routes
- **Customizable Alerting**: Celery Beat service with Slack notifications
- **Fully Containerized**: Docker Compose orchestration for easy deployment

## 💻 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js, Recharts, TailwindCSS |
| **Backend** | Python (FastAPI), Go (Gin) |
| **Databases** | TimescaleDB (PostgreSQL), Redis |
| **Infrastructure** | Docker, RabbitMQ, Celery |
| **Authentication** | Clerk |

## 🚀 Getting Started

This project is fully containerized. You only need Docker and Docker Compose installed.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/logSight.git
cd logSight
```

### 2. Configure Environment Variables

Set up your API keys from Clerk and Slack Webhook URL in `docker-compose.yml`:

```yaml
# In the 'api' service environment:
- CLERK_ISSUER_URL=https://your-project.clerk.accounts.dev

# In the 'frontend' service environment:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: pk_test_...
CLERK_SECRET_KEY: sk_test_...
```

### 3. Build and Run the Application

```bash
docker compose up --build -d
```

> **Note**: Use `--build` flag only on first run or when code changes. The `-d` flag runs containers in detached mode.

### 4. Set Up the Database

On first run, create necessary tables by connecting to the database (`localhost:5432`) and running the SQL scripts:

```sql
-- Create your events and alerts tables here
-- (Add schema.sql file in project root)
```

### 5. Access the Application

- **Frontend Dashboard**: http://localhost:3000
- **API Documentation**: http://localhost:8080/docs  
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)

## 💡 Using the Client Snippet

Send data from your web application to LogSight with our lightweight JavaScript client.

### Initialize the Client

```javascript
const logsight = new LogSight('your_project_id');
```

### Track Custom Events

```javascript
// Track a user login event
logsight.track('user-login', { 
    userId: '123', 
    plan: 'premium' 
});
```

### Automatic Error Tracking

The snippet automatically captures and sends uncaught JavaScript errors to your dashboard.

## 🔮 Future Improvements

- **Customizable Dashboards**: User-created and saveable data visualization widgets
- **Enhanced Alert Integrations**: Email, PagerDuty, and additional notification channels  
- **Advanced Log Management**: Improved UI for searching and filtering raw log data
- **User-Facing API**: Complete alert rule management via API endpoints