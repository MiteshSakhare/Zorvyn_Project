# 💰 Zorvyn Finance - Full Stack Application

A complete finance management dashboard built with **FastAPI** (Python), **PostgreSQL**, and **React.js**. Track income, expenses, create transactions, manage categories, and analyze spending patterns with role-based access control.

## ✨ Features

- **Authentication & Authorization** - JWT-based auth with role-based access control (Viewer, Analyst, Admin)
- **Dashboard** - Summary statistics, charts, and recent transactions
- **Transaction Management** - Create, read, update, delete transactions with filtering
- **Category Management** - Organize transactions by categories
- **Analytics** - Monthly trends, category breakdowns, spending insights
- **User Management** - Admin controls for user roles and status (Admin only)
- **Responsive UI** - Clean Tailwind CSS design with Recharts visualizations
- **Production Ready** - Docker, tests, error handling, and deployment configs

---

## 🏗️ Architecture

### Backend Stack
- **FastAPI** - Modern async Python framework
- **PostgreSQL** - Relational database with indexes
- **SQLAlchemy 2.0** - ORM for database models
- **Pydantic v2** - Request/response validation
- **JWT (python-jose)** - Stateless authentication
- **bcrypt** - Password hashing

### Frontend Stack
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Charts and visualizations
- **Axios** - HTTP client with interceptors
- **Lucide Icons** - Icon library

### Deployment
- **Backend** - Railway.app (FastAPI + PostgreSQL)
- **Frontend** - Vercel (React SPA)
- **Local** - Docker Compose (PostgreSQL + FastAPI)

---

## 📋 Project Structure

```
zorvyn-finance/
├── backend/                              # FastAPI Application
│   ├── app/
│   │   ├── main.py                       # FastAPI app, CORS, routes
│   │   ├── config.py                     # Settings, environment variables
│   │   ├── database.py                   # SQLAlchemy engine, session factory
│   │   ├── models/                       # ORM Models
│   │   │   ├── user.py                   # User model with roles
│   │   │   ├── category.py
│   │   │   └── transaction.py
│   │   ├── schemas/                      # Pydantic validation
│   │   │   ├── user.py
│   │   │   ├── transaction.py
│   │   │   ├── category.py
│   │   │   └── dashboard.py
│   │   ├── routers/                      # API endpoints
│   │   │   ├── auth.py                   # /auth
│   │   │   ├── users.py                  # /users
│   │   │   ├── transactions.py           # /transactions
│   │   │   ├── categories.py             # /categories
│   │   │   └── dashboard.py              # /dashboard
│   │   ├── services/                     # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── user_service.py
│   │   │   ├── transaction_service.py
│   │   │   ├── category_service.py
│   │   │   └── dashboard_service.py
│   │   ├── core/
│   │   │   ├── security.py               # JWT, password hashing
│   │   │   └── dependencies.py           # get_current_user, role_required
│   │   └── middleware/
│   │       └── error_handler.py          # Global error handling
│   ├── tests/                            # Pytest test suite
│   │   ├── test_auth.py
│   │   └── conftest.py
│   ├── seed.py                           # Demo data (3 users, 50 transactions)
│   ├── requirements.txt                  # Python dependencies
│   ├── Dockerfile                        # Multi-stage Docker build
│   ├── Procfile                          # Railway deployment file
│   ├── railway.toml                      # Railway configuration
│   └── .env.example                      # Environment template
│
├── frontend/                             # React Application
│   ├── src/
│   │   ├── main.jsx                      # React entry point
│   │   ├── App.jsx                       # Main router component
│   │   ├── index.css                     # Global styles
│   │   ├── api/
│   │   │   └── axios.js                  # Axios instance + JWT interceptor
│   │   ├── context/
│   │   │   └── AuthContext.jsx           # Auth state & hooks
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   └── Users.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RoleGuard.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── charts/
│   │   │       ├── MonthlyTrend.jsx
│   │   │       └── CategoryPie.jsx
│   │   └── utils/
│   │       └── formatters.js             # Currency, date formatting
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vercel.json
│   ├── .env.example
│   └── index.html
│
├── docker-compose.yml                    # Local dev (PostgreSQL + FastAPI)
└── README.md                             # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+ (or use Docker)
- Docker & Docker Compose (recommended)

### Option 1: Local Development (Using Docker Compose)

#### 1. Clone & Setup
```bash
cd zorvyn-finance
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

