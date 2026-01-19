# Database Integration Guide

This guide will help you integrate your MySQL database with the Campus Care backend.

## 📋 Prerequisites

- MySQL Server installed and running
- Node.js and npm installed
- Backend dependencies installed (`npm install`)

## 🚀 Quick Start (Automated Setup)

### Step 1: Configure Environment Variables

1. Copy the environment template:
   ```bash
   cd backend
   copy env.template .env
   ```

2. Edit `.env` file and set your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=campus_care
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=5000
   NODE_ENV=development
   ```

   **Important:** Replace `your_mysql_password_here` with your actual MySQL root password!

### Step 2: Run Database Initialization Script

The initialization script will:
- Create the database if it doesn't exist
- Run `schema.sql` to create all tables
- Run `init_data.sql` to populate master data (states, colleges, courses)

```bash
cd backend
node scripts/init-database.js
```

Expected output:
```
🚀 Starting database initialization...
📡 Connecting to MySQL server...
✅ Connected to MySQL server
📦 Creating database 'campus_care' if it doesn't exist...
✅ Database 'campus_care' is ready
📄 Reading schema file...
🔨 Executing schema.sql (creating tables)...
✅ Schema executed successfully
📄 Reading init_data file...
📊 Executing init_data.sql (inserting master data)...
✅ Master data inserted
🔍 Verifying database setup...
✅ Found 14 tables
🎉 Database initialization completed successfully!
```

### Step 3: Test Database Connection

```bash
node test-db-connection.js
```

You should see:
```
✅ Successfully connected to MySQL server!
✅ Database 'campus_care' exists!
```

### Step 4: Start the Server

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
Server is running on port 5000
```

---

## 📖 Manual Setup (Alternative Method)

If you prefer to set up the database manually:

### Step 1: Create Database

```bash
mysql -u root -p
```

In MySQL prompt:
```sql
CREATE DATABASE campus_care;
USE campus_care;
```

### Step 2: Run Schema

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p campus_care < db/schema.sql
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Open SQL Script → Select `backend/db/schema.sql`
4. Click Execute (⚡ icon)

### Step 3: Insert Master Data

```bash
mysql -u root -p campus_care < db/init_data.sql
```

Or in MySQL Workbench, open and execute `backend/db/init_data.sql`

### Step 4: Verify Setup

```sql
SHOW TABLES;
-- Should show 14 tables

SELECT COUNT(*) FROM states;
-- Should show 36 states

SELECT COUNT(*) FROM colleges;
-- Should show at least 1 college

SELECT COUNT(*) FROM courses;
-- Should show at least 9 courses
```

---

## 🏗️ Architecture Overview

### Database Connection

The database connection is managed through a connection pool in `backend/config/database.js`:

```javascript
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campus_care',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

**Key Features:**
- Connection pooling for better performance
- Environment variable configuration
- Automatic connection testing on startup
- Non-blocking initialization (server starts even if DB is down)

### Model Layer

Models in `backend/models/` use the database pool:

```javascript
const pool = require('../config/database');

class User {
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM user_profiles WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }
}
```

**Models Available:**
- `User.js` - User profile operations
- `Blog.js` - Blog post operations
- `Comment.js` - Comment operations
- `Reaction.js` - Like/reaction operations
- `Resource.js` - Academic resource operations
- `LocalGuide.js` - Local guide place operations

### Controller Layer

Controllers use models to interact with the database:

```javascript
const User = require('../models/User');

const register = async (req, res) => {
  const user = await User.findByEmail(email);
  // ... registration logic
};
```

---

## 📁 Database Files Structure

```
backend/
├── db/
│   ├── schema.sql          # Database schema (table definitions)
│   └── init_data.sql       # Master data (states, colleges, courses)
├── config/
│   └── database.js         # Database connection pool configuration
├── models/                 # Database models (User, Blog, etc.)
├── controllers/            # Controllers using models
└── scripts/
    └── init-database.js    # Automated database setup script
