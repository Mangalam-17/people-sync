# PeopleSync Deployment Guide

## Architecture Overview
- **Backend:** Node.js/Express on Render
- **Frontend:** React/Vite on Vercel
- **Database:** MongoDB Atlas (Cloud)
- **Email:** Gmail SMTP

---

## Part 1: MongoDB Atlas Setup (Database)

### Step 1: Create MongoDB Atlas Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google or email
3. Choose **FREE** M0 cluster

### Step 2: Create Database Cluster
1. Click **"Build a Database"**
2. Choose **FREE Shared** cluster
3. Select cloud provider: **AWS**
4. Region: Choose closest to you (e.g., US East)
5. Cluster name: `peoplesync-cluster`
6. Click **"Create"**

### Step 3: Create Database User
1. **Security → Database Access**
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `peoplesync-admin`
5. Password: Click **"Autogenerate Secure Password"** (SAVE THIS!)
6. Database User Privileges: **Read and write to any database**
7. Click **"Add User"**

### Step 4: Whitelist IP Addresses
1. **Security → Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

### Step 5: Get Connection String
1. **Database → Connect**
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://peoplesync-admin:<password>@peoplesync-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name before `?`: 
   ```
   mongodb+srv://peoplesync-admin:YOUR_PASSWORD@peoplesync-cluster.xxxxx.mongodb.net/peoplesync?retryWrites=true&w=majority
   ```
7. **SAVE THIS CONNECTION STRING!**

---

## Part 2: Backend Deployment on Render

### Step 1: Prepare Backend for Deployment

#### 1.1: Update package.json
Open `/server/package.json` and ensure you have:

```json
{
  "name": "peoplesync-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "invite": "node scripts/createInvitation.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### 1.2: Create render.yaml (Optional but recommended)
Create `/server/render.yaml`:

```yaml
services:
  - type: web
    name: peoplesync-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

#### 1.3: Verify .gitignore
Ensure `/server/.gitignore` includes:

```
node_modules/
.env
.env.local
logs/
*.log
.DS_Store
```

### Step 2: Push to GitHub

```bash
cd /Users/mangalam/Desktop/PeopleSync

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "feat: Complete Modules 1-5 - Ready for deployment"

# Create repo on GitHub (go to github.com/new)
# Then link and push:
git remote add origin https://github.com/YOUR_USERNAME/peoplesync.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Render

#### 3.1: Create Render Account
1. Go to: https://render.com
2. Sign up with GitHub (recommended)
3. Authorize Render to access your repositories

#### 3.2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `peoplesync`
3. Configure service:
   - **Name:** `peoplesync-backend`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

#### 3.3: Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

```bash
NODE_ENV=production

# MongoDB
MONGODB_URI=mongodb+srv://peoplesync-admin:YOUR_PASSWORD@peoplesync-cluster.xxxxx.mongodb.net/peoplesync?retryWrites=true&w=majority

# JWT Secrets (generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters-long
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@peoplesync.com

# Frontend URL (will update after Vercel deployment)
FRONTEND_URL=https://your-app.vercel.app

# Port
PORT=8001

# CORS Origin (will update after Vercel deployment)
CORS_ORIGIN=https://your-app.vercel.app
```

**Important Notes:**
- For `EMAIL_PASSWORD`, use Gmail **App Password** (not your regular password)
  - Enable 2FA on Gmail
  - Go to: https://myaccount.google.com/apppasswords
  - Generate app password for "Mail"
  - Use that 16-character password

- Generate strong JWT secrets:
  ```bash
  # Run in terminal to generate random strings
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

#### 3.4: Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://peoplesync-backend.onrender.com`
4. **SAVE THIS URL!**

#### 3.5: Test Backend
```bash
# Test health endpoint
curl https://peoplesync-backend.onrender.com/api/v1/health

# Should return:
# {"success":true,"message":"PeopleSync API is running"}
```

---

## Part 3: Frontend Deployment on Vercel

### Step 1: Prepare Frontend for Deployment

#### 1.1: Update .env file
Open `/client/.env` and update:

```env
VITE_API_URL=https://peoplesync-backend.onrender.com
```

#### 1.2: Update vite.config.js (if needed)
Open `/client/vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
```

#### 1.3: Create vercel.json
Create `/client/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### 1.4: Verify package.json
Open `/client/package.json`:

```json
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Step 2: Commit Changes

