@echo off
REM MyHealth ECR Deployment Script for Windows
REM Update the variables below with your actual AWS details

REM Configuration - UPDATE THESE VALUES
set AWS_REGION=us-east-1
set AWS_ACCOUNT_ID=123456789012
set BACKEND_REPO=myhealth-backend
set FRONTEND_REPO=myhealth-frontend

echo 🚀 Starting MyHealth deployment to ECR...
echo Region: %AWS_REGION%
echo Account: %AWS_ACCOUNT_ID%
echo Backend Repo: %BACKEND_REPO%
echo Frontend Repo: %FRONTEND_REPO%
echo.

REM Step 1: Login to ECR
echo 🔐 Logging into ECR...
aws ecr get-login-password --region %AWS_REGION% | docker login --username AWS --password-stdin %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com

if %errorlevel% neq 0 (
    echo ❌ ECR login failed. Please check your AWS credentials and region.
    pause
    exit /b 1
)

echo ✅ ECR login successful
echo.

REM Step 2: Build backend image
echo 🔨 Building backend image...
docker build -f Dockerfile.backend -t myhealth-backend .

if %errorlevel% neq 0 (
    echo ❌ Backend build failed.
    pause
    exit /b 1
)

echo ✅ Backend image built successfully
echo.

REM Step 3: Build frontend image
echo 🔨 Building frontend image...
docker build -f Dockerfile.frontend -t myhealth-frontend .

if %errorlevel% neq 0 (
    echo ❌ Frontend build failed.
    pause
    exit /b 1
)

echo ✅ Frontend image built successfully
echo.

REM Step 4: Tag images
echo 🏷️  Tagging images...
docker tag myhealth-backend:latest %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com/%BACKEND_REPO%:latest
docker tag myhealth-frontend:latest %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com/%FRONTEND_REPO%:latest

echo ✅ Images tagged successfully
echo.

REM Step 5: Push backend image
echo 📤 Pushing backend image to ECR...
docker push %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com/%BACKEND_REPO%:latest

if %errorlevel% neq 0 (
    echo ❌ Backend push failed.
    pause
    exit /b 1
)

echo ✅ Backend image pushed successfully
echo.

REM Step 6: Push frontend image
echo 📤 Pushing frontend image to ECR...
docker push %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com/%FRONTEND_REPO%:latest

if %errorlevel% neq 0 (
    echo ❌ Frontend push failed.
    pause
    exit /b 1
)

echo ✅ Frontend image pushed successfully
echo.

REM Step 7: Display final image URIs
echo 🎉 Deployment completed successfully!
echo.
echo 📋 Your image URIs:
echo Backend:  %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com/%BACKEND_REPO%:latest
echo Frontend: %AWS_ACCOUNT_ID%.dkr.ecr.%AWS_REGION%.amazonaws.com/%FRONTEND_REPO%:latest
echo.
echo 💡 Use these URIs in your ECS task definitions or Kubernetes deployments
pause