```

---

## 🔍 Database Schema Overview

### Core Tables

1. **Reference Data:**
   - `avatars` - User avatar options
   - `states` - Indian states and union territories
   - `colleges` - College information
   - `courses` - Course offerings per college
   - `local_guide_categories` - Place categories

2. **User Management:**
   - `user_profiles` - User account information

3. **Blog System:**
   - `blog` - Blog posts
   - `blog_images` - Image storage
   - `blog_specific_images` - Blog-image relationships
   - `blog_comments` - Comments on blogs
   - `blog_likes` - User likes on blogs

4. **Resources & Local Guide:**
   - `academic_resources` - Academic resource links
   - `places` - Local places information
   - `place_rating` - User ratings for places

---

## ✅ Verification Checklist

After setup, verify:

- [ ] MySQL server is running
- [ ] `.env` file is configured correctly
- [ ] Database `campus_care` exists
- [ ] All 14 tables are created
- [ ] Master data is inserted (states, colleges, courses)
- [ ] Database connection test passes
- [ ] Server starts without errors
- [ ] Can register a new user
- [ ] Can login with registered user

---

## 🧪 Testing the Integration

### Test 1: Database Connection

```bash
node test-db-connection.js
```

### Test 2: User Registration

Use Postman or Thunder Client:

**POST** `http://localhost:5000/api/auth/register`

```json
{
  "email": "test@mnnit.ac.in",
  "password": "password123",
  "reg_no": "2024CS001",
  "first_name": "John",
  "last_name": "Doe",
  "college_id": 1,
  "course_id": 1,
  "graduation_year": 2027,
  "date_of_birth": "2000-01-01"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "userId": 1,
    "email": "test@mnnit.ac.in",
    "firstName": "John",
    "lastName": "Doe",
    "collegeId": 1
  }
}
```

### Test 3: User Login

**POST** `http://localhost:5000/api/auth/login`

```json
{
  "email": "test@mnnit.ac.in",
  "password": "password123"
}
```

---

## 🐛 Troubleshooting

### Issue 1: "Access Denied" Error

**Problem:** Wrong MySQL credentials

**Solution:**
1. Check `.env` file has correct `DB_USER` and `DB_PASSWORD`
2. Test login manually: `mysql -u root -p`
3. If password doesn't work, reset MySQL password

### Issue 2: "Database doesn't exist"

**Problem:** Database not created

**Solution:**
```bash
mysql -u root -p
CREATE DATABASE campus_care;
```

Or run: `node scripts/init-database.js`

### Issue 3: "Table doesn't exist"

**Problem:** Schema not executed

**Solution:**
```bash
mysql -u root -p campus_care < backend/db/schema.sql
```

Or run: `node scripts/init-database.js`

### Issue 4: "Can't connect to MySQL server"

**Problem:** MySQL service not running

**Solution (Windows):**
1. Open Services (`Win + R` → `services.msc`)
2. Find "MySQL80" or "MySQL"
3. Right-click → Start

Or use command:
```bash
net start MySQL80
```

### Issue 5: Foreign Key Errors

**Problem:** Tables created in wrong order or data missing

**Solution:**
1. Drop and recreate database:
   ```sql
   DROP DATABASE campus_care;
   CREATE DATABASE campus_care;
   ```
2. Run schema again: `node scripts/init-database.js`

### Issue 6: "ER_DUP_ENTRY" Errors

**Problem:** Trying to insert duplicate data

**Solution:** This is normal if you run `init_data.sql` multiple times. The script handles this gracefully.

---

## 📝 Next Steps

After successful integration:

1. **Add More Master Data:**
   - Add more colleges to `colleges` table
   - Add more courses to `courses` table
   - Add avatar URLs to `avatars` table
   - Add local guide categories to `local_guide_categories` table

2. **Test All Endpoints:**
   - User registration/login
   - Blog creation/retrieval
   - Comment operations
   - Like/reaction operations
   - Resource operations
   - Local guide operations

3. **Production Considerations:**
   - Use strong JWT secret
   - Use environment-specific database credentials
   - Set up database backups
   - Configure connection pool limits based on load
   - Add database migration system for future schema changes

---

## 📚 Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [mysql2 npm package](https://www.npmjs.com/package/mysql2)
- [Connection Pooling Best Practices](https://github.com/sidorares/node-mysql2#using-connection-pools)

---

## 🆘 Getting Help

If you encounter issues:

1. Check the error message carefully
2. Verify MySQL is running: `mysql -u root -p`
3. Test database connection: `node test-db-connection.js`
4. Check `.env` file configuration
5. Review the troubleshooting section above

For database schema questions, refer to `backend/db/schema.sql` and `docs/database_pseudocode.md`.
