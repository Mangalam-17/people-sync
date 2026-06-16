# 🖥️ PeopleSync - CLI Commands Guide

## 📋 Available Terminal Operations

---

## 🎫 1. Create Invitations (Super Admin Creation)

### Interactive Mode (Recommended)
```bash
cd server
npm run invite
```

**Prompts you for:**
- Company Name
- Admin Email
- First Name (optional)
- Last Name (optional)
- Plan (free/pro/enterprise)
- Expiration Days
- Notes

**Output:**
```
✅ Invitation Created!
🎫 Code: INV-A3B2C-D4E5F
🔗 Link: http://localhost:5173/register?invite=INV-A3B2C-D4E5F
```

### Quick Mode (With Parameters)
```bash
cd server
node scripts/createInvitation.js \
  --company="Tech Corp" \
  --email="admin@techcorp.com" \
  --firstName="John" \
  --lastName="Doe" \
  --plan="free" \
  --days=30 \
  --notes="First customer"
```

---

## 🚀 2. Start/Stop Servers

### Start Backend (Development)
```bash
cd server
npm run dev
```
**Runs on:** `http://localhost:8001`

### Start Frontend (Development)
```bash
cd client
npm run dev
```
**Runs on:** `http://localhost:5173`

### Start Backend (Production)
```bash
cd server
npm start
```

### Start Both (Recommended - Use 2 Terminals)
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

---

## 🗄️ 3. Database Operations

### Connect to MongoDB Shell
```bash
mongosh
```

### View All Invitations
```javascript
use peoplesync
db.invitations.find().pretty()
```

### View Valid Invitations
```javascript
db.invitations.find({
  isUsed: false,
  expiresAt: { $gt: new Date() }
}).pretty()
```

### View All Users
```javascript
db.users.find().pretty()
```

### View All Tenants
```javascript
db.tenants.find().pretty()
```

### Count Super Admins
```javascript
db.users.countDocuments({ role: 'super_admin' })
```

### Find User by Email
```javascript
db.users.findOne({ email: "admin@example.com" })
```

### Delete Invitation (if needed)
```javascript
db.invitations.deleteOne({ code: "INV-A3B2C-D4E5F" })
```

### Delete User (Careful!)
```javascript
db.users.deleteOne({ email: "user@example.com" })
```

---

## 📦 4. Package Management

### Install Dependencies (Backend)
```bash
cd server
npm install
```

### Install Dependencies (Frontend)
```bash
cd client
npm install
```

### Add New Package (Backend)
```bash
cd server
npm install package-name
```

### Add New Package (Frontend)
```bash
cd client
npm install package-name
```

### Update All Packages
```bash
npm update
```

---

## 🔍 5. Testing & Debugging

### Test API Endpoint (cURL)
```bash
# Test health check
curl http://localhost:8001/api/v1/health

# Validate invitation (no auth)
curl http://localhost:8001/api/v1/invitations/validate/INV-A3B2C-D4E5F

# Login
curl -X POST http://localhost:8001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"YourPassword123!"}'
```

### Test with HTTPie (Better than cURL)
```bash
# Install httpie
brew install httpie

# Test invitation
http GET localhost:8001/api/v1/invitations/validate/INV-A3B2C-D4E5F

# Login
http POST localhost:8001/api/v1/auth/login \
  email=admin@example.com \
  password=YourPassword123!
```

### View Server Logs (Real-time)
```bash
cd server
npm run dev
# Logs appear automatically with emojis and colors
```

### Check MongoDB Connection
```bash
mongosh --eval "db.adminCommand('ping')"
```

---

## 🛠️ 6. Development Tools

### Check Node Version
```bash
node --version
```

### Check NPM Version
```bash
npm --version
```

### Check MongoDB Status
```bash
brew services list | grep mongodb
```

### Start MongoDB (if stopped)
```bash
brew services start mongodb-community
```

### Stop MongoDB
```bash
brew services stop mongodb-community
```

### Restart MongoDB
```bash
brew services restart mongodb-community
```

---

## 🧹 7. Cleanup Commands

### Clear Node Modules & Reinstall (Backend)
```bash
cd server
rm -rf node_modules package-lock.json
npm install
```

### Clear Node Modules & Reinstall (Frontend)
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

### Clear Build Cache (Frontend)
```bash
cd client
rm -rf dist
rm -rf .vite
npm run dev
```

### Clear MongoDB Database (⚠️ DANGER)
```bash
mongosh
use peoplesync
db.dropDatabase()
```

---

## 📊 8. Database Queries (Common Tasks)

### Find All Super Admins
```javascript
db.users.find({ role: 'super_admin' }).pretty()
```

### Find Unused Invitations
```javascript
db.invitations.find({
  isUsed: false,
  expiresAt: { $gt: new Date() }
})
```

### Find Expired Invitations
```javascript
db.invitations.find({
  isUsed: false,
  expiresAt: { $lt: new Date() }
})
```

### Count Users by Role
```javascript
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
])
```

### Find Latest 10 Users
```javascript
db.users.find()
  .sort({ createdAt: -1 })
  .limit(10)
  .pretty()
```

### Update User Role (Manual)
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "hr_admin" } }
)
```

---

## 🔐 9. User Management (MongoDB)

### Create User Manually (Skip if using invitation system)
```javascript
// NOT RECOMMENDED - Use invitation system instead
// This is just for reference

