# 📋 Full Stack Project Plan — Finance Data Processing & Access Control
**Candidate:** Mitesh Sakhare
**Assignment:** Zorvyn Fintech — Backend Developer Intern
**Stack:** Python · FastAPI · PostgreSQL · React.js · Tailwind CSS

---

## ⚙️ Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| **Backend Language** | Python 3.11+ | Primary language, production experience at Wiriya |
| **Backend Framework** | FastAPI | Async, auto Swagger docs, clean routing |
| **Database** | PostgreSQL | Relational, fits finance data perfectly |
| **ORM** | SQLAlchemy 2.x + Alembic | Industry standard, migrations support |
| **Auth** | JWT (python-jose) | Stateless, used in production (resume) |
| **Password Hashing** | bcrypt (passlib) | Secure hashing |
| **Validation** | Pydantic v2 | Built into FastAPI |
| **Frontend** | React.js (JavaScript) | Listed on resume, widely used |
| **Styling** | Tailwind CSS | Utility-first, rapid UI development |
| **Charts** | Recharts | Lightweight charting for React |
| **HTTP Client** | Axios | API calls from React |
| **State Management** | Context API + useState | Simple enough, no Redux needed |
| **Dev Tools** | Docker + Docker Compose | Easy local setup, on resume |
| **API Docs** | Swagger UI (auto) | FastAPI generates this for free |

---

## 🌐 Deployment Plan (All Free)

| Part | Platform | URL Pattern |
|---|---|---|
| **Backend (FastAPI)** | Railway.app | `https://finance-api.railway.app` |
| **Database (PostgreSQL)** | Railway.app | Managed, same project |
| **Frontend (React)** | Vercel | `https://finance-dashboard.vercel.app` |
| **API Docs** | Auto via FastAPI | `https://finance-api.railway.app/docs` |

Railway hosts backend + database together for free. Vercel hosts React frontend — same workflow you already know.

---

## 📁 Folder Structure

```
zorvyn-finance/
│
├── backend/                          # FastAPI Application
│   ├── app/
│   │   ├── main.py                   # FastAPI app entry, CORS config
│   │   ├── config.py                 # Settings via pydantic-settings (.env)
│   │   ├── database.py               # DB engine, session, Base
│   │   │
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   │   ├── user.py
│   │   │   ├── transaction.py
│   │   │   └── category.py
│   │   │
│   │   ├── schemas/                  # Pydantic request/response schemas
│   │   │   ├── user.py
│   │   │   ├── transaction.py
│   │   │   └── dashboard.py
│   │   │
│   │   ├── routers/                  # Route handlers (thin layer)
│   │   │   ├── auth.py               # /auth/register, /auth/login
│   │   │   ├── users.py              # /users (admin only)
│   │   │   ├── transactions.py       # /transactions CRUD
│   │   │   └── dashboard.py          # /dashboard/summary, trends
│   │   │
│   │   ├── services/                 # Business logic (fat layer)
│   │   │   ├── auth_service.py
│   │   │   ├── user_service.py
│   │   │   ├── transaction_service.py
│   │   │   └── dashboard_service.py
│   │   │
│   │   ├── core/
│   │   │   ├── security.py           # JWT encode/decode, password hashing
│   │   │   └── dependencies.py       # get_current_user, role_required()
│   │   │
│   │   └── middleware/
│   │       └── error_handler.py      # Global exception handlers
│   │
│   ├── alembic/                      # DB migrations
│   ├── tests/                        # Pytest test suite
│   │   ├── test_auth.py
│   │   ├── test_transactions.py
│   │   └── test_dashboard.py
│   │
│   ├── seed.py                       # Demo data seeder
│   ├── .env.example
│   ├── Dockerfile
│   ├── requirements.txt
│   └── railway.toml                  # Railway deployment config
│
├── frontend/                         # React Application
│   ├── public/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx                   # Routes setup
│   │   │
│   │   ├── api/
│   │   │   └── axios.js              # Axios instance + interceptors
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Auth state (user, token, login, logout)
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx         # Summary cards + charts
│   │   │   ├── Transactions.jsx      # Table with filters
│   │   │   └── Users.jsx             # Admin only — user management
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ProtectedRoute.jsx    # Redirect if not logged in
│   │   │   ├── RoleGuard.jsx         # Hide UI elements by role
│   │   │   ├── StatCard.jsx          # Income / Expense / Balance card
│   │   │   ├── TransactionTable.jsx
│   │   │   ├── TransactionForm.jsx   # Create / Edit modal
│   │   │   └── charts/
│   │   │       ├── MonthlyTrend.jsx  # Line/Bar chart
│   │   │       └── CategoryPie.jsx   # Pie chart
│   │   │
│   │   └── utils/
│   │       └── formatters.js         # Currency, date formatting
│   │
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── vercel.json                   # Vercel deployment config
│
├── docker-compose.yml                # Runs backend + postgres locally
└── README.md                         # Full setup + deployment guide
```

