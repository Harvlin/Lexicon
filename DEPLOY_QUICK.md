# Deployment Quick Reference

## 🚀 Recommended: Railway.app

### Cost: ~$15-25/month
### Setup Time: 2-3 hours
### Difficulty: ⭐⭐☆☆☆ (Easy)

---

## Quick Deploy Steps

### 1. Push to GitHub (10 mins)

```bash
cd C:\Lexicon

# Update .gitignore (already configured)
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy on Railway (20 mins)

1. **Sign up**: [railway.app](https://railway.app)
2. **Create Project** → Deploy from GitHub
3. **Add Services**:
   - Backend (Spring Boot) - Root: `/backend`
   - Frontend (React) - Root: `/frontend-2/lexicon`
   - MySQL Database
   - Ollama (Docker: `ollama/ollama:latest`)

### 3. Configure Environment Variables (15 mins)

**Backend Service:**
```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=${{MySQL.DATABASE_URL}}
YOUTUBE_API_KEY=your_youtube_key
JWT_SECRET=your_long_random_secret_32chars
FRONTEND_URL=https://your-frontend.railway.app
OLLAMA_URL=http://ollama:11434
PORT=8080
```

**Frontend Service:**
```
VITE_API_URL=https://your-backend.railway.app
```

**Ollama Service:**
- Pull model: Open Shell → `ollama pull llama3`

### 4. Test & Go Live (30 mins)

- Test backend: `https://your-backend.railway.app/api/health`
- Test frontend: `https://your-frontend.railway.app`
- Test all features
- 🎉 Done!

---

## Alternative: Render.com

Similar process, slightly different UI:
1. [render.com](https://render.com)
2. Create Web Service (backend)
3. Create Static Site (frontend)
4. Add PostgreSQL/MySQL database
5. Configure env vars

**Cost**: ~$20-30/month

---

## Alternative: DigitalOcean (VPS)

For advanced users comfortable with Linux:
1. Create Droplet ($12/month)
2. Install Docker & Docker Compose
3. Use your `docker-compose.yaml`
4. Set up nginx reverse proxy
5. Configure SSL with Let's Encrypt

**Cost**: ~$12-17/month
**Difficulty**: ⭐⭐⭐⭐☆ (Hard)

---

## Cost Comparison

| Platform | Monthly Cost | Ease of Use | Best For |
|----------|-------------|-------------|----------|
| **Railway** | $15-25 | ⭐⭐⭐⭐⭐ | Recommended |
| **Render** | $20-30 | ⭐⭐⭐⭐☆ | Good alternative |
| **DigitalOcean App** | $25-35 | ⭐⭐⭐☆☆ | More control |
| **VPS** | $12-17 | ⭐⭐☆☆☆ | Budget + skills |
| **AWS/GCP** | $20-50+ | ⭐⭐☆☆☆ | Enterprise |

---

## Important Notes

### ⚠️ Before Deployment

- [ ] Get YouTube API key: [Google Cloud Console](https://console.cloud.google.com)
- [ ] Generate JWT secret: `openssl rand -hex 32`
- [ ] Update `.gitignore` (exclude large models)
- [ ] Test locally with production build

### ⚠️ After Deployment

- [ ] Update CORS in backend (add frontend URL)
- [ ] Update frontend `.env.production` with backend URL
- [ ] Pull Ollama model: `ollama pull llama3`
- [ ] Test YouTube search works
- [ ] Test AI summary generation
- [ ] Set up custom domain (optional)

### ⚠️ Known Issues

1. **Ollama slow on CPU**: Use smaller model or external AI API
2. **Large files**: Don't commit models to Git (400MB+)
3. **Memory limits**: May need to upgrade plan for Ollama

---

## Support

- **Full Guide**: See `DEPLOYMENT_GUIDE.md`
- **Railway Docs**: https://docs.railway.app
- **Issues**: Create GitHub issue

---

## Estimated Costs (Annual)

- **Railway**: $180-300/year
- **Domain**: $10-15/year (optional)
- **Total**: ~$190-315/year

**Cheaper than**:
- Netflix: $240/year
- Spotify: $144/year
- Your own learning platform: **Priceless** 🎓✨
