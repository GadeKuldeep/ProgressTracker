# ZenPT Deployment Quick Reference

## 🚀 Live URLs
| Service | URL | Status |
|---------|-----|--------|
| Frontend | https://zenpt.netlify.app | 🔄 Deploying |
| Backend API | https://zenpt-api.onrender.com | ⏳ Pending |
| Health Check | https://zenpt-api.onrender.com/api/health | ⏳ Pending |

---

## 📋 Frontend (Netlify)

```
Team: JCOE
Project: ZenPT
Base: frontend
Build: npm run build
Publish: frontend/dist
```

**Env Variables:**
```
VITE_API_URL=https://zenpt-api.onrender.com
NODE_ENV=production
```

---

## 🔧 Backend (Render)

```
Name: zenpt-api
Runtime: Node.js
Build: cd backend && npm install
Start: cd backend && npm start
Plan: Free
```

**Env Variables:**
```
MONGODB_URI=mongodb+srv://gadekuldeep25_db_user:Yoc3gSgKTXFBrkDS@cluster1.5dvmfcv.mongodb.net/zen-progress-tracker
JWT_SECRET=zen_progress_tracker_secret_key_2024_ultra_secure
JWT_EXPIRE=30d
CLIENT_URL=https://zenpt.netlify.app
NODE_ENV=production
PORT=5000
```

---

## 📝 Deployment Checklist

### Frontend (Netlify)
- [ ] Go to https://app.netlify.com
- [ ] Click "Add new site" → "Import existing project"
- [ ] Connect GitHub & select `GadeKuldeep/ProgressTracker`
- [ ] Base: `frontend`, Build: `npm run build`, Publish: `dist`
- [ ] Add env variables (see above)
- [ ] Click "Deploy"

### Backend (Render)
- [ ] Go to https://render.com
- [ ] Click "New +" → "Web Service"
- [ ] Select repository `GadeKuldeep/ProgressTracker`
- [ ] Name: `zenpt-api`, Branch: `main`
- [ ] Build: `cd backend && npm install`
- [ ] Start: `cd backend && npm start`
- [ ] Add env variables (see above)
- [ ] Click "Create"

---

## ✅ Verification

```bash
# Frontend loads
curl https://zenpt.netlify.app

# Backend responds
curl https://zenpt-api.onrender.com/api/health

# Should return:
# {"status":"ok","message":"禅 — Server is running peacefully"}
```

---

## 🔗 Direct Links

- **Netlify Dashboard:** https://app.netlify.com
- **Render Dashboard:** https://dashboard.render.com  
- **GitHub Repo:** https://github.com/GadeKuldeep/ProgressTracker
- **MongoDB Atlas:** https://cloud.mongodb.com

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| CORS Error | Check `CLIENT_URL` in Render env matches frontend URL |
| 404 on Netlify | Verify redirects in `netlify.toml` |
| MongoDB Connection Fails | Whitelist Render IP in MongoDB Atlas |
| API Not Responding | Check Render logs and env variables |

---

**Ready to deploy!** 🎉
