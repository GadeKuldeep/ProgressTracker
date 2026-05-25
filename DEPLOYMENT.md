# Zen Progress Tracker - Deployment Guide

## Project Overview
A full-stack application for tracking progress, habits, goals, and reflections with productivity features like Pomodoro timer.

**Tech Stack:**
- **Backend:** Node.js + Express + MongoDB
- **Frontend:** React 19 + Vite + TailwindCSS
- **Authentication:** JWT + bcryptjs
- **UI Effects:** Framer Motion, Three.js, React Hot Toast

## Deployment Platforms

### Option 1: Render + Netlify (Recommended)

#### Backend Deployment (Render)
1. **Create Render Account:** https://render.com
2. **Connect GitHub Repository:** Link your GitHub account to Render
3. **Create Web Service:**
   - Name: `progress-tracker-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Region: Choose closest to your users

4. **Set Environment Variables in Render Dashboard:**
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   CLIENT_URL=https://progress-tracker-frontend.netlify.app
   NODE_ENV=production
   ```

5. **Deploy:** Render will automatically deploy on git push to main

#### Frontend Deployment (Netlify)
1. **Create Netlify Account:** https://netlify.com
2. **Connect GitHub Repository:** Connect to your GitHub account
3. **New Site from Git:**
   - Repository: Your ProgressTracker repo
   - Owner: Select your account
   - Branch: `main`

4. **Build Settings:**
   - Build Command: `cd frontend && npm run build`
   - Publish Directory: `frontend/dist`

5. **Set Environment Variables in Netlify Dashboard:**
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

6. **Deploy:** Netlify will automatically deploy on git push

### Option 2: Single Render Instance (Both Frontend & Backend)

If you prefer to host everything on Render:

1. Create a Web Service with the following:
   - Build Command: `cd frontend && npm install && npm run build && cd ../backend && npm install`
   - Start Command: `cd backend && npm start`
   - Add a Static Site service for the frontend from `frontend/dist`

### Option 3: Docker Deployment (Advanced)

Create a `Dockerfile` in the root:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm install
RUN cd backend && npm install
RUN cd frontend && npm install && npm run build

# Expose port
EXPOSE 5000

# Start backend
CMD ["npm", "start", "--prefix", "backend"]
```

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account (free tier available)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/ProgressTracker.git
   cd ProgressTracker
   ```

2. **Install dependencies:**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables:**

   **Backend (.env):**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your MongoDB URI and JWT secret
   ```

   **Frontend (.env.local):**
   ```bash
   cp frontend/.env.example frontend/.env.local
   # Edit frontend/.env.local with your API URL
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   # Or separately:
   npm run backend  # Terminal 1: http://localhost:5000
   npm run frontend # Terminal 2: http://localhost:5173
   ```

## Production Checklist

- [ ] Set environment variables on deployment platform
- [ ] Configure MongoDB Atlas IP whitelist
- [ ] Update CORS origin to production frontend URL
- [ ] Enable HTTPS/SSL
- [ ] Set up database backups
- [ ] Configure rate limiting appropriately
- [ ] Set up monitoring/logging (optional)
- [ ] Test authentication flow end-to-end
- [ ] Test all API endpoints
- [ ] Verify file uploads (if applicable)

## Environment Variables Reference

### Backend
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Set to 'production'
- `PORT` - Server port (default: 5000)
- `CLIENT_URL` - Frontend URL for CORS

### Frontend
- `VITE_API_URL` - Backend API URL

## Troubleshooting

### CORS Errors
- Ensure `CLIENT_URL` in backend matches your frontend deployment URL
- Frontend's `VITE_API_URL` should point to your backend

### MongoDB Connection Errors
- Whitelist your deployment IP in MongoDB Atlas
- Use connection string from MongoDB Atlas dashboard

### Build Fails on Netlify/Render
- Ensure all dependencies are listed in package.json
- Check that build commands are correct
- Verify environment variables are set

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET/POST /api/goals` - Goal management
- `GET/POST /api/habits` - Habit tracking
- `GET/POST /api/reflections` - Reflection notes
- `GET/POST /api/pomodoro` - Pomodoro sessions
- `GET /api/analytics` - Analytics data

## Support & Documentation

For detailed setup instructions or issues, refer to:
- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
