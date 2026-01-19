# Database Setup Guide

## Step 1: Get the Database Schema from Git Repo

### Option A: Clone the Database Repo (if separate repo)

```bash
# Navigate to a parent directory
cd ..

# Clone the database repo
git clone <database-repo-url>
cd <database-repo-name>

# Copy SQL files to your backend project
# Or note the location for reference
```

### Option B: Access Database Files (if in same repo)

If the database files are in the same repository but different folder:

```bash
# Check if there's a database folder
ls ../database
# or
ls ./database
```

---

## Step 2: Set Up MySQL Database

### 2.1 Install MySQL (if not installed)

**Windows:**
1. Download MySQL Installer: https://dev.mysql.com/downloads/installer/
2. Run installer
3. Choose "Developer Default" or "Server only"
4. Set root password (remember this!)
5. Complete installation

**Verify Installation:**
```bash
mysql --version
```

### 2.2 Start MySQL Service

**Windows:**
- Open Services (Win + R → `services.msc`)
- Find "MySQL80" or "MySQL"
- Right-click → Start
- Or use command: `net start MySQL80`

**Check if running:**
```bash
mysql -u root -p
# Enter your password
# If successful, MySQL is running
# Type: exit
```

---

## Step 3: Create Database and Run Schema

### 3.1 Find SQL Schema Files

Look for files like:
- `schema.sql`
- `database.sql`
- `campus_care.sql`
- `CREATE_TABLES.sql`
- Or multiple `.sql` files

### 3.2 Create Database

**Option A: Using MySQL Command Line**

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE campus_care;

# Use the database
USE campus_care;

# Run schema file
SOURCE /path/to/schema.sql;
# Or
SOURCE C:/path/to/schema.sql;

# Verify tables were created
SHOW TABLES;

# Exit
exit;
```

**Option B: Using MySQL Workbench**

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Click "File" → "Open SQL Script"
4. Select your schema file
5. Click the "Execute" button (⚡ icon)
6. Verify tables in Navigator panel

**Option C: Using Command Line (One-liner)**

```bash
# Windows
mysql -u root -p campus_care < path/to/schema.sql

# Example:
mysql -u root -p campus_care < C:\path\to\campus_care_schema.sql
```

---

## Step 4: Configure Your Backend

### 4.1 Update `.env` File

Make sure your `.env` file has correct database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=campus_care

# JWT Secret Key
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL root password!

### 4.2 Test Database Connection

Run the test script:
```bash
node test-db-connection.js
```

You should see:
```
✅ Successfully connected to MySQL server!
✅ Database 'campus_care' exists!
```

---

## Step 5: Verify Database Setup

### 5.1 Check Tables Exist

```bash
mysql -u root -p campus_care

# In MySQL prompt:
SHOW TABLES;

# Should show tables like:
# - user_profiles
# - blog
# - blog_comments
# - blog_likes
# - academic_resources
# - places
# - etc.
```

### 5.2 Check Table Structure

```sql
-- Check user_profiles table
DESCRIBE user_profiles;

-- Check blog table
DESCRIBE blog;

-- Check other tables
DESCRIBE colleges;
DESCRIBE courses;
```

---

## Step 6: Test Backend with Database

### 6.1 Start Server

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
Server is running on port 5000
```

### 6.2 Test Registration

Use Postman/Thunder Client:

**POST** `http://localhost:5000/api/auth/register`

Body:
```json
{
  "email": "student@college.edu",
  "password": "password123",
  "reg_no": "2024CS001",
  "first_name": "John",
  "last_name": "Doe",
  "course_id": 1,
  "graduation_year": 2027,
  "date_of_birth": "2000-01-01"
}
```

**Note:** Make sure:
- Email domain matches a college in your `colleges` table
- `course_id` exists in `courses` table
- Other required fields match your schema

---

## Common Issues & Solutions

### Issue 1: "Access Denied" Error

**Problem:** Wrong MySQL username/password

**Solution:**
1. Check `.env` file has correct `DB_USER` and `DB_PASSWORD`
2. Try logging in manually: `mysql -u root -p`
3. If password doesn't work, reset MySQL password

### Issue 2: "Database doesn't exist"

**Problem:** Database not created

**Solution:**
```sql
CREATE DATABASE campus_care;
```

### Issue 3: "Table doesn't exist"

**Problem:** Schema not run

**Solution:**
1. Find your schema SQL file
2. Run it: `mysql -u root -p campus_care < schema.sql`
3. Verify: `SHOW TABLES;`

### Issue 4: "Can't connect to MySQL server"

**Problem:** MySQL service not running

**Solution:**
- Windows: Start MySQL service in Services
- Or: `net start MySQL80`

### Issue 5: Foreign Key Errors

**Problem:** Tables created in wrong order

**Solution:**
1. Check if schema file has correct order
2. Make sure reference tables (colleges, states, etc.) are created first
3. Run schema file completely

---

## Quick Setup Checklist

- [ ] MySQL installed and running
- [ ] Database repo cloned/accessed
- [ ] SQL schema file found
- [ ] Database `campus_care` created
- [ ] Schema SQL file executed
- [ ] Tables verified (`SHOW TABLES;`)
- [ ] `.env` file configured with correct credentials
- [ ] Database connection test passed
- [ ] Server starts without errors
- [ ] Can register/login users

---

## Next Steps After Setup

1. **Populate Reference Data:**
   - Add colleges to `colleges` table
   - Add courses to `courses` table
   - Add states to `states` table
   - Add categories to `local_guide_categories` table

2. **Test All Endpoints:**
   - Register/Login
   - Create blogs
   - Add comments
   - Like blogs
   - Access resources
   - Use local guide

3. **Add Sample Data:**
   - Create test users
   - Create sample blogs
   - Add sample places

---

## Database Schema Reference

Based on your schema, you should have these tables:

- `avatars`
- `states`
- `colleges`
- `courses`
- `local_guide_categories`
- `user_profiles`
- `blog_images`
- `blog`
- `blog_specific_images`
- `blog_comments`
- `blog_likes`
- `academic_resources`
- `places`
- `place_rating`

Make sure all these tables exist before testing!
