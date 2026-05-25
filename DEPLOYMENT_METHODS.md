# ZenPT Deployment - Alternative Methods

## Frontend Deployment on Netlify (Updated Methods)

### Method 1: Direct GitHub Connection (Recommended)
1. Go to **https://app.netlify.com**
2. On the main dashboard, look for **"New site from Git"** button
3. Click **"Connect to Git provider"**
4. Select **GitHub** and authorize
5. Search for and select **`GadeKuldeep/ProgressTracker`**
6. Configure build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. Click **"Deploy site"**

### Method 2: Link Repository on Dashboard
1. Go to **https://app.netlify.com/teams/JCOE**
2. Look for **"Add new site"** or **"New"** button (top left area)
3. Select **"Import an existing project"**
4. Choose **GitHub**
5. Grant permissions if prompted
6. Select **`ProgressTracker`** repo
7. Configure same build settings as Method 1
8. Deploy

### Method 3: From GitHub
1. Go to **https://github.com/GadeKuldeep/ProgressTracker**
2. Look for **Netlify** deployment options (may be in Actions or settings)
3. Or: Netlify app in GitHub Marketplace
4. Click **"Connect repository"**
5. Authorize and configure

### Method 4: Drag & Drop (Temporary)
1. Build frontend locally:
   ```powershell
   cd frontend
   npm run build
   ```
2. Go to **https://app.netlify.com**
3. Drag the `frontend/dist` folder to the browser window
4. Deploy (temporary, won't auto-update on git push)

### Method 5: Using Netlify CLI
```powershell
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to project
cd c:\Users\USER\Desktop\ProgressTracker

# Connect to Netlify
netlify connect

# Deploy
netlify deploy --prod --dir frontend/dist
```

---

## Quick Checklist for Netlify

- [ ] Go to https://app.netlify.com
- [ ] Find the button to add/create new site (may say "New", "Add site", "Import project")
- [ ] Connect GitHub repository
- [ ] Set base directory to `frontend`
- [ ] Set build command to `npm run build`
- [ ] Set publish directory to `dist`
- [ ] Add environment variable: `VITE_API_URL=https://zenpt-api.onrender.com`
- [ ] Deploy

---

## If You're in JCOE Team

1. Go to **https://app.netlify.com/teams/JCOE**
2. Look for **"New site"** button in the team dashboard
3. Click **"Import from Git"** or **"Connect to Git"**
4. Follow connection steps

---

## Backend Deployment on Render (No Changes Needed)

This process is straightforward:

1. Go to **https://render.com** (create account if needed)
2. Click **"New +"** in top left
3. Select **"Web Service"**
4. Click **"Build and deploy from Git repository"**
5. Authorize GitHub if needed
6. Select **`GadeKuldeep/ProgressTracker`**
7. Fill in:
   - **Name:** `zenpt-api`
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Region:** Select closest to you
8. Click **"Create Environment Variables"** and add:
   ```
   MONGODB_URI=mongodb+srv://gadekuldeep25_db_user:Yoc3gSgKTXFBrkDS@cluster1.5dvmfcv.mongodb.net/zen-progress-tracker
   JWT_SECRET=zen_progress_tracker_secret_key_2024_ultra_secure
   JWT_EXPIRE=30d
   CLIENT_URL=https://zenpt.netlify.app
   NODE_ENV=production
   PORT=5000
   ```
9. Click **"Create Web Service"**

---

## After Both Are Deployed

### Update Frontend Env Variable
1. Go to **Netlify Site Settings**
2. Find **Build & Deploy** → **Environment**
3. Update `VITE_API_URL` to your deployed Render URL
4. Trigger a redeploy

### Test API Connection
```powershell
# Test backend health
curl https://zenpt-api.onrender.com/api/health

# Test from browser
https://zenpt-api.onrender.com/api/health
```

### If API Calls Still Fail
- Check Render logs for errors
- Verify `CLIENT_URL` in Render env matches Netlify URL
- Check CORS settings in backend `server.js`

---

## MongoDB Atlas Setup (Important!)

Before deploying backend, whitelist Render's IP:

1. Go to **https://cloud.mongodb.com**
2. Select your cluster: **cluster1**
3. Click **"Network Access"** → **"Add IP Address"**
4. Add Render's IP or select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ Less secure but works for testing
5. Click **"Confirm"**

---

## Still Having Issues?

### Check Netlify Dashboard
- Look for any blue buttons like **"Create a new site"** or **"Get started"**
- Try scrolling or refreshing the page
- Check if your team (`JCOE`) is selected in the top left

### Alternative: Use Netlify CLI
```powershell
npm install -g netlify-cli
netlify login
netlify connect
netlify deploy --prod
```

### Contact Information
- **Netlify Support:** https://support.netlify.com
- **Render Support:** https://support.render.com
- **MongoDB Support:** https://www.mongodb.com/support

---

**Status:** Deployment configurations ready in GitHub ✅  
**Next:** Deploy using one of the methods above
