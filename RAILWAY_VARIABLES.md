# Railway Environment Variables Configuration

## 🔧 Backend Service Variables

Copy and paste these into Railway Dashboard → Backend Service → Variables:

```bash
# Profile
SPRING_PROFILES_ACTIVE=prod

# Database (Railway auto-provides this - just reference it)
DATABASE_URL=${{MySQL.DATABASE_URL}}

# Server
PORT=8080

# CORS (UPDATE AFTER FRONTEND DEPLOYED)
FRONTEND_URL=https://your-frontend-name.up.railway.app

# AI Services (Internal Railway URLs)
OLLAMA_URL=http://ollama:11434

# Transcription Service (if separate)
TRANSCRIPTION_URL=http://transcription:5000

# YouTube API (GET FROM: https://console.cloud.google.com)
YOUTUBE_API_KEY=your_youtube_api_key_here

# JWT Security (GENERATE: openssl rand -hex 32)
JWT_SECRET=your_secure_random_32_character_minimum_secret_key_here
```

---

## 🎨 Frontend Service Variables

Copy and paste into Railway Dashboard → Frontend Service → Variables:

```bash
# Backend API URL (UPDATE AFTER BACKEND DEPLOYED)
VITE_API_URL=https://your-backend-name.up.railway.app
```

---

## 🤖 Ollama Service Configuration

1. **Image**: `ollama/ollama:latest`
2. **Volume**: 
   - Mount path: `/root/.ollama`
   - Size: `10GB`
3. **After deployment**, open Shell and run:

```bash
# Pull the AI model
ollama pull llama3

# Verify model downloaded
ollama list

# Optional: Pull optimized model (faster, slightly lower quality)
ollama pull llama3:8b-instruct-q4_0
```

---

## 🐍 Python Transcription Service (Optional Separate Service)

1. **Runtime**: Python 3.11
2. **Build Command**: `pip install -r requirements.txt`
3. **Start Command**: `python transcript_service.py`
4. **Port**: `5000`

Or integrate into backend Dockerfile (see DEPLOYMENT_GUIDE.md)

---

## 📋 How to Get Required Keys

### YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable **YouTube Data API v3**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the key → Add to Railway Backend variables
6. (Optional) Restrict key to YouTube Data API v3 only

**Quota**: 10,000 requests/day (Free)

### JWT Secret

Generate a secure random secret:

**Windows PowerShell**:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

**Mac/Linux**:
```bash
openssl rand -hex 32
```

**Online** (use at your own risk):
https://www.random.org/strings/?num=1&len=32&digits=on&upperalpha=on&loweralpha=on

**Result example**: `a7f2c9e1b8d5a6c3f9e2b7d8a5c6e9f2`

---

## 🔄 Updating Variables After Deployment

### Step 1: Get Service URLs

After deploying, Railway gives each service a URL:
- Backend: `https://lexicon-backend-production.up.railway.app`
- Frontend: `https://lexicon-frontend-production.up.railway.app`

### Step 2: Update Backend CORS

1. Go to Backend service → Variables
2. Update `FRONTEND_URL` with actual frontend URL
3. Redeploy backend

### Step 3: Update Frontend API URL

1. Go to Frontend service → Variables
2. Update `VITE_API_URL` with actual backend URL
3. Redeploy frontend

---

## 🔐 Security Checklist

### Before Going Live

- [ ] `JWT_SECRET` is minimum 32 characters
- [ ] `YOUTUBE_API_KEY` has quota limits set
- [ ] Database password is strong (Railway auto-generates)
- [ ] No secrets committed to GitHub
- [ ] CORS only allows your frontend domain
- [ ] API rate limiting enabled

### Best Practices

- ✅ Use Railway's variable references: `${{MySQL.DATABASE_URL}}`
- ✅ Never hardcode secrets in code
- ✅ Use different secrets for dev/prod
- ✅ Rotate JWT secret periodically
- ✅ Monitor Railway usage to avoid overages

---

## 🧪 Testing Variables Are Set Correctly

### Backend Health Check

```bash
curl https://your-backend.railway.app/api/health
```

**Expected**: `{"status":"UP"}`

### Test YouTube API

```bash
curl https://your-backend.railway.app/api/videos/search?query=java+tutorial
```

**Expected**: JSON array of videos

### Test Ollama

Check Railway backend logs for:
```
🤖 Ollama Service initialized (OPTIMIZED MODE)
   URL: http://ollama:11434
```

### Frontend API Connection

Open browser console on frontend:
- No CORS errors
- API calls to backend succeed
- Network tab shows 200 responses

---

## 💡 Common Variable Mistakes

### ❌ Wrong

```bash
# Missing protocol
FRONTEND_URL=lexicon-frontend.railway.app

# Localhost in production
VITE_API_URL=http://localhost:8080

# Hardcoded database
DATABASE_URL=mysql://user:pass@localhost:3306/db
```

### ✅ Correct

```bash
# Full HTTPS URL
FRONTEND_URL=https://lexicon-frontend.railway.app

# Production backend URL
VITE_API_URL=https://lexicon-backend.railway.app

# Railway reference
DATABASE_URL=${{MySQL.DATABASE_URL}}
```

---

## 📊 Variable Priority Order

Railway loads variables in this order (last wins):

1. Railway project variables
2. Service-specific variables ← **Use this**
3. Railway system variables (`PORT`, etc)

**Tip**: Set all custom variables at **service level**, not project level.

---

## 🔧 Advanced: Using Railway CLI

Install Railway CLI for easier variable management:

```bash
# Install
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Set variable
railway variables set YOUTUBE_API_KEY=your_key

# View all variables
railway variables
```

---

## 📝 Variable Template

Copy this template and fill in your values:

```bash
# ========================================
# BACKEND SERVICE VARIABLES
# ========================================
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=${{MySQL.DATABASE_URL}}
PORT=8080
FRONTEND_URL=https://_____.up.railway.app
OLLAMA_URL=http://ollama:11434
TRANSCRIPTION_URL=http://transcription:5000
YOUTUBE_API_KEY=_____________________
JWT_SECRET=_____________________

# ========================================
# FRONTEND SERVICE VARIABLES
# ========================================
VITE_API_URL=https://_____.up.railway.app
```

---

## ✅ Validation Commands

Run these after setting variables:

```bash
# Check backend can connect to database
railway run --service backend echo $DATABASE_URL

# Check frontend knows backend URL
railway run --service frontend echo $VITE_API_URL

# View all variables for service
railway variables --service backend
```

---

*Save this file for reference during deployment!*
