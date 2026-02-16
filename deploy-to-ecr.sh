#!/bin/bash

# MyHealth ECR Deployment Script
# Update the variables below with your actual AWS details

# Configuration - UPDATE THESE VALUES
AWS_REGION="us-east-1"                    # Your AWS region
AWS_ACCOUNT_ID="123456789012"             # Your AWS account ID
BACKEND_REPO="myhealth-backend"           # Your backend ECR repository name
FRONTEND_REPO="myhealth-frontend"         # Your frontend ECR repository name

echo "🚀 Starting MyHealth deployment to ECR..."
echo "Region: $AWS_REGION"
echo "Account: $AWS_ACCOUNT_ID"
echo "Backend Repo: $BACKEND_REPO"
echo "Frontend Repo: $FRONTEND_REPO"
echo ""

# Step 1: Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

if [ $? -ne 0 ]; then
    echo "❌ ECR login failed. Please check your AWS credentials and region."
    exit 1
fi

echo "✅ ECR login successful"
echo ""

# Step 2: Build backend image
echo "🔨 Building backend image..."
docker build -f Dockerfile.backend -t myhealth-backend .

if [ $? -ne 0 ]; then
    echo "❌ Backend build failed."
    exit 1
fi

echo "✅ Backend image built successfully"
echo ""

# Step 3: Build frontend image
echo "🔨 Building frontend image..."
docker build -f Dockerfile.frontend -t myhealth-frontend .

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed."
    exit 1
fi

echo "✅ Frontend image built successfully"
echo ""

# Step 4: Tag images
echo "🏷️  Tagging images..."
docker tag myhealth-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO:latest
docker tag myhealth-frontend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO:latest

echo "✅ Images tagged successfully"
echo ""

# Step 5: Push backend image
echo "📤 Pushing backend image to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO:latest

if [ $? -ne 0 ]; then
    echo "❌ Backend push failed."
    exit 1
fi

echo "✅ Backend image pushed successfully"
echo ""

# Step 6: Push frontend image
echo "📤 Pushing frontend image to ECR..."
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO:latest

if [ $? -ne 0 ]; then
    echo "❌ Frontend push failed."
    exit 1
fi

echo "✅ Frontend image pushed successfully"
echo ""

# Step 7: Display final image URIs
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Your image URIs:"
echo "Backend:  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$BACKEND_REPO:latest"
echo "Frontend: $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$FRONTEND_REPO:latest"
echo ""
echo "💡 Use these URIs in your ECS task definitions or Kubernetes deployments"