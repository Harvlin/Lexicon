# 🚀 Deployment Checklist

## ✅ Pre-Deployment (30 mins)

### Code Preparation
- [ ] Code pushed to GitHub repository
- [ ] `.gitignore` excludes large files (ollama/, faster-whisper/, vosk-model*)
- [ ] `application-prod.properties` created in backend
- [ ] `.env.production` created in frontend
- [ ] `railway.json` added to backend folder
- [ ] `railway.json` added to frontend folder
- [ ] `serve` package added to frontend dependencies
- [ ] `requirements.txt` created for Python service

### API Keys & Secrets
- [ ] YouTube API key obtained from Google Cloud Console
- [ ] JWT secret generated (32+ characters): `openssl rand -hex 32`
- [ ] Database password ready (or use Railway auto-generated)

### Local Testing
- [ ] Backend builds successfully: `./mvnw clean package`
- [ ] Frontend builds successfully: `npm run build`
- [ ] All tests pass
- [ ] Production environment variables tested locally

---

## ✅ Railway Setup (45 mins)

### Account & Project
- [ ] Railway account created at railway.app
- [ ] GitHub connected to Railway
- [ ] New project created from GitHub repo

### Backend Deployment
- [ ] Backend service created
- [ ] Root directory set to `/backend`
- [ ] Environment variables configured:
  - [ ] `SPRING_PROFILES_ACTIVE=prod`
  - [ ] `YOUTUBE_API_KEY=...`
  - [ ] `JWT_SECRET=...`
  - [ ] `FRONTEND_URL=...`
  - [ ] `OLLAMA_URL=http://ollama:11434`
  - [ ] `DATABASE_URL=${{MySQL.DATABASE_URL}}`
- [ ] Deployment successful
- [ ] Health check endpoint working: `/api/health`

### Database Setup
- [ ] MySQL database added to project
- [ ] Database connected to backend service
- [ ] Schema created (auto via Hibernate)
- [ ] Test data inserted (optional)

### Frontend Deployment
- [ ] Frontend service created
- [ ] Root directory set to `/frontend-2/lexicon`
- [ ] Environment variables configured:
  - [ ] `VITE_API_URL=https://your-backend.railway.app`
- [ ] Deployment successful
- [ ] Website accessible

### Ollama Service
- [ ] Ollama service created (Docker: `ollama/ollama:latest`)
- [ ] Volume mounted at `/root/.ollama` (10GB)
- [ ] Service started successfully
- [ ] Model pulled via Shell: `ollama pull llama3`
- [ ] Model verified: `ollama list`

### Python Transcription (Optional)
- [ ] Separate service created OR
- [ ] Included in backend Dockerfile
- [ ] Flask service running on port 5000
- [ ] Accessible from backend service

---

## ✅ Configuration (20 mins)

### CORS & URLs
- [ ] Backend CORS updated with frontend URL
- [ ] Frontend API URL points to backend
- [ ] Internal service URLs configured (ollama, transcription)

### Security
- [ ] JWT secret is secure (32+ chars)
- [ ] No secrets in GitHub repository
- [ ] All environment variables use Railway's variable system
- [ ] Database credentials secured

### Optimization
- [ ] Ollama using optimized model (q4_0 quantization)
- [ ] Production logging level set (INFO)
- [ ] Database connection pooling configured
- [ ] File upload limits set appropriately

---

## ✅ Testing (30 mins)

### Backend Tests
- [ ] Health endpoint: `GET /api/health`
- [ ] Authentication: `POST /api/auth/register`
- [ ] YouTube search: Works without errors
- [ ] Ollama integration: AI summaries generate
- [ ] Transcription service: Video transcripts fetch
- [ ] Database operations: Save/retrieve data

### Frontend Tests
- [ ] Homepage loads
- [ ] User registration works
- [ ] User login works
- [ ] Dashboard displays
- [ ] Library search works
- [ ] Video lesson page loads
- [ ] AI chat responds
- [ ] Flashcards display
- [ ] Quiz works

### Integration Tests
- [ ] Complete user flow: Register → Process preference → View materials
- [ ] Favorite videos save
- [ ] Progress tracking works
- [ ] Schedule creation works
- [ ] All API calls succeed

---

## ✅ Post-Deployment (30 mins)

### Monitoring
- [ ] Railway logs checked for errors
- [ ] Database connections stable
- [ ] Ollama responses within acceptable time
- [ ] No memory/CPU alerts

### Documentation
- [ ] Backend URL documented
- [ ] Frontend URL documented
- [ ] Admin credentials saved securely
- [ ] API documentation updated

### Optional Enhancements
- [ ] Custom domain configured
- [ ] SSL certificate verified (auto on Railway)
- [ ] Error tracking set up (Sentry.io)
- [ ] Analytics added (Google Analytics)
- [ ] Performance monitoring (New Relic/Datadog)

---

## ✅ Go Live (10 mins)

### Final Checks
- [ ] All features tested end-to-end
- [ ] No console errors in browser
- [ ] No server errors in logs
- [ ] Mobile responsive works
- [ ] Cross-browser tested (Chrome, Firefox, Safari)

### Communication
- [ ] Share URL with test users
- [ ] Gather initial feedback
- [ ] Monitor for first 24 hours
- [ ] Fix critical bugs immediately

### Backup & Recovery
- [ ] Database backup confirmed (Railway auto-backups)
- [ ] Environment variables backed up locally
- [ ] Deployment process documented
- [ ] Rollback plan ready

---

## 🎉 Post-Launch

### Week 1
- [ ] Monitor user feedback
- [ ] Fix reported bugs
- [ ] Optimize slow queries
- [ ] Adjust Ollama model if too slow

### Month 1
- [ ] Review Railway usage/costs
- [ ] Optimize resource allocation
- [ ] Add new features
- [ ] Improve performance

### Ongoing
- [ ] Keep dependencies updated
- [ ] Monitor security vulnerabilities
- [ ] Scale resources as needed
- [ ] Add new AI models/features

---

## 📊 Success Metrics

- ✅ **Uptime**: >99% (Railway provides this)
- ✅ **Response time**: Backend <2s, Frontend <1s
- ✅ **AI processing**: 30-60s per request
- ✅ **User satisfaction**: Test with 5-10 users first
- ✅ **Cost**: Within $15-30/month budget

---

## 🆘 Troubleshooting

### Backend Issues
- **503 errors**: Check Railway logs, may need to increase memory
- **Database errors**: Verify DATABASE_URL is set correctly
- **Ollama timeout**: Pull smaller model or increase timeout

### Frontend Issues
- **404 on routes**: Configure serve to redirect to index.html
- **API errors**: Verify VITE_API_URL is correct
- **CORS errors**: Update backend allowed origins

### Performance Issues
- **Slow Ollama**: Use q4_0 model or switch to external API
- **High memory**: Upgrade Railway plan or optimize queries
- **Slow database**: Add indexes, optimize queries

---

## 📞 Support Resources

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Stack Overflow**: Tag with 'spring-boot', 'react', 'railway'
- **GitHub Issues**: Create in your repository

---

## ✨ Congratulations!

Once all items are checked, your Lexicon platform is **LIVE** and accessible worldwide! 🌍

**Total Setup Time**: ~2-3 hours
**Monthly Cost**: ~$15-25
**Value**: Priceless! 🎓

---

*Last updated: November 11, 2025*
