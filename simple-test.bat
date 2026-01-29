@echo off
echo Creating a simple test to verify Node.js execution...
cd /d "d:\College\Project\CampusCare\frontend\react"

echo Creating test.js file...
echo console.log('Node.js is working!'); > test.js
echo console.log('Current directory:', process.cwd()); >> test.js
echo console.log('Node version:', process.version); >> test.js

echo Running test.js...
node test.js

echo.
echo Checking if test.js was created...
dir test.js

pause
