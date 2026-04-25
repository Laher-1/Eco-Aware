@echo off
echo Setting up MySQL database for EcoAware...

REM Check if .env file exists and has password
if not exist ".env" (
    echo Error: .env file not found. Please create it with your MySQL credentials.
    pause
    exit /b 1
)

REM Read password from .env file
for /f "tokens=2 delims==" %%a in ('findstr "DB_PASSWORD" .env') do set DB_PASSWORD=%%a

if "%DB_PASSWORD%"=="your_mysql_password_here" (
    echo Error: Please update the DB_PASSWORD in .env file with your actual MySQL root password.
    pause
    exit /b 1
)

echo Creating database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p%DB_PASSWORD% -e "CREATE DATABASE IF NOT EXISTS ecoaware;"

if %errorlevel% neq 0 (
    echo Error: Failed to create database. Please check your MySQL credentials.
    pause
    exit /b 1
)

echo Database created successfully!
echo Running schema...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p%DB_PASSWORD% ecoaware < setup-schema.sql

if %errorlevel% neq 0 (
    echo Error: Failed to run schema. Please check the setup-schema.sql file.
    pause
    exit /b 1
)

echo Schema applied successfully!
echo Database setup complete.
pause