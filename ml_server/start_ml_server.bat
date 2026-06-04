@echo off
echo =======================================
echo  Nutrivision ML Server (Flask)
echo  Port: 5001
echo =======================================
cd /d "%~dp0"

REM Prioritaskan Python 3.12 (karena TensorFlow butuh 3.12)
py -3.12 --version >nul 2>&1
if %errorlevel% == 0 (
    echo [INFO] Menggunakan: Python 3.12
    py -3.12 app.py
) else (
    echo [WARNING] Python 3.12 spesifik tidak ditemukan. Mencoba fallback ke 'python' standar...
    where python >nul 2>&1
    if %errorlevel% == 0 (
        python app.py
    ) else (
        echo [ERROR] Python tidak ditemukan! Pastikan Python 3.12 sudah terinstall dan ada di PATH.
        pause
        exit /b 1
    )
)
pause
