# 📝 To-Do List Application

A task management application with CRUD functionality, featuring clean architecture, Django REST backend, and a React + TailwindCSS frontend.

## 🏗️ Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────────────────┐
│                  PRESENTATION                        │
│         (React Components, Pages, Hooks)            │
├─────────────────────────────────────────────────────┤
│                  APPLICATION                         │
│              (Use Cases, Services)                  │
├─────────────────────────────────────────────────────┤
│                    DOMAIN                            │
│         (Entities, Repository Interfaces)           │
├─────────────────────────────────────────────────────┤
│                INFRASTRUCTURE                        │
│      (API Clients, LocalStorage, Database)          │
└─────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
To-do-list/
├── backend/                    # Django Backend
│   ├── config/                 # Project configuration
│   │   ├── settings/
│   │   │   ├── base.py        # Base settings
│   │   │   ├── development.py # Dev settings
│   │   │   └── production.py  # Prod settings
│   │   └── urls.py
│   ├── apps/
│   │   └── tasks/              # Tasks app
│   │       ├── models.py       # Domain entities
│   │       ├── serializers.py  # DTOs
│   │       ├── views.py        # Controllers
│   │       ├── services.py     # Business logic
│   │       └── repositories.py # Data access
│   └── requirements.txt
│
├── frontend/                   # React Frontend
│   ├── src/
│   │   ├── domain/             # Business entities & interfaces
│   │   ├── application/        # Use cases
│   │   ├── infrastructure/     # API clients, storage
│   │   └── presentation/       # UI components, hooks, pages
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start the server
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Using Docker (Alternative)

```bash
# Start all services
docker-compose up -d

# Stop services
docker-compose down
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/` | List all tasks |
| POST | `/api/tasks/` | Create a new task |
| GET | `/api/tasks/{id}/` | Get a specific task |
| PUT/PATCH | `/api/tasks/{id}/` | Update a task |
| DELETE | `/api/tasks/{id}/` | Delete a task |
| POST | `/api/tasks/{id}/toggle/` | Toggle task completion |
| GET | `/api/tasks/statistics/` | Get task statistics |

### Query Parameters for GET /api/tasks/

- `status` - Filter by status (pending, in_progress, completed)
- `priority` - Filter by priority (low, medium, high)
- `search` - Search in title and description

## ✨ Features

- ✅ Create, Read, Update, Delete tasks
- ✅ Task priority levels (Low, Medium, High)
- ✅ Task status tracking (Pending, In Progress, Completed)
- ✅ Due date management
- ✅ Search and filter tasks
- ✅ Task statistics dashboard
- ✅ Responsive design with TailwindCSS
- ✅ Clean Architecture implementation
- ✅ RESTful API with Django REST Framework

## 🛠️ Tech Stack

### Backend
- **Django 5.0** - Web framework
- **Django REST Framework** - API development
- **SQLite** (dev) / **PostgreSQL** (prod) - Database

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Vite** - Build tool
- **Axios** - HTTP client

## 📝 License

MIT License