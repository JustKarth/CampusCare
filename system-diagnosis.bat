@echo off
echo Final diagnosis - checking system configuration...
cd /d "d:\College\Project\CampusCare\frontend\react

echo Checking Windows version...
ver

echo.
echo Checking PATH...
echo %PATH%

echo.
echo Checking if Node.js exists...
dir "C:\Program Files\nodejs\node.exe" 2>&1
dir "C:\Program Files (x86)\nodejs\node.exe" 2>&1

echo.
echo Checking if Python exists...
python --version 2>&1
py --version 2>&1

echo.
echo Checking network interfaces...
ipconfig | findstr "IPv4"

echo.
echo Checking firewall status...
netsh advfirewall show allprofiles

echo.
echo Creating a simple test file that should work...
echo This is a test file > test.txt
echo Test file created successfully.
type test.txt

pause
