# Setup and Run Instructions

## Prerequisites

1. **Node.js and npm** must be installed
   - Download from: https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **MySQL Database** must be running
   - Database name: `campus_care`
   - Update credentials in `backend/.env`

---

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd CampusCare/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - The `.env` file has been created from `env.template`
   - **IMPORTANT**: Update `backend/.env` with your database credentials:
     ```
     DB_PASSWORD=your_actual_password
     JWT_SECRET=your_super_secret_jwt_key_change_this
     ```

4. **Initialize database** (if not already done):
   ```bash
   npm run init-db
   ```

5. **Start backend server:**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```
   
   Backend will run on: `http://localhost:5000`

---

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd CampusCare/frontend/react
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment is already configured:**
   - `.env` file exists with: `VITE_API_BASE_URL=http://localhost:5000/api`

4. **Start frontend development server:**
   ```bash
   npm run dev
   ```
   
   Frontend will run on: `http://localhost:5173` (or another port if 5173 is taken)

---

## Running Both Servers

### Option 1: Two Separate Terminals

**Terminal 1 - Backend:**
```bash
cd CampusCare/backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd CampusCare/frontend/react
npm run dev
```

### Option 2: Using npm-run-all (if installed globally)
```bash
npm install -g npm-run-all
```

Then from project root:
```bash
npm-run-all --parallel backend:start frontend:dev
```

---

## Verification

1. **Backend is running** if you see:
   - `Server is running on port 5000`
   - Visit: `http://localhost:5000` - Should show API status

2. **Frontend is running** if you see:
   - `Local: http://localhost:5173`
   - Visit: `http://localhost:5173` - Should show React app

---

## Troubleshooting

### npm not recognized
- Install Node.js from https://nodejs.org/
- Restart terminal after installation
- Verify: `node --version` and `npm --version`

### Database connection errors
- Ensure MySQL is running
- Check `backend/.env` has correct database credentials
- Verify database `campus_care` exists

### Port already in use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Vite will automatically use next available port

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `frontend/react/.env` has correct API URL
- Check browser console for CORS errors

---

## Quick Start Commands

```bash
# Backend
cd CampusCare/backend
npm install
npm start

# Frontend (in new terminal)
cd CampusCare/frontend/react
npm install
npm run dev
```

---

**Note**: Make sure to update `backend/.env` with your actual database password and JWT secret before starting the backend!
