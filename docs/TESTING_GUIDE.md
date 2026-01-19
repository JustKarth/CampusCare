# Campus Care API Testing Guide

## Prerequisites
1. Make sure your `.env` file has:
   - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - `JWT_SECRET`
   - `PORT` (optional, defaults to 5000)
   - `NODE_ENV=development`

2. Make sure your database is running and accessible

3. Install dependencies: `npm install`

## Starting the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server should start on: `http://localhost:5000`

---

## Testing Endpoints

### 1. Test Root Route (No Auth Required)

**GET** `http://localhost:5000/`

Expected Response:
```json
{
  "success": true,
  "message": "Campus Care API running",
  "version": "1.0.0"
}
```

---

### 2. Test Authentication

#### Register a New User

**POST** `http://localhost:5000/api/auth/register`

Headers:
```
Content-Type: application/json
```

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

Expected Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 1,
    "email": "student@college.edu",
    "firstName": "John",
    "lastName": "Doe",
    "collegeId": 5
  }
}
```

**Save the token for next requests!**

#### Login

**POST** `http://localhost:5000/api/auth/login`

Body:
```json
{
  "email": "student@college.edu",
  "password": "password123"
}
```

Expected Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### Get Profile

**GET** `http://localhost:5000/api/auth/profile`

Headers:
```
Authorization: Bearer <your_token_here>
```

---

### 3. Test Blogs (Public - No Auth Required)

#### Get All Blogs

**GET** `http://localhost:5000/api/blogs?page=1&limit=10`

#### Get Single Blog

**GET** `http://localhost:5000/api/blogs/1`

---

### 4. Test Blogs (Student Only - Auth Required)

#### Create Blog

**POST** `http://localhost:5000/api/blogs`

Headers:
```
Authorization: Bearer <your_token_here>
Content-Type: application/json
```

Body:
```json
{
  "blog_title": "My First Blog Post",
  "blog_content": "This is the content of my blog post..."
}
```

#### Update Blog

**PUT** `http://localhost:5000/api/blogs/1`

Headers:
```
Authorization: Bearer <your_token_here>
Content-Type: application/json
```

Body:
```json
{
  "blog_title": "Updated Title",
  "blog_content": "Updated content..."
}
```

#### Delete Blog

**DELETE** `http://localhost:5000/api/blogs/1`

Headers:
```
Authorization: Bearer <your_token_here>
```

---

### 5. Test Comments

#### Get Comments for a Blog

**GET** `http://localhost:5000/api/blogs/1/comments`

#### Add Comment

**POST** `http://localhost:5000/api/blogs/1/comments`

Headers:
```
Authorization: Bearer <your_token_here>
Content-Type: application/json
```

Body:
```json
{
  "comment_content": "Great blog post!"
}
```

---

### 6. Test Reactions (Likes)

#### Like a Blog

**POST** `http://localhost:5000/api/blogs/1/like`

Headers:
```
Authorization: Bearer <your_token_here>
```

#### Get Like Status

**GET** `http://localhost:5000/api/blogs/1/like-status`

Headers:
```
Authorization: Bearer <your_token_here>
```

#### Unlike a Blog

**DELETE** `http://localhost:5000/api/blogs/1/like`

Headers:
```
Authorization: Bearer <your_token_here>
```

---

### 7. Test Resources (Student Only)

#### Get Resources

**GET** `http://localhost:5000/api/resources`

Headers:
```
Authorization: Bearer <your_token_here>
```

---

### 8. Test Local Guide (Public)

#### Get Categories

**GET** `http://localhost:5000/api/local-guide/categories`

#### Get Places

**GET** `http://localhost:5000/api/local-guide/places?collegeId=1`

#### Get Places by Category

**GET** `http://localhost:5000/api/local-guide/places/healthcare?collegeId=1`

---

## Testing Tools

### Option 1: Postman
1. Download Postman: https://www.postman.com/downloads/
2. Create a new request
3. Set method (GET, POST, etc.)
4. Enter URL
5. Add headers if needed
6. Add body (for POST/PUT requests)
7. Send request

### Option 2: Thunder Client (VS Code Extension)
1. Install Thunder Client extension in VS Code
2. Click Thunder Client icon in sidebar
3. Create new request
4. Test endpoints directly in VS Code

### Option 3: cURL (Command Line)

Example:
```bash
# Test root route
curl http://localhost:5000/

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@college.edu","password":"password123"}'
```

### Option 4: Browser
- Only works for GET requests
- Open: `http://localhost:5000/`
- Or: `http://localhost:5000/api/local-guide/categories`

---

## Common Issues

### 1. "Cannot connect to database"
- Check your `.env` file has correct database credentials
- Make sure MySQL is running
- Verify database `campus_care` exists

### 2. "JWT_SECRET is not defined"
- Add `JWT_SECRET=your_secret_key` to `.env` file

### 3. "Route not found"
- Check the URL is correct
- Make sure server is running
- Check route path matches exactly

### 4. "Unauthorized" or "Token invalid"
- Make sure you're including the token in headers
- Format: `Authorization: Bearer <token>`
- Token might be expired (7 days)

### 5. "Validation failed"
- Check request body matches required format
- Verify all required fields are present
- Check data types (email format, etc.)

---

## Testing Checklist

- [ ] Server starts without errors
- [ ] Root route works (`GET /`)
- [ ] Register user works (`POST /api/auth/register`)
- [ ] Login works (`POST /api/auth/login`)
- [ ] Get profile works (`GET /api/auth/profile`)
- [ ] Get blogs works (`GET /api/blogs`)
- [ ] Create blog works (`POST /api/blogs`)
- [ ] Update blog works (`PUT /api/blogs/:id`)
- [ ] Delete blog works (`DELETE /api/blogs/:id`)
- [ ] Get comments works (`GET /api/blogs/:id/comments`)
- [ ] Add comment works (`POST /api/blogs/:id/comments`)
- [ ] Like blog works (`POST /api/blogs/:id/like`)
- [ ] Get resources works (`GET /api/resources`)
- [ ] Get local guide categories works (`GET /api/local-guide/categories`)

---

## Next Steps

After testing:
1. Fix any errors found
2. Test edge cases (invalid data, missing fields, etc.)
3. Test authorization (try accessing student-only routes without token)
4. Test validation (try sending invalid data)
5. Test error handling (try accessing non-existent resources)
