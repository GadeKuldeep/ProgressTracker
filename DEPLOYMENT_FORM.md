# ZenPT Deployment - Manual Configuration Form

## NETLIFY - Frontend Deployment

### Site Configuration
```
Team:                    JCOE
Project Name:            ZenPT
Repository:              GadeKuldeep/ProgressTracker
Branch:                  main
```

### Build Settings
```
Base directory:          frontend
Build command:           npm run build
Publish directory:       dist
Functions directory:     frontend/functions
```

### Environment Variables
```
Variable Name:           VITE_API_URL
Variable Value:          https://zenpt-api.onrender.com

Variable Name:           NODE_ENV
Variable Value:          production
```

### After Deployment
```
Frontend URL:            https://zenpt.netlify.app
```

---

## RENDER - Backend Deployment

### Service Configuration
```
Service Name:            zenpt-api
Runtime:                 Node
Region:                  [Choose closest to users]
Branch:                  main
Repository:              GadeKuldeep/ProgressTracker
Plan Type:               Free
```

### Build Settings
```
Build Command:           cd backend && npm install
Start Command:           cd backend && npm start
```

### Environment Variables
```
Variable Name:           PORT
Variable Value:          5000

Variable Name:           NODE_ENV
Variable Value:          production

Variable Name:           JWT_EXPIRE
Variable Value:          30d

Variable Name:           CLIENT_URL
Variable Value:          https://zenpt.netlify.app

Variable Name:           JWT_SECRET
Variable Value:          zen_progress_tracker_secret_key_2024_ultra_secure

Variable Name:           MONGODB_URI
Variable Value:          mongodb+srv://gadekuldeep25_db_user:Yoc3gSgKTXFBrkDS@cluster1.5dvmfcv.mongodb.net/zen-progress-tracker
```

### After Deployment
```
Backend API URL:         https://zenpt-api.onrender.com
Health Check:            https://zenpt-api.onrender.com/api/health
```

---

## GITHUB REPOSITORY

```
Repository URL:          https://github.com/GadeKuldeep/ProgressTracker
Branch:                  main
Owner:                   GadeKuldeep
```

---

## MONGODB ATLAS

```
Connection String:       mongodb+srv://gadekuldeep25_db_user:Yoc3gSgKTXFBrkDS@cluster1.5dvmfcv.mongodb.net/zen-progress-tracker
Database Name:           zen-progress-tracker
Username:                gadekuldeep25_db_user
Password:                Yoc3gSgKTXFBrkDS
Cluster:                 cluster1
```

### IP Whitelist
```
Add IP Address:          0.0.0.0/0 (Allow from anywhere)
OR
Add Render IP:           [Get from Render dashboard after creation]
```

---

## TESTING CHECKLIST

### Frontend (After Netlify Deployment)
```
✓ Visit: https://zenpt.netlify.app
✓ Check all pages load
✓ Check no 404 errors
```

### Backend (After Render Deployment)
```
✓ Visit: https://zenpt-api.onrender.com/api/health
✓ Expected Response: {"status":"ok","message":"禅 — Server is running peacefully"}
```

### Integration Test
```
✓ Frontend loads
✓ Login/Register works
✓ API calls go through
✓ No CORS errors in browser console
```

---

## QUICK LINKS FOR MANUAL SETUP

```
Netlify Dashboard:       https://app.netlify.com
Render Dashboard:        https://render.com
MongoDB Atlas:           https://cloud.mongodb.com
GitHub Repository:       https://github.com/GadeKuldeep/ProgressTracker
```

---

## NOTES FOR DEPLOYMENT

1. **MongoDB IP Whitelist** - Must be done BEFORE backend deployment
2. **Netlify URL** - Update in Render env variable: CLIENT_URL
3. **Render URL** - Update in Netlify env variable: VITE_API_URL
4. **JWT Secret** - Keep secure, same value in Render
5. **Build takes 3-5 minutes** on first deployment
6. **Free tier works** for both Netlify and Render
