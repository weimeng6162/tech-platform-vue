@echo off
cls
echo ========================================
echo   Push to GitHub Repository
echo   https://github.com/weimeng6162/tech-platform-vue
echo ========================================
echo.

cd /d "D:\资源\编程\demo1\tech-platform-vue"

echo Step 1: Checking git remote...
git remote -v

echo.
echo Step 2: Setting remote URL...
git remote set-url origin https://github.com/weimeng6162/tech-platform-vue.git

echo.
echo Step 3: Checking git status...
git status

echo.
echo ========================================
echo   Git Operations
echo ========================================
echo.

echo Step 4: Adding all changes...
git add .

echo.
echo Step 5: Committing changes...
git commit -m "Update: Enhanced dark theme with deep purple background and line patterns, improved navigation layout with TechFlow Logo, optimized component sizes, adjusted sidebar position"

echo.
echo Step 6: Pushing to GitHub...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo   Push failed! Trying force push...
    echo ========================================
    git push -f origin main
)

echo.
echo ========================================
echo   Push Completed!
echo ========================================
echo.
echo Repository: https://github.com/weimeng6162/tech-platform-vue
echo.

pause