db.users.insertOne({
  tenantId: ObjectId("your_tenant_id"),
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "$2a$12$hashed_password_here",
  role: "employee",
  isActive: true,
  isEmailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Activate User
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { isActive: true } }
)
```

### Deactivate User
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { isActive: false } }
)
```

### Verify Email Manually
```javascript
db.users.updateOne(
  { email: "user@example.com" },
  { 
    $set: { 
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null
    } 
  }
)
```

---

## 📈 10. Statistics & Reports

### Get Invitation Statistics
```javascript
// Total invitations
db.invitations.countDocuments()

// Used invitations
db.invitations.countDocuments({ isUsed: true })

// Valid invitations
db.invitations.countDocuments({
  isUsed: false,
  expiresAt: { $gt: new Date() }
})

// Expired invitations
db.invitations.countDocuments({
  isUsed: false,
  expiresAt: { $lt: new Date() }
})
```

### Get User Statistics
```javascript
// Total users
db.users.countDocuments()

// Active users
db.users.countDocuments({ isActive: true })

// Verified users
db.users.countDocuments({ isEmailVerified: true })

// Users by role
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
])
```

### Get Tenant Statistics
```javascript
// Total tenants
db.tenants.countDocuments()

// Tenants by plan
db.tenants.aggregate([
  { $group: { _id: "$plan", count: { $sum: 1 } } }
])
```

---

## 🔧 11. Troubleshooting Commands

### Check if Port is in Use
```bash
# Check backend port
lsof -i :8001

# Check frontend port
lsof -i :5173

# Check MongoDB port
lsof -i :27017
```

### Kill Process on Port
```bash
# Kill process on backend port
kill -9 $(lsof -t -i:8001)

# Kill process on frontend port
kill -9 $(lsof -t -i:5173)
```

### Check Environment Variables
```bash
cd server
cat .env
```

### Test MongoDB Connection String
```bash
mongosh "mongodb://localhost:27017/peoplesync"
```

### View NPM Logs
```bash
npm config get cache
```

---

## 🎯 12. Quick Reference

### Start Everything (Fresh)
```bash
# Terminal 1: MongoDB (if not running)
brew services start mongodb-community

# Terminal 2: Backend
cd server && npm run dev

# Terminal 3: Frontend
cd client && npm run dev

# Terminal 4: Create invitation
cd server && npm run invite
```

### Stop Everything
```bash
# Ctrl+C in each terminal
# Or
pkill -f "node.*server"
pkill -f "vite"
```

---

## 📝 13. Custom Scripts You Can Add

### Add to `server/package.json`:
```json
{
  "scripts": {
    "invite": "node scripts/createInvitation.js",
    "dev": "nodemon server.js",
    "start": "node server.js",
    
    // Add these:
    "db:seed": "node scripts/seedDatabase.js",
    "db:clear": "node scripts/clearDatabase.js",
    "user:create": "node scripts/createUser.js",
    "stats": "node scripts/getStats.js"
  }
}
```

---

## 🎓 Common Workflows

### Create New Company/Super Admin
```bash
# 1. Create invitation
cd server && npm run invite

# 2. Share code with company
# They visit: http://localhost:5173/register?invite=CODE

# 3. Verify in database
mongosh
use peoplesync
db.users.find().sort({createdAt:-1}).limit(1).pretty()
```

### Reset User Password (Manual)
```bash
# 1. Generate hash (use bcrypt online tool or write script)
# 2. Update in database
mongosh
use peoplesync
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { password: "hashed_password_here" } }
)
```

### Backup Database
```bash
# Backup
mongodump --db peoplesync --out ./backup

# Restore
mongorestore --db peoplesync ./backup/peoplesync
```

---

## ⚠️ Important Notes

### What You CANNOT Do via CLI (Yet)
- ❌ Create super admin without invitation (by design for security)
- ❌ Automatically send invitation emails (need to implement)
- ❌ Bulk operations (need to write scripts)
- ❌ Generate reports (need to implement)

### What You SHOULD Do via CLI
- ✅ Create invitations
- ✅ View database records
- ✅ Debug issues
- ✅ Monitor logs
- ✅ Manage services

### What You SHOULD NOT Do via CLI
- ❌ Directly insert users (use invitation system)
- ❌ Manually hash passwords
- ❌ Delete production data without backup
- ❌ Modify critical system records

---

## 🚀 Pro Tips

### 1. Use Aliases
Add to `~/.zshrc`:
```bash
alias pserver="cd ~/Desktop/PeopleSync/server && npm run dev"
alias pclient="cd ~/Desktop/PeopleSync/client && npm run dev"
alias pinvite="cd ~/Desktop/PeopleSync/server && npm run invite"
alias pdb="mongosh peoplesync"
```

### 2. Use Screen/Tmux for Multiple Sessions
```bash
# Install tmux
brew install tmux

# Start session
tmux new -s peoplesync

# Split panes
Ctrl+B then %  # Split vertically
Ctrl+B then "  # Split horizontally

# Navigate
Ctrl+B then arrow keys
```

### 3. Use Watch for Auto-Refresh
```bash
# Watch invitation count
watch -n 2 'mongosh --quiet --eval "db.invitations.countDocuments()" peoplesync'
```

---

## 📞 Quick Help

**Create invitation:**
```bash
npm run invite
```

**Start servers:**
```bash
npm run dev
```

**Check database:**
```bash
mongosh peoplesync
```

**View logs:**
```bash
# Logs show automatically when server runs
```

---

That's everything you can do via terminal/CLI right now! 🎉