#### 2. Update Environment Variables

**backend/.env**
```
DATABASE_URL=postgresql://user:password@postgres:5432/zorvyn_finance
SECRET_KEY=your-super-secret-key-here
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

#### 3. Run with Docker Compose
```bash
docker-compose up
```

This will:
- Start PostgreSQL on `localhost:5432`
- Start FastAPI on `http://localhost:8000`
- Create tables automatically
- Seed demo data

#### 4. Install & Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend will be at `http://localhost:5173`

---

### Option 2: Manual Local Setup

#### Backend Setup

```bash
# 1. Create virtual environment
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env file
cp .env.example .env
# Edit .env with your PostgreSQL connection

# 4. Create tables and seed data
python seed.py

# 5. Run server
uvicorn app.main:app --reload
```

**Backend runs on:** `http://localhost:8000`

**Swagger Docs:** `http://localhost:8000/docs`

#### Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:8000

# 3. Run dev server
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

---

## 🔐 Demo Accounts

After seeding, use these accounts to test:

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@finance.com | Admin@123 |
| **Analyst** | analyst@finance.com | Analyst@123 |
| **Viewer** | viewer@finance.com | Viewer@123 |

### Role Permissions

| Action | Viewer | Analyst | Admin |
|---|:---:|:---:|:---:|
| View own transactions | ✅ | ✅ | ✅ |
| View all transactions | ❌ | ✅ | ✅ |
| Create transaction | ❌ | ✅ | ✅ |
| Update transaction | ❌ | ❌ | ✅ |
| Delete transaction | ❌ | ❌ | ✅ |
| View dashboard | ✅ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## 📡 API Endpoints

### Authentication
```
POST   /auth/register           - Register new user
POST   /auth/login              - Login & get JWT token
GET    /auth/me                 - Get current user profile
```

### Users (Admin Only)
```
GET    /users                   - List all users (paginated)
PATCH  /users/{id}/role         - Change user role
PATCH  /users/{id}/status       - Activate/deactivate user
DELETE /users/{id}              - Delete user
```

### Transactions
```
GET    /transactions            - List transactions (with filters)
POST   /transactions            - Create transaction (analyst+)
GET    /transactions/{id}       - Get single transaction
PUT    /transactions/{id}       - Update transaction (admin)
DELETE /transactions/{id}       - Soft delete transaction (admin)

Query Parameters:
?type=income|expense
?category_id=uuid
?date_from=YYYY-MM-DD
?date_to=YYYY-MM-DD
?search=keyword
?page=1&limit=20
```

### Categories
```
GET    /categories              - List all categories
POST   /categories              - Create category (admin)
```

### Dashboard
```
GET    /dashboard/summary       - Summary statistics
GET    /dashboard/by-category   - Category breakdown
GET    /dashboard/trends        - Monthly trends
GET    /dashboard/recent        - Recent transactions
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run specific test file
pytest tests/test_auth.py

# Run with coverage
pytest --cov=app tests/
```

### Manual API Testing with cURL

```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123","full_name":"Test User"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@finance.com","password":"Admin@123"}'

# Get current user (use token from login)
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐳 Docker & Deployment

### Build Backend Docker Image

```bash
cd backend
docker build -t zorvyn-finance-backend:latest .
docker run -p 8000:8000 --env-file .env zorvyn-finance-backend:latest
```

---

## 🚢 Deployment to Production

### Backend Deployment (Railway.app)

1. **Create Railway Account** - Sign up at [railway.app](https://railway.app)

2. **Connect GitHub Repository**
   - Click "New Project"
   - Select "GitHub Repo"
   - Authorize and select your repo

3. **Configure Environment**
   - Go to Variables tab
   - Add:
     ```
     DATABASE_URL=postgresql://...  (Railway creates this)
     SECRET_KEY=your-production-secret-key
     ALLOWED_ORIGINS=https://your-frontend-url
     DEBUG=False
     ```

4. **Deploy**
   - Railway automatically deploys on git push
   - Backend will be live at: `https://your-project.railway.app`

