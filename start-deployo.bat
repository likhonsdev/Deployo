@echo off
echo ========================================
echo   Deployo - Python AI Pair-Programmer  
echo   With Code Execution                  
echo ========================================
echo.

:: Check if .env file exists
if not exist .env (
    echo [31mERROR: .env file is missing. Please create it from .env.example.[0m
    exit /b 1
)

:: Check if API key is set
findstr /c:"VITE_GEMINI_API_KEY=" .env > nul
if %errorlevel% neq 0 (
    echo [33mWARNING: No Gemini API key found in .env file.[0m
    echo [33mYou need to add your API key to the .env file:[0m
    echo VITE_GEMINI_API_KEY=your_api_key_here
    echo Get a key from: [34mhttps://aistudio.google.com/app/apikey[0m
    echo.
    set /p CONTINUE=Do you want to continue without an API key? (y/n) 
    if /i not "%CONTINUE%"=="y" (
        exit /b 1
    )
)

echo [32mStarting Deployo development server...[0m
echo The application will be available at [34mhttp://localhost:3000[0m
echo Press Ctrl+C to stop the server.
echo.

:: Start the development server
npm run dev
