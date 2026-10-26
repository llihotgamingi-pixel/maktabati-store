@echo off
chcp 65001 >nul
echo ==========================================
echo        مرحباً بك في نظام "مكتبتي"
echo ==========================================
echo.
echo جاري فحص وتثبيت الملفات المطلوبة (قد يستغرق دقيقة)...
call npm run install:all
echo.
echo جاري تشغيل النظام...
echo سيتم تشغيل المتجر الان، يمكنك الذهاب الى المتصفح
start http://localhost:5173
call npm run dev
pause
