#!/bin/bash

# Đăng nhập vào AWS ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin <YOUR-AWS-ACCOUNT-ID>.dkr.ecr.ap-southeast-1.amazonaws.com

# Build Docker image
docker build -t cdtn-backend .

# Tag image
docker tag cdtn-backend:latest <YOUR-AWS-ACCOUNT-ID>.dkr.ecr.ap-southeast-1.amazonaws.com/cdtn-backend:latest

# Push image to ECR
docker push <YOUR-AWS-ACCOUNT-ID>.dkr.ecr.ap-southeast-1.amazonaws.com/cdtn-backend:latest

# Update ECS service
aws ecs update-service --cluster cdtn-cluster --service cdtn-backend-service --force-new-deployment 