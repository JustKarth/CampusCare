@echo off
echo Running database initialization and check...
cd /d "d:\College\Project\CampusCare\backend

echo Step 1: Running init-database.js...
node scripts\init-database.js

echo.
echo Step 2: Running check-database.js...
node check-database.js

pause