### Frontend Deployment (Vercel)

1. **Create Vercel Account** - Sign up at [vercel.com](https://vercel.com)

2. **Import GitHub Project**
   - Click "New Project"
   - Select your GitHub repo
   - Vercel auto-detects Vite config

3. **Environment Variables**
   - Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend-url`

4. **Deploy**
   - Vercel auto-deploys on git push
   - Frontend will be live at: `https://your-app.vercel.app`

---

## 🔒 Security Considerations

✅ **Implemented:**
- JWT tokens with 30-minute expiry
- bcrypt password hashing
- SQL injection prevention (SQLAlchemy parameterized queries)
- CORS configuration (frontend origin only)
- Role-based access control at API level
- Database indexes for query performance
- Input validation with Pydantic v2

⚠️ **For Production:**
- Change `SECRET_KEY` in `.env` to a cryptographically strong random string
- Use environment variables for all secrets (never commit them)
- Enable HTTPS everywhere
- Set `DEBUG=False` in production
- Use a reverse proxy (nginx)
- Monitor logs and errors
- Regular dependency updates (watch for CVEs)

---

## 📊 Database Schema

### Users Table
```sql
- id (UUID, PK)
- email (String, unique)
- hashed_password (String)
- full_name (String)
- role (Enum: viewer|analyst|admin)
- is_active (Boolean)
- created_at, updated_at (Timestamp)
```

### Categories Table
```sql
- id (UUID, PK)
- name (String, unique)
- description (Text)
- created_by (FK → User)
- created_at, updated_at (Timestamp)
```

### Transactions Table
```sql
- id (UUID, PK)
- user_id (FK → User)
- amount (Numeric 12,2)  ← prevents float precision errors
- type (Enum: income|expense)
- category_id (FK → Category)
- date (Date)
- notes (String)
- is_deleted (Boolean)   ← soft delete
- created_at, updated_at (Timestamp)

Indexes:
- (user_id, date)
- (category_id)
```

---

## 🐛 Troubleshooting

### Backend Issues

**PostgreSQL Connection Error**
```bash
# Check if PostgreSQL is running
psql -U user -d zorvyn_finance -h localhost

# Verify DATABASE_URL in .env
DATABASE_URL=postgresql://user:password@localhost:5432/zorvyn_finance
```

**Module Import Errors**
```bash
# Ensure you're in the backend directory
cd backend

# Activate venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate      # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

**Database Schema Issues**
```bash
# Clear and reseed (WARNING: destroys data)
python seed.py
```

### Frontend Issues

**Module Not Found**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**API Connection Errors**
- Check `VITE_API_URL` in `frontend/.env`
- Ensure backend is running: `http://localhost:8000/health`
- Check browser console for CORS errors

---

## 📚 Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes** in backend or frontend

3. **Test locally**
   ```bash
   # Backend
   cd backend && pytest

   # Frontend
   cd frontend && npm run lint
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/your-feature
   ```

5. **Create Pull Request** on GitHub

6. **Deploy** - GitHub Actions or manual Railway/Vercel deploy

---

## 📖 Code Quality

### Backend Code Style
- Follow PEP 8
- Use type hints
- Write docstrings for functions

### Frontend Code Style
- Use functional components + hooks
- Follow camelCase for functions/variables
- Comment complex logic

### Database Queries
- Use SQLAlchemy ORM (not raw SQL)
- Implement proper indexes
- Use pagination for large datasets

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💼 Author

**Mitesh Sakhare**
- Zorvyn Fintech - Backend Developer Intern
- [LinkedIn](https://linkedin.com/in/mitesh-sakhare)
- [GitHub](https://github.com/mitesh-sakhare)

---

## 🙏 Acknowledgments

- FastAPI documentation
- React.js best practices
- Tailwind CSS community
- PostgreSQL optimization guides

---

## 📞 Support

For issues, questions, or feedback:
- Open an GitHub issue
- Check existing documentation
- Review API docs at `/docs` endpoint

---

**Happy coding! 🚀**