---

## 🗄️ Data Models

### User
```
id              UUID, primary key
email           String, unique, indexed
hashed_password String
full_name       String
role            Enum → viewer | analyst | admin
is_active       Boolean, default True
created_at      DateTime
updated_at      DateTime
```

### Category
```
id              UUID, primary key
name            String, unique
description     String (optional)
created_by      FK → User.id
```

### Transaction
```
id              UUID, primary key
user_id         FK → User.id
amount          Numeric(12, 2)   ← no float precision bugs
type            Enum → income | expense
category_id     FK → Category.id
date            Date
notes           String (optional)
is_deleted      Boolean, default False  ← soft delete
created_at      DateTime
updated_at      DateTime
```

---

## 🔐 Role & Access Control Matrix

| Action | Viewer | Analyst | Admin |
|---|---|---|---|
| Login / Register | ✅ | ✅ | ✅ |
| View own transactions | ✅ | ✅ | ✅ |
| View all transactions | ❌ | ✅ | ✅ |
| Create transaction | ❌ | ✅ | ✅ |
| Update transaction | ❌ | ❌ | ✅ |
| Delete transaction | ❌ | ❌ | ✅ |
| View dashboard summary | ✅ | ✅ | ✅ |
| View category breakdown | ✅ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| Change user roles | ❌ | ❌ | ✅ |
| Deactivate users | ❌ | ❌ | ✅ |

Access control is enforced at **two levels**:
- **Backend** → `role_required(["admin"])` FastAPI dependency on every protected route
- **Frontend** → `<RoleGuard>` component hides buttons/pages based on role (UI only, not a security layer)

---

## 🛣️ API Endpoints

### Auth — `/auth`
```
POST   /auth/register           → Create account (default role: viewer)
POST   /auth/login              → Returns JWT access token
GET    /auth/me                 → Current user profile
```

### Users — `/users` (Admin only)
```
GET    /users                   → List all users (paginated)
PATCH  /users/{id}/role         → Change user role
PATCH  /users/{id}/status       → Activate / Deactivate
DELETE /users/{id}              → Hard delete user
```

### Transactions — `/transactions`
```
GET    /transactions            → List with filters: date, type, category, search
POST   /transactions            → Create new record (analyst, admin)
GET    /transactions/{id}       → Single record
PUT    /transactions/{id}       → Update (admin only)
DELETE /transactions/{id}       → Soft delete (admin only)
```

Query params for `GET /transactions`:
```
?type=income|expense
?category_id=uuid
?date_from=YYYY-MM-DD
?date_to=YYYY-MM-DD
?search=keyword
?page=1&limit=20
```

### Dashboard — `/dashboard`
```
GET    /dashboard/summary       → Total income, expenses, net balance
GET    /dashboard/by-category   → Category-wise totals (income + expense)
GET    /dashboard/trends        → Monthly totals for last 6 months
GET    /dashboard/recent        → Last 10 transactions
```

### Categories — `/categories`
```
GET    /categories              → List all categories
POST   /categories              → Create category (admin)
```

---

## 🖥️ Frontend Pages

### Login / Register
- Clean auth forms with Tailwind styling + validation
- JWT token stored in localStorage
- Redirect to dashboard on success

