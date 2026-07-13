@echo off
echo ===================================================
echo   AI Smart Hospital - Diabetes Prediction System
echo ===================================================
echo.

echo [1/3] Setting up Python backend...
cd backend
IF NOT EXIST venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo Installing backend requirements...
pip install -r requirements.txt
echo Starting Flask API...
start "AI Smart Hospital - Backend" cmd /c "call venv\Scripts\activate.bat && python app.py"
cd ..

echo.
echo [2/3] Setting up React frontend...
cd frontend
echo Installing frontend dependencies...
call npm install
echo Starting Vite Dev Server...
start "AI Smart Hospital - Frontend" cmd /c "npm run dev"
cd ..

echo.
echo [3/3] Application Started Successfully!
echo.
echo IMPORTANT: Please make sure 'diabetes.pt' is placed inside the 'backend' folder.
echo Backend API is running on: http://localhost:5000
echo Frontend UI is running on: http://localhost:5173
echo.
pause
