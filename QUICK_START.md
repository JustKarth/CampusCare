# 🚀 Quick Start Guide

## ⚠️ Prerequisites Check

**Node.js and npm are required!**

If you see "npm is not recognized", you need to:
1. **Install Node.js** from: https://nodejs.org/ (Download LTS version)
2. **Restart your terminal/command prompt** after installation
3. **Verify installation:**
   ```bash
   node --version
   npm --version
   ```

---

## 📋 Step-by-Step Setup

### 1. Install Node.js (if not installed)
- Visit: https://nodejs.org/
- Download and install the LTS version
- Restart your terminal

### 2. Setup Backend

```bash
# Navigate to backend
cd CampusCare/backend

# Install dependencies
npm install

# Create .env file (already created from template)
# IMPORTANT: Edit .env and update:
#   - DB_PASSWORD=your_actual_mysql_password
#   - JWT_SECRET=your_secret_key_here

# Start backend server
npm start
```

**Backend will run on:** `http://localhost:5000`

### 3. Setup Frontend (in a NEW terminal)

```bash
# Navigate to frontend
cd CampusCare/frontend/react

# Install dependencies
npm install

# Start frontend server
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

---

## ✅ Verification

1. **Backend running:** Visit `http://localhost:5000` - Should show API status
2. **Frontend running:** Visit `http://localhost:5173` - Should show React app
3. **Test login:** Use the frontend to test authentication

---

## 🔧 Important Notes

1. **Database must be running:**
   - MySQL must be installed and running
   - Database `campus_care` must exist
   - Update `backend/.env` with correct database credentials

2. **Backend .env file:**
   - Location: `CampusCare/backend/.env`
   - Update `DB_PASSWORD` with your MySQL password
   - Update `JWT_SECRET` with a secure random string

3. **Frontend .env file:**
   - Already configured: `VITE_API_BASE_URL=http://localhost:5000/api`
   - No changes needed unless backend runs on different port

---

## 🐛 Troubleshooting

### "npm is not recognized"
- Install Node.js from https://nodejs.org/
- Restart terminal after installation

### "Cannot connect to database"
- Check MySQL is running
- Verify database credentials in `backend/.env`
- Ensure database `campus_care` exists

### "Port 5000 already in use"
- Change `PORT` in `backend/.env`
- Or stop the process using port 5000

### Frontend can't connect to backend
- Verify backend is running
- Check `frontend/react/.env` has correct URL
- Check browser console for errors

---

## 📝 Current Status

✅ **Frontend .env:** Configured  
✅ **Backend .env:** Created (needs database password update)  
⚠️ **Dependencies:** Need to run `npm install` in both directories  
⚠️ **Node.js:** Not detected - needs installation

---

**Once Node.js is installed, follow the setup steps above!**
