# PeopleSync Deployment Checklist

Use this checklist to ensure smooth deployment.

## Phase 1: Pre-Deployment Preparation

### 1.1 MongoDB Atlas Setup
- [ ] Create MongoDB Atlas account
- [ ] Create free M0 cluster
- [ ] Create database user with read/write permissions
- [ ] Whitelist all IPs (0.0.0.0/0)
- [ ] Get connection string
- [ ] Test connection locally

### 1.2 Gmail Setup (for emails)
- [ ] Enable 2FA on Gmail account
- [ ] Generate App Password
- [ ] Test email sending locally

### 1.3 Generate Secrets
```bash
# Run this twice to get two different secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- [ ] JWT_SECRET generated
- [ ] JWT_REFRESH_SECRET generated

### 1.4 Prepare Code
- [ ] All environment variables documented
- [ ] .gitignore updated (no .env files)
- [ ] Code tested locally
- [ ] All dependencies installed
- [ ] No console.logs or debug code

---

## Phase 2: GitHub Setup

- [ ] Create GitHub repository: `peoplesync`
- [ ] Initialize git in project root
- [ ] Add all files: `git add .`
- [ ] Commit: `git commit -m "feat: Complete PeopleSync v1.0"`
- [ ] Link remote: `git remote add origin https://github.com/YOUR_USERNAME/peoplesync.git`
- [ ] Push: `git push -u origin main`

---

## Phase 3: Backend Deployment (Render)

### 3.1 Create Service
- [ ] Sign up on Render.com with GitHub
- [ ] Create new Web Service
- [ ] Connect peoplesync repository
- [ ] Set root directory: `server`
- [ ] Set build command: `npm install`
- [ ] Set start command: `npm start`
- [ ] Select Free tier

### 3.2 Environment Variables
Add these on Render:
- [ ] NODE_ENV=production
- [ ] MONGODB_URI=`<your-connection-string>`
- [ ] JWT_SECRET=`<generated-secret-1>`
- [ ] JWT_REFRESH_SECRET=`<generated-secret-2>`
- [ ] JWT_EXPIRES_IN=15m
- [ ] JWT_REFRESH_EXPIRES_IN=7d
- [ ] EMAIL_HOST=smtp.gmail.com
- [ ] EMAIL_PORT=587
- [ ] EMAIL_SECURE=false
- [ ] EMAIL_USER=`<your-gmail>`
- [ ] EMAIL_PASSWORD=`<your-app-password>`
- [ ] EMAIL_FROM=noreply@peoplesync.com
- [ ] PORT=8001
- [ ] FRONTEND_URL=`<will-update-after-vercel>`
- [ ] CORS_ORIGIN=`<will-update-after-vercel>`

### 3.3 Deploy & Test
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (~5-10 min)
- [ ] Note backend URL: `https://peoplesync-backend-XXXXX.onrender.com`
- [ ] Test health: `curl https://your-backend-url/api/v1/health`

---

## Phase 4: Frontend Deployment (Vercel)

### 4.1 Update Environment
- [ ] Update `/client/.env`:
  ```env
  VITE_API_URL=https://your-backend-url.onrender.com
  ```
- [ ] Commit and push changes

### 4.2 Create Vercel Project
- [ ] Sign up on Vercel.com with GitHub
- [ ] Import peoplesync repository
- [ ] Set root directory: `client`
- [ ] Framework: Vite (auto-detected)
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`

### 4.3 Environment Variables
Add on Vercel:
- [ ] VITE_API_URL=`https://your-backend-url.onrender.com`

### 4.4 Deploy & Test
- [ ] Click "Deploy"
- [ ] Wait for deployment (~3-5 min)
- [ ] Note frontend URL: `https://peoplesync-XXXXX.vercel.app`
- [ ] Open URL in browser
- [ ] Check if landing page loads

---

## Phase 5: Update Backend CORS

- [ ] Go back to Render dashboard
- [ ] Update environment variables:
  - FRONTEND_URL=`https://your-vercel-url.vercel.app`
  - CORS_ORIGIN=`https://your-vercel-url.vercel.app`
- [ ] Save changes (auto-redeploys)
- [ ] Wait for redeploy

---

## Phase 6: Create First User

### Option A: Manual MongoDB Insert
- [ ] Connect to MongoDB Atlas
- [ ] Go to `peoplesync` database → `invitations` collection
- [ ] Insert document:
```json
{
  "code": "INV-FIRST-ADMIN",
  "email": null,
  "usedBy": null,
  "expiresAt": "2025-12-31T23:59:59.999Z",
  "isUsed": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Option B: Add API Endpoint (Later)
- [ ] Create endpoint to generate invitation codes
- [ ] Protect with super_admin role
- [ ] Use Postman to call endpoint

---

## Phase 7: Test Complete Flow

- [ ] Open frontend URL
- [ ] Go to registration page
- [ ] Use invitation code: `INV-FIRST-ADMIN`
- [ ] Register super admin account
- [ ] Check email for verification link
- [ ] Verify email
- [ ] Login successfully
- [ ] See dashboard
- [ ] Create department
- [ ] Create team
- [ ] Onboard employee
- [ ] Test check-in/check-out
- [ ] Apply for leave
- [ ] Check analytics dashboard

---

## Phase 8: Post-Deployment

### 8.1 Set Up Monitoring
- [ ] Sign up on UptimeRobot.com
- [ ] Add monitor for backend health endpoint
- [ ] Set interval to 5 minutes
- [ ] Verify ping working

### 8.2 Enable Analytics
- [ ] Enable Vercel Analytics (in project settings)
- [ ] Check performance metrics

### 8.3 Document URLs
- [ ] Update README.md with live URLs:
  ```markdown
  ## Live Demo
  - Frontend: https://your-app.vercel.app
  - Backend: https://your-backend.onrender.com
  ```
- [ ] Commit and push README update

### 8.4 Share & Test
- [ ] Share app URL with team
- [ ] Test on different devices
- [ ] Test on different browsers
- [ ] Check mobile responsiveness

---

## URLs Checklist

Record your URLs here:

- **MongoDB Connection String:** 
  ```
  mongodb+srv://...
  ```

- **Backend (Render):** 
  ```
  https://peoplesync-backend-XXXXX.onrender.com
  ```

- **Frontend (Vercel):** 
  ```
  https://peoplesync-XXXXX.vercel.app
  ```

- **GitHub Repository:** 
  ```
  https://github.com/YOUR_USERNAME/peoplesync
  ```

- **First Invitation Code:** 
  ```
  INV-FIRST-ADMIN
  ```

---

## Common Issues & Solutions

### Backend won't start
- Check Render logs
- Verify MongoDB connection string
- Check all env variables are set

### Frontend can't reach backend
- Check CORS_ORIGIN on backend
- Check VITE_API_URL on frontend
- Ping backend health endpoint

### Email not sending
- Use Gmail App Password (not regular password)
- Check EMAIL_USER and EMAIL_PASSWORD
- Check 2FA is enabled

### Render service keeps spinning down
- Set up UptimeRobot to ping every 5 min
- Consider upgrading to paid tier

---

## Deployment Complete! 🎉

Your PeopleSync application is now live and accessible worldwide!

**Next Steps:**
1. Share the app URL with your team
2. Monitor logs for any issues
3. Set up regular database backups
4. Plan for scaling (when needed)
5. Continue building new features!
