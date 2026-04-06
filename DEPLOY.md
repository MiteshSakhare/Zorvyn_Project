# 🚀 DEPLOYMENT GUIDE - ZORVYN FINANCE

## Overview

This guide covers deploying Zorvyn Finance to production for **FREE** using industry-standard platforms.

**Recommended Stack:**
- **Backend**: Render.com (FastAPI)
- **Frontend**: Vercel (React)
- **Database**: PostgreSQL (Render)

**Alternative Options:** Railway, Heroku, AWS Free Tier

---

## TABLE OF CONTENTS

1. [Option A: Render + Vercel (Recommended)](#option-a-render--vercel-recommended)
2. [Option B: Railway + Vercel](#option-b-railway--vercel)
3. [Option C: Heroku + Vercel (Legacy)](#option-c-heroku--vercel-legacy)
4. [Testing Deployment](#testing-deployment)
5. [SSL & Custom Domains](#ssl--custom-domains)
6. [Troubleshooting](#troubleshooting)

---

# OPTION A: RENDER + VERCEL (RECOMMENDED) ⭐

Render has better free tier than Railway with **750 free CPU hours/month**.

## PART 1: DEPLOY BACKEND ON RENDER

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Sign Up"** → Select **"Sign up with GitHub"**
3. Authorize Render to access your GitHub account
4. Complete account setup (name, email)

### Step 2: Connect GitHub Repository

1. In Render dashboard, go to **"Settings"**
2. Click **"Connect Repository"**
3. Select **`zorvyn-finance`** repository
4. Click **"Connect"**

### Step 3: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Select your connected `zorvyn-finance` repository
3. Choose **instance**: Free tier (0.5 CPU, 512MB RAM)
4. Set configuration:
   - **Name**: `zorvyn-api`
   - **Root Directory**: `backend`
   - **Runtime**: **Docker** ⭐ (Recommended - uses Dockerfile automatically)
   
   > **Alternative**: Select Python 3.11 if you don't want to use Docker
   > - Build Command: `pip install -r requirements.txt`
   > - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port ${PORT:8000}`

5. Click **"Create Web Service"**

**Why Docker?** 
- ✅ Uses existing `backend/Dockerfile` automatically
- ✅ No need to manually specify runtime/build commands
- ✅ Encapsulates all dependencies (Python, system libs, etc.)
- ✅ Ensures local == production environment
- ✅ Faster deployment and more reliable

### Step 4: Add PostgreSQL Database

1. Click **"New +"** → **"PostgreSQL"**
2. Set configuration:
   - **Name**: `zorvyn-db`
   - **Database**: `zorvyn_finance`
   - **User**: `zorvyn_user`
   - **Region**: Same as backend (auto-selected)
   - **Plan**: Free tier
3. Click **"Create Database"**

### Step 5: Configure Environment Variables

**For Backend Web Service:**

1. Go to your web service → **"Environment"**
2. Click **"Add Environment Variable"** and add:

```
PYTHON_VERSION=3.11
DEBUG=False
SECRET_KEY=<generate-strong-key-below>
ALLOWED_ORIGINS=https://<your-vercel-url>.vercel.app
```

**To generate SECRET_KEY**, run in terminal:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**For Database Connection:**

Render automatically provides `DATABASE_URL` in format:
```
postgresql://user:password@host:port/database
```

This is auto-discoverable as `$DATABASE_URL` environment variable.

3. Click **"Save Deploy"** (auto-deploys)

### Step 6: Get Backend URL

1. Go to Web Service dashboard
2. Copy URL under service name (looks like: `https://zorvyn-api.onrender.com`)
3. Verify it's working:
   ```
   https://zorvyn-api.onrender.com/health
   ```
   Should return: `{"status":"healthy","app":"Zorvyn Finance API"}`

⚠️ **Note**: First request might take 30 seconds (free tier spin-up)

---

## USING DOCKER FOR DEPLOYMENT

### Why Docker?

Docker is the **better choice** for deploying your backend because:

| Aspect | Docker | Traditional |
|--------|--------|-------------|
| **Setup** | Auto-detects Dockerfile | Manual runtime/build/start |
| **Consistency** | Local env = Production env | Might differ between systems |
| **Dependencies** | All in Dockerfile | Manual package management |
| **Build Speed** | Cached layers | Rebuilds everything |
| **Reliability** | Guaranteed environment | Version conflicts possible |

### How It Works

1. Render reads your `backend/Dockerfile`
2. Builds Docker image with all dependencies
3. Runs container on Render infrastructure
4. Auto-redeploys on git push

### Your Dockerfile

Your project already has a working Dockerfile at `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Render automatically detects and uses this!** ✅

### Environment Variables Still Required

Even with Docker, you still need to set environment variables in Render:

```
DEBUG=False
SECRET_KEY=<your-secret-key>
ALLOWED_ORIGINS=https://<your-vercel-url>.vercel.app
```

Render automatically injects `DATABASE_URL` from PostgreSQL service.

---

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel
4. Complete setup

### Step 2: Import Project

1. Click **"New Project"** (or "Add New")
2. Select **"Import Git Repository"**
3. Search for `zorvyn-finance`
4. Click **"Import"**

### Step 3: Configure Project

1. **Root Directory**: Select `frontend`
2. **Framework**: Vercel auto-detects as Vite ✓
3. **Build Command**: `npm run build` ✓
4. **Output Directory**: `dist` ✓

### Step 4: Set Environment Variables

1. Click **"Environment Variables"**
2. Add:
   ```
   VITE_API_URL=https://zorvyn-api.onrender.com
   ```
   Replace with your actual Render backend URL
3. Click **"Deploy"**

### Step 5: Get Frontend URL

After deployment (2-3 min), you'll get:
```
https://zorvyn-finance.vercel.app
```

---

## PART 3: UPDATE BACKEND WITH FRONTEND URL

Go back to Render:

1. Web Service → **"Environment"**
2. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=https://zorvyn-finance.vercel.app
   ```
3. Click **"Save Deploy"** (auto-redeploys)

---

## PART 4: VERIFY DEPLOYMENT

### Test Backend API

```bash
# Health check
curl https://zorvyn-api.onrender.com/health

# Expected response:
# {"status":"healthy","app":"Zorvyn Finance API"}
```

### Test Frontend

1. Visit: `https://zorvyn-finance.vercel.app`
2. Should load login page
3. Login with:
   ```
   Email: viewer@finance.com
   Password: Viewer@123
   ```
4. Dashboard should show real data ✅

---

---

# OPTION B: RAILWAY + VERCEL

Railway offers $5/month free credits with generous limits.

## PART 1: DEPLOY BACKEND ON RAILWAY

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Authorize Railway

### Step 2: Create Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub"**
3. Select `zorvyn-finance` repository
4. Select root directory as **`backend`**

### Step 3: Select Deployment Method

**Option A: Docker** ⭐ (Recommended)
- Railway auto-detects `Dockerfile`
- No additional configuration needed
- Uses existing Docker setup

**Option B: Buildpack** (Traditional)
- Detect language (Python)
- Auto-installs dependencies from `requirements.txt`

### Step 4: Add PostgreSQL

1. Click **"+ Add Service"**
2. Select **"Database"** → **"PostgreSQL 16"**
3. Railway auto-creates connection string

### Step 5: Configure Variables

Go to Variables tab and add:

```
DEBUG=False
SECRET_KEY=<your-secret-key>
ALLOWED_ORIGINS=https://<your-vercel-url>.vercel.app
```

Railway auto-provides: `$DATABASE_URL` from PostgreSQL service

### Step 6: Deploy

1. Click **"Deploy"**
2. Get URL from **Settings** → **Domains**
3. URL: `https://zorvyn-api-production.up.railway.app`

### Step 7: Update Frontend URL

1. Variables: Update `ALLOWED_ORIGINS` to Vercel URL
2. Auto-redeploys

## PART 2: DEPLOY FRONTEND (Same as Render Option)

Follow **Option A: Part 2** (Vercel deployment)

---

---

# OPTION C: HEROKU + VERCEL (LEGACY)

⚠️ **Note**: Heroku free tier ended in Nov 2022. Use paid tier ($7/month) or alternatives.

### If still using Heroku dynos:

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create zorvyn-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

**Not recommended for FREE deployment anymore.**

---

---

# TESTING DEPLOYMENT

## Test Checklist

- [ ] Backend health check responds
- [ ] Frontend loads at custom URL
- [ ] Login works with demo credentials
- [ ] Dashboard loads with real data
- [ ] Charts render (Monthly Trend, Category Pie)
- [ ] Transactions table populates
- [ ] Can view all three user roles (Admin, Analyst, Viewer)
- [ ] API endpoints return proper JSON (not nulls)

## Test Credentials

```
Admin:   admin@finance.com / Admin@123
Analyst: analyst@finance.com / Analyst@123
Viewer:  viewer@finance.com / Viewer@123
```

## Debug Endpoints

```bash
# Get all users (admin only)
GET /users

# Get dashboard summary
GET /dashboard/summary

# Get monthly trends
GET /dashboard/trends

# Get category breakdown
GET /dashboard/by-category

# Get recent transactions
GET /dashboard/recent
```

---

---

# SSL & CUSTOM DOMAINS

## Using Render Custom Domain

1. Web Service → **"Settings"** → **"Custom Domain"**
2. Enter your domain: `api.yourdomain.com`
3. Add CNAME record to DNS:
   ```
   CNAME: yourdomain.com → zorvyn-api.onrender.com
   ```
4. SSL auto-provisioned (free)

## Using Vercel Custom Domain

1. Project Settings → **"Domains"**
2. Add your domain: `finance.yourdomain.com`
3. Follow DNS setup instructions
4. SSL auto-provisioned (free)

---

---

# TROUBLESHOOTING

## Backend Issues

### Cold Start (30s delay)

Free tier Render spins down after 15 minutes of inactivity.

**Solution**: Keep-alive script
```python
# Add to backend if needed
import schedule
import requests
from background_tasks import BackgroundTasks

def keep_alive():
    requests.get(f"{os.getenv('APP_URL')}/health")
```

### Database Connection Failed

1. Check `DATABASE_URL` environment variable
2. Verify PGPASSWORD is correct
3. Check database is running: `Render` → Database → check status

### Import Error: Module not found

1. Verify `requirements.txt` includes all packages
2. Check `runtime.txt` has correct Python version
3. Run locally first: `pip install -r requirements.txt`

## Frontend Issues

### 500 Errors on API Calls

1. Check `VITE_API_URL` is correct
2. Verify backend is running
3. Check CORS in backend: `ALLOWED_ORIGINS` includes Vercel URL
4. Browser console → Network tab → see actual request URL

### Charts Not Showing

1. Check API returns data (not null)
2. Browser console for JavaScript errors
3. Verify Recharts library is installed

### Login Fails

1. Check backend `/auth/login` endpoint works
2. Verify credentials are correct
3. Check localStorage for token: `DevTools → Application → localStorage`

## Common Errors

| Error | Solution |
|-------|----------|
| `CORS error` | Update `ALLOWED_ORIGINS` in backend |
| `401 Unauthorized` | Token expired, re-login |
| `database connection refused` | Database not running, check Render |
| `Module not found` | Install dependencies: `pip install -r requirements.txt` |
| `Port already in use` | Change port or kill existing process |

---

---

# COST BREAKDOWN

## Render (Recommended)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Web Service | 750 + 300 Starter hours/mo | Free |
| PostgreSQL | 90 instances | Free |
| **Total** | — | **FREE** |

## Railway

| Service | Free Tier | Cost |
|---------|-----------|------|
| Services | $5/month credits | Free |
| PostgreSQL | Included | Free |
| **Total** | — | **FREE** |

## Vercel

| Service | Free Tier | Cost |
|---------|-----------|------|
| Frontend | Unlimited deployments | Free |
| Serverless Functions | 1,000 executions/day | Free |
| **Total** | — | **FREE** |

---

---

# PRODUCTION CHECKLIST

- [ ] Generate strong `SECRET_KEY`
- [ ] Set `DEBUG=False`
- [ ] Update `ALLOWED_ORIGINS` to production URL
- [ ] Enable HTTPS on custom domain
- [ ] Set up database backups
- [ ] Monitor logs regularly
- [ ] Set up error tracking (Sentry)
- [ ] Enable rate limiting on API
- [ ] Review security headers
- [ ] Test all user roles
- [ ] Load test with multiple users
- [ ] Set up uptime monitoring

---

---

# DEPLOYMENT COMPARISON

## Feature Comparison

| Feature | Render | Railway | Vercel |
|---------|--------|---------|--------|
| **Free Tier** | ✅ 750 hrs | ✅ $5 credits | ✅ Unlimited |
| **Auto-redeploy** | ✅ Git push | ✅ Git push | ✅ Git push |
| **Custom Domain** | ✅ Free | ✅ Free | ✅ Free |
| **SSL** | ✅ Auto | ✅ Auto | ✅ Auto |
| **Uptime** | 99.9% | 99.9% | 99.95% |
| **Support** | Community | Community | Premium |

---

---

# QUICK START SUMMARY

### Minimum Setup (5 minutes):

1. **Render** (Backend + DB):
   - Sign in with GitHub
   - Connect repo
   - Create Web Service + PostgreSQL
   - Copy API URL

2. **Vercel** (Frontend):
   - Sign in with GitHub
   - Import `frontend` directory
   - Set `VITE_API_URL`
   - Deploy

3. **Update CORS**:
   - Go back to Render
   - Update `ALLOWED_ORIGINS` with Vercel URL
   - Done! ✅

### Deployment Timeline:

- Backend: 3-5 minutes
- Database: 1-2 minutes
- Frontend: 2-3 minutes
- **Total**: ~10 minutes

---

---

# REFERENCES

- [Render Docs](https://render.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Deployment](https://vitejs.dev/guide/build.html)

---

**Questions?** Check logs in deployment platform dashboard for detailed error messages.

**Ready to deploy?** Start with [Option A: Render + Vercel](#option-a-render--vercel-recommended) ⭐