```bash
cd /Users/mangalam/Desktop/PeopleSync

# Add changes
git add .

# Commit
git commit -m "chore: Configure for Vercel deployment"

# Push
git push origin main
```

### Step 3: Deploy on Vercel

#### 3.1: Create Vercel Account
1. Go to: https://vercel.com/signup
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your repositories

#### 3.2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository: `peoplesync`
3. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

#### 3.3: Add Environment Variables
Click **"Environment Variables"** and add:

```bash
VITE_API_URL=https://peoplesync-backend.onrender.com
```

#### 3.4: Deploy
1. Click **"Deploy"**
2. Wait for deployment (3-5 minutes)
3. Once deployed, you'll get a URL like: `https://peoplesync-xxxxx.vercel.app`
4. **SAVE THIS URL!**

---

## Part 4: Update Backend CORS Settings

### Step 1: Update Render Environment Variables
1. Go to Render dashboard
2. Select your `peoplesync-backend` service
3. Go to **"Environment"**
4. Update these variables:

```bash
FRONTEND_URL=https://peoplesync-xxxxx.vercel.app
CORS_ORIGIN=https://peoplesync-xxxxx.vercel.app
```

5. Click **"Save Changes"**
6. Service will automatically redeploy

---

## Part 5: Test Deployment

### Test 1: Backend Health Check
```bash
curl https://peoplesync-backend.onrender.com/api/v1/health
```

Expected: `{"success":true,"message":"PeopleSync API is running"}`

### Test 2: Frontend Access
1. Open: `https://peoplesync-xxxxx.vercel.app`
2. Should see landing page
3. Click "Get Started" → Should load registration page

### Test 3: Generate Invitation Code
Since we can't run `npm run invite` directly on Render, we need to:

