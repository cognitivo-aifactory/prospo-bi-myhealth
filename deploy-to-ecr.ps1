# MyHealth ECR Deployment Script for PowerShell
# Update the variables below with your actual AWS details

# Configuration - UPDATE THESE VALUES
$AWS_REGION = "us-east-1"                    # Your AWS region
$AWS_ACCOUNT_ID = "123456789012"             # Your AWS account ID  
$BACKEND_REPO = "myhealth-backend"           # Your backend ECR repository name
$FRONTEND_REPO = "myhealth-frontend"         # Your frontend ECR repository name

Write-Host "🚀 Starting MyHealth deployment to ECR..." -ForegroundColor Green
Write-Host "Region: $AWS_REGION" -ForegroundColor Cyan
Write-Host "Account: $AWS_ACCOUNT_ID" -ForegroundColor Cyan
Write-Host "Backend Repo: $BACKEND_REPO" -ForegroundColor Cyan
Write-Host "Frontend Repo: $FRONTEND_REPO" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login to ECR
Write-Host "🔐 Logging into ECR..." -ForegroundColor Yellow
$loginCommand = "aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
Invoke-Expression $loginCommand

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ ECR login failed. Please check your AWS credentials and region." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ ECR login successful" -ForegroundColor Green
Write-Host ""

# Step 2: Build backend image
Write-Host "🔨 Building backend image..." -ForegroundColor Yellow
docker build -f Dockerfile.backend -t myhealth-backend .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend build failed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Backend image built successfully" -ForegroundColor Green
Write-Host ""

# Step 3: Build frontend image
Write-Host "🔨 Building frontend image..." -ForegroundColor Yellow
docker build -f Dockerfile.frontend -t myhealth-frontend .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Frontend image built successfully" -ForegroundColor Green
Write-Host ""

# Step 4: Tag images
Write-Host "🏷️  Tagging images..." -ForegroundColor Yellow
docker tag myhealth-backend:latest "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO`:latest"
docker tag myhealth-frontend:latest "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO`:latest"

Write-Host "✅ Images tagged successfully" -ForegroundColor Green
Write-Host ""

# Step 5: Push backend image
Write-Host "📤 Pushing backend image to ECR..." -ForegroundColor Yellow
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO`:latest"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend push failed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Backend image pushed successfully" -ForegroundColor Green
Write-Host ""

# Step 6: Push frontend image
Write-Host "📤 Pushing frontend image to ECR..." -ForegroundColor Yellow
docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO`:latest"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend push failed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Frontend image pushed successfully" -ForegroundColor Green
Write-Host ""

# Step 7: Display final image URIs
Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Your image URIs:" -ForegroundColor Cyan
Write-Host "Backend:  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO`:latest" -ForegroundColor White
Write-Host "Frontend: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO`:latest" -ForegroundColor White
Write-Host ""
Write-Host "💡 Use these URIs in your ECS task definitions or Kubernetes deployments" -ForegroundColor Yellow
Read-Host "Press Enter to exit"