### Dashboard (all roles)
- 3 stat cards → Total Income | Total Expenses | Net Balance
- Bar chart → Monthly trends (last 6 months) using Recharts
- Pie chart → Category-wise breakdown
- Recent transactions list

### Transactions Page
- Paginated table with clean Tailwind design
- Filter bar: by type, category, date range, keyword search
- Add Transaction button (hidden for viewers via RoleGuard)
- Edit / Delete actions (admin only)
- Modal form for create / edit

### Users Page (Admin only)
- Table of all users with roles
- Change role dropdown
- Activate / Deactivate toggle
- Delete user button

---

## 🏗️ Build Phases

### Phase 1 — Backend Setup (Day 1 Morning)
- [ ] FastAPI project scaffold with folder structure
- [ ] PostgreSQL + SQLAlchemy + Alembic setup
- [ ] Docker Compose (app + postgres)
- [ ] `.env` config with pydantic-settings
- [ ] Health check endpoint `GET /health`

### Phase 2 — Auth & Users (Day 1 Afternoon)
- [ ] User model + migration
- [ ] Register & Login endpoints
- [ ] JWT generation + validation
- [ ] `get_current_user` dependency
- [ ] `role_required()` dependency factory
- [ ] User management CRUD (admin)

### Phase 3 — Transactions & Categories (Day 2 Morning)
- [ ] Transaction + Category models + migrations
- [ ] Full CRUD with role guards
- [ ] Filtering, search, pagination
- [ ] Soft delete

### Phase 4 — Dashboard APIs (Day 2 Afternoon)
- [ ] Summary aggregations (SQL level, no Python loops)
- [ ] Category-wise totals
- [ ] Monthly trends using GROUP BY
- [ ] Recent activity endpoint

### Phase 5 — React Frontend (Day 3)
- [ ] Vite + React + Tailwind setup
- [ ] Axios instance with JWT interceptor (auto-attach token)
- [ ] AuthContext (login, logout, user state)
- [ ] Login / Register pages
- [ ] ProtectedRoute + RoleGuard components
- [ ] Dashboard page with Recharts
- [ ] Transactions page with filters + modal form
- [ ] Users page (admin)

### Phase 6 — Polish, Tests & Deploy (Day 4)
- [ ] Global error handler middleware
- [ ] Pytest tests for auth + transactions
- [ ] Seed script (3 demo users + 50 sample records)
- [ ] Deploy backend + DB to Railway
- [ ] Deploy frontend to Vercel
- [ ] Complete README with setup + deployed links

---

## 🌱 Seed / Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@finance.com | Admin@123 |
| Analyst | analyst@finance.com | Analyst@123 |
| Viewer | viewer@finance.com | Viewer@123 |

`seed.py` creates these 3 users + 50 sample transactions across categories like Salary, Rent, Food, Utilities, Freelance.

---

## 📝 Assumptions

1. JWT access token valid for 30 minutes. No refresh token (kept simple).
2. Viewers can only see their own transactions. Analysts and Admins see all.
3. Categories are global, not per-user.
4. Amounts stored as `Numeric(12, 2)` — avoids float precision issues with money.
5. Soft delete on transactions (`is_deleted` flag). Hard delete on users.
6. CORS configured to allow only the Vercel frontend URL in production.
7. No email verification — registration is instant.
8. Frontend is for demo / evaluation only — backend APIs remain the primary deliverable.

---

## ✅ Optional Enhancements (if time permits)
- [ ] Export transactions as CSV
- [ ] Search transactions by notes keyword
- [ ] Dark mode toggle on frontend
- [ ] Rate limiting with slowapi

---

## 📦 Final Deliverables
- GitHub repository (clean, meaningful commits)
- Live backend URL (Railway) with `/docs` Swagger UI
- Live frontend URL (Vercel)
- README with local setup + deployment guide
- Seed script for demo accounts

---

*Stack aligns perfectly with Mitesh's resume: FastAPI + PostgreSQL + React + Docker — all production-used skills at Wiriya Technology.*
