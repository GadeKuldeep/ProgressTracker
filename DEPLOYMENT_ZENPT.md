# ZenPT - Deployment Configuration Guide

## Project Details
- **Project Name:** ZenPT
- **Frontend URL:** https://zenpt.netlify.app
- **Team:** JCOE
- **Owner:** GadeKuldeep
- **Backend Service:** zenpt-api (Render)
- **Repository:** https://github.com/GadeKuldeep/ProgressTracker
- **Main Branch:** main

---

## Frontend Deployment (Netlify)

### Configuration Summary
```
Branch: main
Base Directory: frontend
Build Command: npm run build
Publish Directory: frontend/dist
Functions Directory: frontend/functions
```

### Step 1: Connect to Netlify
- Go to https://app.netlify.com
- Click "Add new site" → "Import an existing project"
- Select "GitHub" and authorize
- Choose `GadeKuldeep/ProgressTracker` repository
- Select `main` branch

### Step 2: Configure Build Settings
These should auto-populate, but verify:
```
Base directory: frontend
Build command: npm run build
Publish directory: frontend/dist
Functions directory: frontend/functions
```

### Step 3: Set Environment Variables
In Netlify Dashboard → Site Settings → Build & Deploy → Environment:

```
VITE_API_URL = https://zenpt-api.onrender.com
NODE_ENV = production
```

### Step 4: Deploy
Click "Deploy zenpt" to start deployment.

**Deployment Link:** https://zenpt.netlify.app

---

## Backend Deployment (Render)

### Configuration Summary
```
Service Name: zenpt-api
Runtime: Node.js
Build Command: cd backend && npm install
Start Command: cd backend && npm start
Plan: Free (or paid if needed)
```

### Step 1: Create Render Account
- Go to https://render.com
- Sign up and verify email
- Link GitHub account

### Step 2: Create Web Service
- Click "New +" → "Web Service"
- Select `GadeKuldeep/ProgressTracker` from GitHub
- Name: `zenpt-api`
- Region: Choose closest to users
- Branch: `main`
- Runtime: `Node`
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && npm start`
- Plan: Free

### Step 3: Set Environment Variables
In Render Dashboard → Environment → Add Environment Variable:

```
MONGODB_URI = mongodb+srv://gadekuldeep25_db_user:Yoc3gSgKTXFBrkDS@cluster1.5dvmfcv.mongodb.net/zen-progress-tracker
JWT_SECRET = zen_progress_tracker_secret_key_2024_ultra_secure
JWT_EXPIRE = 30d
CLIENT_URL = https://zenpt.netlify.app
NODE_ENV = production
PORT = 5000
```

### Step 4: Deploy
Click "Create Web Service" to deploy.

**Backend API URL:** https://zenpt-api.onrender.com

---

## Environment Variables Quick Reference

### Frontend (.env or Netlify)
| Variable | Value | Notes |
|----------|-------|-------|
| VITE_API_URL | https://zenpt-api.onrender.com | Backend API endpoint |
| NODE_ENV | production | Production environment |

### Backend (.env or Render)
| Variable | Value | Notes |
|----------|-------|-------|
| MONGODB_URI | `[Your MongoDB Atlas Connection]` | Database connection |
| JWT_SECRET | `[Your JWT Secret]` | Keep secure, change if needed |
| JWT_EXPIRE | 30d | Token expiration time |
| CLIENT_URL | https://zenpt.netlify.app | Frontend URL for CORS |
| NODE_ENV | production | Production environment |
| PORT | 5000 | Server port |

---

## Verification Checklist

### Frontend
- [ ] Repository connected to Netlify
- [ ] Build settings configured correctly
- [ ] VITE_API_URL environment variable set
- [ ] Site deployed successfully
- [ ] App loads at https://zenpt.netlify.app
- [ ] All pages accessible
- [ ] No 404 errors (check redirects working)

### Backend
- [ ] Repository connected to Render
- [ ] Build settings configured
- [ ] All environment variables set
- [ ] Service deployed successfully
- [ ] Health check endpoint responds: `GET https://zenpt-api.onrender.com/api/health`
- [ ] API endpoints accessible

### Integration
- [ ] Frontend can make API calls to backend
- [ ] Authentication works (login/register)
- [ ] CORS not blocking requests
- [ ] Data persisting in MongoDB

---

## Testing After Deployment

### Test Frontend
```bash
# Visit these URLs
https://zenpt.netlify.app
https://zenpt.netlify.app/dashboard
https://zenpt.netlify.app/analytics
```

### Test Backend API
```bash
# Test health check
curl https://zenpt-api.onrender.com/api/health

# Response should be:
{"status":"ok","message":"禅 — Server is running peacefully"}
```

### Test API Endpoints
```bash
# Test auth endpoint
curl -X POST https://zenpt-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## Troubleshooting

### CORS Errors
- ✅ **Solution:** Verify `CLIENT_URL` in backend matches `https://zenpt.netlify.app`
- Check Render environment variables

### MongoDB Connection Failed
- ✅ **Solution:** 
  - Verify `MONGODB_URI` is correct
  - Check IP whitelist in MongoDB Atlas (allow 0.0.0.0/0 or add Render IPs)
  - Ensure MongoDB Atlas cluster is running

### Build Fails on Netlify
- ✅ **Solution:**
  - Check `package.json` has all dependencies
  - Verify build command: `npm run build`
  - Check deployment logs in Netlify Dashboard
  - Ensure `.gitignore` doesn't exclude needed files

### API Not Responding
- ✅ **Solution:**
  - Check Render service is running (Dashboard → Services)
  - Verify environment variables set correctly
  - Check backend logs: Render → Logs tab
  - Ensure `PORT=5000` is set in environment

### Environment Variables Not Reading
- ✅ **Solution:**
  - Ensure variables are set in correct dashboard (Netlify vs Render)
  - Redeploy after adding variables
  - Check spelling matches `.env.example`

---

## Monitoring & Maintenance

### Netlify
- Dashboard: https://app.netlify.com
- View deployment history and logs
- Automatic deployments on git push to main
- Manual redeploy option available

### Render
- Dashboard: https://dashboard.render.com
- View service logs
- Monitor resource usage
- Auto-deploy on git push

### MongoDB Atlas
- Dashboard: https://cloud.mongodb.com
- Monitor database usage
- Check backups
- View connection activity

---

## Next Steps

1. ✅ Update git configuration files (done)
2. ✅ Push to GitHub (done)
3. **→ Connect Netlify for frontend** (do this now)
4. **→ Connect Render for backend** (do this next)
5. → Test all endpoints
6. → Monitor logs and performance

---

## Useful Links

- **Frontend:** https://zenpt.netlify.app
- **Backend:** https://zenpt-api.onrender.com
- **API Health:** https://zenpt-api.onrender.com/api/health
- **Netlify Dashboard:** https://app.netlify.com
- **Render Dashboard:** https://dashboard.render.com
- **MongoDB Atlas:** https://cloud.mongodb.com
- **GitHub Repository:** https://github.com/GadeKuldeep/ProgressTracker

---

**Last Updated:** May 25, 2026  
**Status:** Ready for Production Deployment