**Option A: Use MongoDB Compass or Atlas UI**
1. Connect to MongoDB Atlas
2. Go to `peoplesync` database → `invitations` collection
3. Insert document:
```json
{
  "code": "INV-12345-ABCDE",
  "email": null,
  "usedBy": null,
  "expiresAt": "2025-12-31T23:59:59.999Z",
  "isUsed": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Option B: Create API Endpoint (Recommended)**
Add this to your backend (only for super_admin):

Create `/server/src/routes/invitationRoutes.js` and add:
```javascript
router.post(
  '/generate',
  authenticate,
  authorizeRole(ROLES.SUPER_ADMIN),
  invitationController.generate
);
```

Then use Postman to call: `POST /api/v1/invitations/generate`

### Test 4: Complete Registration Flow
1. Go to registration page
2. Use invitation code
3. Fill in details
4. Submit
5. Check email for verification link
6. Verify email
7. Login

### Test 5: Test Full Application
1. Login as super_admin
2. Create departments
3. Create teams
4. Onboard employees
5. Mark attendance
6. Apply for leaves
7. Check dashboard analytics

---

## Part 6: Custom Domain (Optional)

### For Vercel (Frontend)
1. Go to Vercel project settings
2. Click **"Domains"**
3. Add your custom domain (e.g., `app.yourcompany.com`)
4. Follow DNS configuration instructions
5. Update backend CORS_ORIGIN to use custom domain

### For Render (Backend)
1. Go to Render service settings
2. Click **"Settings"** → **"Custom Domains"**
3. Add your custom domain (e.g., `api.yourcompany.com`)
4. Follow DNS configuration instructions
5. Update frontend VITE_API_URL to use custom domain

---

## Part 7: Monitoring & Maintenance

### Monitor Backend (Render)
- Dashboard: https://dashboard.render.com
- View logs: Click on service → "Logs" tab
- Monitor metrics: CPU, Memory usage
- Set up alerts for downtime

### Monitor Frontend (Vercel)
- Dashboard: https://vercel.com/dashboard
- View logs: Click on project → "Deployments" → Select deployment → "Logs"
- Monitor analytics: Built-in analytics
- Check Core Web Vitals

### Important Notes:
1. **Free Tier Limitations:**
   - Render: Spins down after 15 minutes of inactivity (first request will be slow)
   - Vercel: 100GB bandwidth per month
   - MongoDB Atlas: 512MB storage

2. **Keep Services Active:**
   - Use a service like UptimeRobot (free) to ping your backend every 5 minutes
   - This prevents Render from spinning down

3. **Backup Database:**
   - MongoDB Atlas provides automated backups
   - Export important data regularly

---

## Part 8: Environment Variables Checklist

### Backend (Render)
```bash
✅ NODE_ENV=production
✅ MONGODB_URI=mongodb+srv://...
✅ JWT_SECRET=...
✅ JWT_REFRESH_SECRET=...
✅ JWT_EXPIRES_IN=15m
✅ JWT_REFRESH_EXPIRES_IN=7d
✅ EMAIL_HOST=smtp.gmail.com
✅ EMAIL_PORT=587
✅ EMAIL_SECURE=false
✅ EMAIL_USER=your-email@gmail.com
✅ EMAIL_PASSWORD=your-app-password
✅ EMAIL_FROM=noreply@peoplesync.com
✅ FRONTEND_URL=https://your-app.vercel.app
✅ PORT=8001
✅ CORS_ORIGIN=https://your-app.vercel.app
```

### Frontend (Vercel)
```bash
✅ VITE_API_URL=https://peoplesync-backend.onrender.com
```

---

## Part 9: Troubleshooting

### Issue 1: Backend not starting on Render
**Check:**
- Build logs for errors
- Correct start command: `npm start`
- All environment variables set
- MongoDB connection string correct

### Issue 2: Frontend can't connect to backend
**Check:**
- VITE_API_URL is correct
- CORS_ORIGIN set on backend
- Backend is running (not spun down)
- Check browser console for CORS errors

### Issue 3: MongoDB connection failed
**Check:**
- Connection string is correct
- Password doesn't contain special characters (URL encode if needed)
- IP whitelist includes 0.0.0.0/0
- Database user has read/write permissions

### Issue 4: Email not sending
**Check:**
- Gmail App Password (not regular password)
- 2FA enabled on Gmail
- EMAIL_USER and EMAIL_PASSWORD correct
- Check Render logs for email errors

### Issue 5: 500 errors on API calls
**Check:**
- Render logs for error messages
- Database connection successful
- Required environment variables set
- JWT secrets are set

---

## Part 10: Post-Deployment Tasks

### 1. Create First Super Admin
Since `npm run invite` can't be run directly:
- Manually insert invitation code in MongoDB
- Register first super admin
- Super admin can then invite others

### 2. Update README with URLs
Update your README.md:
```markdown
## Live Demo
- Frontend: https://peoplesync-xxxxx.vercel.app
- Backend API: https://peoplesync-backend.onrender.com
```

### 3. Set Up UptimeRobot (Prevent Render Spin Down)
1. Go to: https://uptimerobot.com
2. Create free account
3. Add new monitor:
   - Type: HTTP(s)
   - URL: https://peoplesync-backend.onrender.com/api/v1/health
   - Interval: 5 minutes
4. This keeps your backend active

### 4. Enable Analytics
**Vercel Analytics:**
1. Go to project settings
2. Enable Vercel Analytics (free)
3. Monitor performance and traffic

### 5. Set Up Error Tracking (Optional)
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user tracking

---

## Deployment Checklist

### Pre-Deployment
- [ ] All modules tested locally
- [ ] Environment variables documented
- [ ] Code committed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Gmail App Password generated

### Backend Deployment (Render)
- [ ] Repository connected
- [ ] Root directory set to `server`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] All environment variables added
- [ ] Deployment successful
- [ ] Health check endpoint working

### Frontend Deployment (Vercel)
- [ ] Repository connected
- [ ] Root directory set to `client`
- [ ] VITE_API_URL environment variable set
- [ ] Deployment successful
- [ ] Application loads in browser

### Post-Deployment
- [ ] Backend CORS updated with frontend URL
- [ ] Create invitation code
- [ ] Register first super admin
- [ ] Test complete user flow
- [ ] Set up UptimeRobot
- [ ] Document live URLs

---

## Quick Deployment Commands

```bash
# 1. Commit and push
git add .
git commit -m "chore: Ready for deployment"
git push origin main

# 2. Generate JWT secrets (run 2 times)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. After deployment, test
curl https://your-backend.onrender.com/api/v1/health
```

---

## Support URLs

- MongoDB Atlas: https://cloud.mongodb.com
- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- GitHub: https://github.com
- UptimeRobot: https://uptimerobot.com

---

## Success Criteria

✅ Backend deployed and responding to health checks
✅ Frontend deployed and loading
✅ Database connected successfully
✅ CORS configured correctly
✅ Email service working
✅ Can register and login
✅ All features working in production

---

**Deployment complete! Your PeopleSync application is now live! 🎉**
