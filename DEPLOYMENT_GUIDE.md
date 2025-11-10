# 🚀 Lexicon Deployment Guide

## Recommended: Railway.app Deployment (~$15-25/month)

### Why Railway?
- ✅ Zero DevOps knowledge required
- ✅ Automatic deployments from GitHub
- ✅ Built-in MySQL, Docker support
- ✅ Free SSL certificates
- ✅ Pay-as-you-go pricing
- ✅ Perfect for Spring Boot + React apps

---

## 📋 Prerequisites

1. **GitHub Account** - Push your code to GitHub (free)
2. **Railway Account** - Sign up at [railway.app](https://railway.app)
3. **Domain (Optional)** - Buy from Namecheap/Google Domains ($10-15/year)

---

## 🛠️ Deployment Steps

### Step 1: Prepare Your Code

#### A. Update Backend Configuration

Create `backend/src/main/resources/application-prod.properties`:

```properties
# Production Database (Railway will provide these)
spring.datasource.url=${DATABASE_URL}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# Server
server.port=${PORT:8080}

# CORS - Update with your frontend URL
cors.allowed.origins=${FRONTEND_URL:https://your-app.railway.app}

# Ollama service (will be internal Railway URL)
ollama.api.base-url=${OLLAMA_URL:http://ollama:11434}/api/chat

# Transcription service
transcription.service.url=${TRANSCRIPTION_URL:http://localhost:5000}

# YouTube API
youtube.api.key=${YOUTUBE_API_KEY}

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# File upload
spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=100MB
```

#### B. Update Frontend API URL

Create `frontend-2/lexicon/.env.production`:

```env
VITE_API_URL=https://your-backend-url.railway.app
```

Update `frontend-2/lexicon/src/lib/api.ts` if hardcoded:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

#### C. Add Railway-specific files

Create `railway.json` in **backend/** folder:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "./mvnw clean package -DskipTests"
  },
  "deploy": {
    "startCommand": "java -Dserver.port=$PORT -jar target/*.jar --spring.profiles.active=prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Create `railway.json` in **frontend-2/lexicon/** folder:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npx serve -s dist -l $PORT",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

Add serve package to frontend `package.json`:

```json
{
  "dependencies": {
    "serve": "^14.2.1"
  }
}
```

---

### Step 2: Push to GitHub

```bash
# Initialize git (if not already done)
cd C:\Lexicon
git init

# Create .gitignore (important!)
# Add these to .gitignore:
target/
node_modules/
dist/
.env.local
*.log
ollama/
faster-whisper/
vosk-model-*/

# Commit and push
git add .
git commit -m "Initial commit for deployment"
git branch -M main

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/lexicon.git
git push -u origin main
```

---

### Step 3: Deploy on Railway

#### 3.1 Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize GitHub and select your `lexicon` repository

#### 3.2 Deploy Backend (Spring Boot)

1. Railway will auto-detect the backend
2. Click **"+ New"** → **"Database"** → **"MySQL"**
3. Go to **Backend service** → **"Variables"** tab
4. Add environment variables:

```
NODE_ENV=production
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=${{MySQL.DATABASE_URL}}  # Railway auto-fills this
YOUTUBE_API_KEY=your_youtube_api_key_here
JWT_SECRET=your_random_secret_minimum_32_characters_long
FRONTEND_URL=https://your-frontend-url.railway.app
OLLAMA_URL=http://ollama:11434
PORT=8080
```

5. Set **Root Directory**: `/backend`
6. Click **"Deploy"**

#### 3.3 Deploy Frontend (React)

1. Click **"+ New"** → **"GitHub Repo"** (same repo)
2. Railway creates a second service
3. Go to **Variables** tab:

```
VITE_API_URL=https://your-backend-url.railway.app
```

4. Set **Root Directory**: `/frontend-2/lexicon`
5. Click **"Deploy"**

#### 3.4 Add Ollama Service

1. Click **"+ New"** → **"Empty Service"**
2. Name it "ollama"
3. Go to **Settings** → **"Docker Image"**
4. Enter: `ollama/ollama:latest`
5. Go to **Variables**:

```
OLLAMA_MODELS=/root/.ollama
```

6. Add persistent **Volume**:
   - Mount path: `/root/.ollama`
   - Size: 10GB
7. **Deploy** and wait for Ollama to start
8. **Pull the model**: Click **"Shell"** tab and run:

```bash
ollama pull llama3
```

#### 3.5 Deploy Python Transcription Service

**Option A: Add to backend Dockerfile**

Update `backend/Dockerfile`:

```dockerfile
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline
COPY src src
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-jammy
RUN apt-get update && apt-get install -y python3 python3-pip
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
COPY transcript_service.py .
COPY requirements.txt .
RUN pip3 install -r requirements.txt
EXPOSE 8080 5000
CMD java -jar app.jar & python3 transcript_service.py
```

Create `backend/requirements.txt`:

```
youtube-transcript-api
flask
flask-cors
```

**Option B: Separate Railway Service** (recommended)

1. Create new service: **"+ New"** → **"Empty Service"**
2. Name: "transcription"
3. Settings → Docker Image: `python:3.11-slim`
4. Add your `transcript_service.py` via GitHub
5. Add start command in `railway.json` for this service

---

### Step 4: Configure Custom Domain (Optional)

1. Buy domain from [Namecheap](https://namecheap.com) (~$10/year)
2. In Railway, go to **Frontend service** → **"Settings"** → **"Domains"**
3. Click **"Custom Domain"**
4. Enter your domain: `lexicon.yourdomain.com`
5. Add CNAME record in Namecheap DNS:
   - Type: `CNAME`
   - Host: `@` (or subdomain)
   - Value: Railway provides this
6. Repeat for backend: `api.yourdomain.com`

---

## 💰 Cost Breakdown

### Railway Pricing (Pay-as-you-go)

| Service | Estimate |
|---------|----------|
| **Backend** (Spring Boot) | $5-8/month |
| **Frontend** (React) | $0-2/month |
| **MySQL Database** | $5-8/month |
| **Ollama** (CPU-only) | $5-10/month |
| **Transcription Service** | $2-5/month |
| **Total** | **~$17-33/month** |

**Note**: Railway gives **$5 free credit/month** for hobby tier

### Additional Costs

- **Domain**: $10-15/year (optional, Railway provides free subdomain)
- **YouTube API**: Free (10,000 quota/day)

---

## 🎯 Alternative Options

### Option 2: Render.com (~$20-30/month)
- Similar to Railway
- Slightly cheaper for static sites
- Good for backend + database
- **Setup**: Almost identical to Railway

### Option 3: DigitalOcean App Platform (~$25-35/month)
- More control than Railway/Render
- Need to configure more manually
- Good for scaling later
- **Best for**: When you need more customization

### Option 4: VPS (DigitalOcean Droplet) (~$12-24/month)
- **Pros**: Cheapest option, full control
- **Cons**: Requires Linux/DevOps knowledge
- **Good for**: If you're comfortable with Docker/nginx
- **Cost**: $12/month (2GB RAM) + $5/month managed MySQL

### Option 5: AWS/GCP/Azure (Free Tier then ~$20-50/month)
- **Pros**: Most scalable, professional
- **Cons**: Complex setup, harder to manage
- **Good for**: Production-grade apps
- **Not recommended**: For first deployment (overkill)

---

## ⚠️ Important Notes

### 1. Ollama AI Model
Railway runs on **CPU** (no GPU). Ollama will work but **slower** (~5-10s per request vs 1-2s with GPU).

**Solutions**:
- Use smaller model: `ollama pull llama3:8b-instruct-q4_0` (faster)
- Or use external AI API: OpenAI/Anthropic ($0.01-0.02 per request)

### 2. Large Files
Your `vosk-model` and `faster-whisper` models are large:
- **Don't commit to GitHub** (add to `.gitignore`)
- Download at runtime or use external storage (AWS S3)

### 3. Environment Variables Security
**Never commit** to GitHub:
- `YOUTUBE_API_KEY`
- `JWT_SECRET`
- Database passwords
- Use Railway's environment variables UI

### 4. Database Migrations
Railway creates new MySQL instance. You'll need to:
- Run schema migrations
- Import initial data (if any)

---

## 🧪 Testing Deployment

### Before Going Live

1. **Test locally with production mode**:

```bash
# Backend
cd backend
./mvnw clean package
java -jar target/*.jar --spring.profiles.active=prod

# Frontend
cd frontend-2/lexicon
npm run build
npx serve -s dist
```

2. **Check all API endpoints** work
3. **Test Ollama integration**
4. **Verify YouTube search** works
5. **Test transcription service**

---

## 📚 Next Steps After Deployment

1. **Set up monitoring**: Railway provides basic logs
2. **Add error tracking**: Sentry.io (free tier)
3. **Set up backups**: Railway auto-backs up database
4. **Configure HTTPS**: Automatic on Railway
5. **Set up CI/CD**: Auto-deploy on git push (Railway does this)

---

## 🆘 Troubleshooting

### Backend won't start
- Check logs in Railway dashboard
- Verify DATABASE_URL is set
- Check Java version (needs 21)

### Ollama not responding
- Increase memory allocation in Railway
- Check if model is downloaded: `ollama list`
- Pull model manually in Shell tab

### Frontend can't reach backend
- Verify CORS settings in backend
- Check VITE_API_URL matches backend URL
- Ensure backend service is running

### Out of memory
- Upgrade Railway plan ($10 → $20/month)
- Or optimize Ollama model size

---

## 📞 Support

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: Join for quick help
- **GitHub Issues**: Create if you find bugs

---

## ✅ Quick Start Checklist

- [ ] Code pushed to GitHub
- [ ] `.gitignore` updated (exclude large files)
- [ ] `application-prod.properties` created
- [ ] `.env.production` created for frontend
- [ ] `railway.json` files added
- [ ] Railway account created
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] MySQL database added
- [ ] Ollama service deployed
- [ ] Environment variables configured
- [ ] Ollama model pulled
- [ ] Custom domain configured (optional)
- [ ] Test all features work online
- [ ] 🎉 Go live!

---

## 🚀 Estimated Setup Time

- **Preparation**: 30-60 minutes
- **First deployment**: 30-45 minutes
- **Configuration & testing**: 30-60 minutes
- **Total**: 2-3 hours

**After first deployment**: Updates take < 5 minutes (auto-deploy on push)

---

Good luck with your deployment! 🎊
