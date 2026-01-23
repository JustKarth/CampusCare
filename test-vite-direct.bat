@echo off
echo Testing Vite directly...
cd /d "d:\College\Project\CampusCare\frontend\react"

echo Testing if Vite is installed...
where npx
if %errorlevel% neq 0 (
    echo ERROR: npx not found
    pause
    exit /b 1
)

echo.
echo Running npx vite --version...
npx vite --version

echo.
echo Running npx vite --port 3000...
npx vite --port 3000 --host 0.0.0.0

pause
