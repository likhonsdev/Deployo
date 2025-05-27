@echo off
echo ========================================
echo   Deployo - Python AI Pair-Programmer  
echo   Setup Script for Windows             
echo ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Please install Node.js v18+ before continuing.
    exit /b 1
)

:: Check Node.js version
for /f "tokens=1,2,3 delims=v." %%a in ('node -v') do (
    set "NODE_MAJOR=%%b"
)

if %NODE_MAJOR% LSS 18 (
    echo Node.js version v%NODE_MAJOR% is not supported. Please upgrade to Node.js v18 or later.
    exit /b 1
)

echo [32m✓[0m Node.js is installed

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo npm is not installed. Please install npm before continuing.
    exit /b 1
)

echo [32m✓[0m npm is installed
echo.

:: Create .env file if it doesn't exist
if not exist .env (
    echo [33mCreating .env file...[0m
    copy .env.example .env >nul
    echo [32m✓[0m Created .env file
    echo [33m![0m Please edit the .env file and add your Gemini API key
) else (
    echo [32m✓[0m .env file already exists
)

:: Install dependencies
echo.
echo [34mInstalling dependencies...[0m
call npm install

if %ERRORLEVEL% neq 0 (
    echo [31mFailed to install dependencies. Please try again.[0m
    exit /b 1
)

echo [32m✓[0m Dependencies installed successfully

echo.
echo [32m========================================[0m
echo [32m  Setup completed successfully!  [0m
echo [32m========================================[0m
echo.
echo To start the development server:
echo   [34mnpm run dev[0m
echo.
echo Then open your browser and navigate to:
echo   [34mhttp://localhost:3000[0m
echo.
echo [33mRemember to add your Gemini API key to the .env file.[0m
echo You can get one from: [34mhttps://aistudio.google.com/app/apikey[0m
echo.

pause
