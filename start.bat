@echo off
echo 🚀 Starting StoryWeave AI...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo 🔧 Starting backend server...
start "Backend" cmd /k "cd backend && python -m pip install -r requirements.txt && python main.py"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

echo 🎨 Starting frontend server...
start "Frontend" cmd /k "cd frontend && npm install && npm start"

echo ✅ StoryWeave AI is starting up!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
pause
