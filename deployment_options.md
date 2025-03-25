# AI Agency Ecosystem SaaS - Deployment Options and Instructions

This document outlines the various deployment options for the AI Agency Ecosystem SaaS application and provides detailed instructions for each approach.

## Table of Contents

1. [Deployment Options Overview](#deployment-options-overview)
2. [Local Development Deployment](#local-development-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Kubernetes Deployment](#kubernetes-deployment)
5. [Cloud Provider Deployments](#cloud-provider-deployments)
   - [AWS Deployment](#aws-deployment)
   - [Azure Deployment](#azure-deployment)
   - [Google Cloud Platform Deployment](#google-cloud-platform-deployment)
6. [Serverless Deployment](#serverless-deployment)
7. [Database Setup and Migration](#database-setup-and-migration)
8. [Environment Configuration](#environment-configuration)
9. [Continuous Integration and Deployment](#continuous-integration-and-deployment)
10. [Monitoring and Logging](#monitoring-and-logging)

## Deployment Options Overview

The AI Agency Ecosystem SaaS application can be deployed using various approaches, each with its own advantages and considerations:

| Deployment Option | Advantages | Considerations | Best For |
|-------------------|------------|---------------|----------|
| Local Development | Simple setup, easy debugging | Not suitable for production | Development, testing |
| Docker | Consistent environments, easy scaling | Requires Docker knowledge | Small to medium deployments |
| Kubernetes | Advanced orchestration, high availability | Complex setup, higher learning curve | Large-scale deployments |
| AWS | Managed services, high reliability | AWS-specific knowledge required | Enterprise deployments |
| Azure | Strong integration with Microsoft ecosystem | Azure-specific knowledge required | Microsoft-centric organizations |
| GCP | Strong AI/ML capabilities | GCP-specific knowledge required | Data-intensive applications |
| Serverless | Low maintenance, auto-scaling | Cold starts, vendor lock-in | Variable workloads |

Choose the deployment option that best fits your organization's requirements, technical expertise, and budget constraints.

## Local Development Deployment

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL 14.x or higher

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/ai-agency-ecosystem.git
   cd ai-agency-ecosystem
   ```

2. Install dependencies for both backend and frontend:
   ```bash
   # Install backend dependencies
   cd backend/ai_agency_backend
   npm install

   # Install frontend dependencies
   cd ../../frontend/ai_agency_frontend
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Backend
   cd ../../backend/ai_agency_backend
   cp .env.example .env
   # Edit .env file with your configuration

   # Frontend
   cd ../../frontend/ai_agency_frontend
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. Set up the database:
   ```bash
   cd ../../backend/ai_agency_backend
   npx wrangler d1 execute DB --local --file=migrations/0001_initial.sql
   ```

5. Start the development servers:
   ```bash
   # Start backend
   cd ../../backend/ai_agency_backend
   npm run dev

   # Start frontend in a new terminal
   cd ../../frontend/ai_agency_frontend
   npm run dev
   ```

6. Access the application:
   - Backend API: http://localhost:3000/api
   - Frontend: http://localhost:3001

## Docker Deployment

### Prerequisites

- Docker 20.x or higher
- Docker Compose 2.x or higher

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/ai-agency-ecosystem.git
   cd ai-agency-ecosystem
   ```

2. Build and start the Docker containers:
   ```bash
   docker-compose up -d --build
   ```

3. Access the application:
   - Backend API: http://localhost:3000/api
   - Frontend: http://localhost:3001

### Docker Compose Configuration

Create a `docker-compose.yml` file in the root directory:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: ai_agency
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build:
      context: ./backend/ai_agency_backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/ai_agency
      NODE_ENV: production
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
    depends_on:
      - postgres
    ports:
      - "3000:3000"

  frontend:
    build:
      context: ./frontend/ai_agency_frontend
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: http://backend:3000/api
    ports:
      - "3001:3000"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Dockerfile for Backend

Create a `Dockerfile` in the `backend/ai_agency_backend` directory:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Dockerfile for Frontend

Create a `Dockerfile` in the `frontend/ai_agency_frontend` directory:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (v1.22+)
- kubectl CLI
- Helm 3.x

### Steps

1. Create Kubernetes namespace:
   ```bash
   kubectl create namespace ai-agency
   ```

2. Deploy PostgreSQL using Helm:
   ```bash
   helm repo add bitnami https://charts.bitnami.com/bitnami
   helm install postgres bitnami/postgresql \
     --namespace ai-agency \
     --set auth.username=postgres \
     --set auth.password=postgres \
     --set auth.database=ai_agency
   ```

3. Create Kubernetes configuration files:

   **backend-deployment.yaml**:
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: backend
     namespace: ai-agency
   spec:
     replicas: 2
     selector:
       matchLabels:
         app: backend
     template:
       metadata:
         labels:
           app: backend
       spec:
         containers:
         - name: backend
           image: your-registry/ai-agency-backend:latest
           ports:
           - containerPort: 3000
           env:
           - name: DATABASE_URL
             value: postgresql://postgres:postgres@postgres:5432/ai_agency
           - name: NODE_ENV
             value: production
           - name: GOOGLE_CLIENT_ID
             valueFrom:
               secretKeyRef:
                 name: auth-secrets
                 key: google-client-id
           - name: GOOGLE_CLIENT_SECRET
             valueFrom:
               secretKeyRef:
                 name: auth-secrets
                 key: google-client-secret
           - name: NEXTAUTH_URL
             value: https://your-domain.com
           - name: NEXTAUTH_SECRET
             valueFrom:
               secretKeyRef:
                 name: auth-secrets
                 key: nextauth-secret
   ```

   **backend-service.yaml**:
   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: backend
     namespace: ai-agency
   spec:
     selector:
       app: backend
     ports:
     - port: 80
       targetPort: 3000
     type: ClusterIP
   ```

   **frontend-deployment.yaml**:
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: frontend
     namespace: ai-agency
   spec:
     replicas: 2
     selector:
       matchLabels:
         app: frontend
     template:
       metadata:
         labels:
           app: frontend
       spec:
         containers:
         - name: frontend
           image: your-registry/ai-agency-frontend:latest
           ports:
           - containerPort: 3000
           env:
           - name: NEXT_PUBLIC_API_URL
             value: https://api.your-domain.com
   ```

   **frontend-service.yaml**:
   ```yaml
   apiVersion: v1
   kind: Service
   metadata:
     name: frontend
     namespace: ai-agency
   spec:
     selector:
       app: frontend
     ports:
     - port: 80
       targetPort: 3000
     type: ClusterIP
   ```

   **ingress.yaml**:
   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: ai-agency-ingress
     namespace: ai-agency
     annotations:
       kubernetes.io/ingress.class: nginx
       cert-manager.io/cluster-issuer: letsencrypt-prod
   spec:
     tls:
     - hosts:
       - your-domain.com
       - api.your-domain.com
       secretName: ai-agency-tls
     rules:
     - host: your-domain.com
       http:
         paths:
         - path: /
           pathType: Prefix
           backend:
             service:
               name: frontend
               port:
                 number: 80
     - host: api.your-domain.com
       http:
         paths:
         - path: /
           pathType: Prefix
           backend:
             service:
               name: backend
               port:
                 number: 80
   ```

4. Create secrets:
   ```bash
   kubectl create secret generic auth-secrets \
     --namespace ai-agency \
     --from-literal=google-client-id=your-google-client-id \
     --from-literal=google-client-secret=your-google-client-secret \
     --from-literal=nextauth-secret=your-nextauth-secret
   ```

5. Apply Kubernetes configurations:
   ```bash
   kubectl apply -f backend-deployment.yaml
   kubectl apply -f backend-service.yaml
   kubectl apply -f frontend-deployment.yaml
   kubectl apply -f frontend-service.yaml
   kubectl apply -f ingress.yaml
   ```

6. Verify deployments:
   ```bash
   kubectl get pods -n ai-agency
   kubectl get services -n ai-agency
   kubectl get ingress -n ai-agency
   ```

## Cloud Provider Deployments

### AWS Deployment

#### Option 1: AWS Elastic Beanstalk

1. Install the EB CLI:
   ```bash
   pip install awsebcli
   ```

2. Initialize EB application:
   ```bash
   cd backend/ai_agency_backend
   eb init ai-agency-backend --platform node.js --region us-east-1
   ```

3. Create EB environment:
   ```bash
   eb create production
   ```

4. Deploy frontend to S3 and CloudFront:
   ```bash
   cd ../../frontend/ai_agency_frontend
   npm run build
   aws s3 sync out/ s3://your-bucket-name/
   ```

5. Set up CloudFront distribution for the S3 bucket.

#### Option 2: AWS ECS with Fargate

1. Create ECR repositories for backend and frontend.

2. Build and push Docker images:
   ```bash
   # Backend
   cd backend/ai_agency_backend
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com
   docker build -t your-account-id.dkr.ecr.us-east-1.amazonaws.com/ai-agency-backend:latest .
   docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/ai-agency-backend:latest

   # Frontend
   cd ../../frontend/ai_agency_frontend
   docker build -t your-account-id.dkr.ecr.us-east-1.amazonaws.com/ai-agency-frontend:latest .
   docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/ai-agency-frontend:latest
   ```

3. Create ECS cluster, task definitions, and services using AWS Console or AWS CLI.

4. Set up Application Load Balancer for routing traffic.

### Azure Deployment

#### Option 1: Azure App Service

1. Create Azure App Service for backend:
   ```bash
   az group create --name ai-agency-rg --location eastus
   az appservice plan create --name ai-agency-plan --resource-group ai-agency-rg --sku B1 --is-linux
   az webapp create --name ai-agency-backend --resource-group ai-agency-rg --plan ai-agency-plan --runtime "NODE|18-lts"
   ```

2. Deploy backend:
   ```bash
   cd backend/ai_agency_backend
   zip -r ../backend.zip .
   az webapp deployment source config-zip --resource-group ai-agency-rg --name ai-agency-backend --src ../backend.zip
   ```

3. Create Azure App Service for frontend:
   ```bash
   az webapp create --name ai-agency-frontend --resource-group ai-agency-rg --plan ai-agency-plan --runtime "NODE|18-lts"
   ```

4. Deploy frontend:
   ```bash
   cd ../../frontend/ai_agency_frontend
   zip -r ../frontend.zip .
   az webapp deployment source config-zip --resource-group ai-agency-rg --name ai-agency-frontend --src ../frontend.zip
   ```

#### Option 2: Azure Container Apps

1. Create Azure Container Registry:
   ```bash
   az acr create --name aiagencyregistry --resource-group ai-agency-rg --sku Basic --admin-enabled true
   ```

2. Build and push Docker images:
   ```bash
   # Backend
   cd backend/ai_agency_backend
   az acr build --registry aiagencyregistry --image ai-agency-backend:latest .

   # Frontend
   cd ../../frontend/ai_agency_frontend
   az acr build --registry aiagencyregistry --image ai-agency-frontend:latest .
   ```

3. Create Azure Container Apps:
   ```bash
   az containerapp create \
     --name ai-agency-backend \
     --resource-group ai-agency-rg \
     --image aiagencyregistry.azurecr.io/ai-agency-backend:latest \
     --target-port 3000 \
     --ingress external

   az containerapp create \
     --name ai-agency-frontend \
     --resource-group ai-agency-rg \
     --image aiagencyregistry.azurecr.io/ai-agency-frontend:latest \
     --target-port 3000 \
     --ingress external
   ```

### Google Cloud Platform Deployment

#### Option 1: Google App Engine

1. Create `app.yaml` for backend:
   ```yaml
   runtime: nodejs18
   env: standard
   instance_class: F2

   env_variables:
     NODE_ENV: "production"
     DATABASE_URL: "postgresql://postgres:postgres@/ai_agency?host=/cloudsql/your-project:us-central1:ai-agency-db"
     GOOGLE_CLIENT_ID: "your-google-client-id"
     GOOGLE_CLIENT_SECRET: "your-google-client-secret"
     NEXTAUTH_URL: "https://your-backend-url.appspot.com"
     NEXTAUTH_SECRET: "your-nextauth-secret"

   beta_settings:
     cloud_sql_instances: your-project:us-central1:ai-agency-db
   ```

2. Deploy backend:
   ```bash
   cd backend/ai_agency_backend
   gcloud app deploy
   ```

3. Create `app.yaml` for frontend:
   ```yaml
   runtime: nodejs18
   env: standard
   instance_class: F2

   env_variables:
     NEXT_PUBLIC_API_URL: "https://your-backend-url.appspot.com/api"
   ```

4. Deploy frontend:
   ```bash
   cd ../../frontend/ai_agency_frontend
   gcloud app deploy
   ```

#### Option 2: Google Cloud Run

1. Build and push Docker images:
   ```bash
   # Backend
   cd backend/ai_agency_backend
   gcloud builds submit --tag gcr.io/your-project/ai-agency-backend

   # Frontend
   cd ../../frontend/ai_agency_frontend
   gcloud builds submit --tag gcr.io/your-project/ai-agency-frontend
   ```

2. Deploy to Cloud Run:
   ```bash
   # Backend
   gcloud run deploy ai-agency-backend \
     --image gcr.io/your-project/ai-agency-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars="DATABASE_URL=postgresql://postgres:postgres@/ai_agency?host=/cloudsql/your-project:us-central1:ai-agency-db,GOOGLE_CLIENT_ID=your-google-client-id,GOOGLE_CLIENT_SECRET=your-google-client-secret,NEXTAUTH_URL=https://ai-agency-backend-hash.run.app,NEXTAUTH_SECRET=your-nextauth-secret"

   # Frontend
   gcloud run deploy ai-agency-frontend \
     --image gcr.io/your-project/ai-agency-frontend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars="NEXT_PUBLIC_API_URL=https://ai-agency-backend-hash.run.app/api"
   ```

## Serverless Deployment

### Vercel Deployment

1. Create a Vercel account and install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy backend:
   ```bash
   cd backend/ai_agency_backend
   vercel
   ```

3. Deploy frontend:
   ```bash
   cd ../../frontend/ai_agency_frontend
   vercel
   ```

4. Set up environment variables in the Vercel dashboard.

### AWS Lambda + API Gateway

1. Install Serverless Framework:
   ```bash
   npm install -g serverless
   ```

2. Create `serverless.yml` for backend:
   ```yaml
   service: ai-agency-backend

   provider:
     name: aws
     runtime: nodejs18.x
     region: us-east-1
     environment:
       DATABASE_URL: ${param:DATABASE_URL}
       GOOGLE_CLIENT_ID: ${param:GOOGLE_CLIENT_ID}
       GOOGLE_CLIENT_SECRET: ${param:GOOGLE_CLIENT_SECRET}
       NEXTAUTH_URL: ${param:NEXTAUTH_URL}
       NEXTAUTH_SECRET: ${param:NEXTAUTH_SECRET}

   functions:
     api:
       handler: serverless.handler
       events:
         - http:
             path: /{proxy+}
             method: any
   ```

3. Deploy backend:
   ```bash
   cd backend/ai_agency_backend
   serverless deploy
   ```

4. Deploy frontend to S3 and CloudFront as described in the AWS deployment section.

## Database Setup and Migration

### PostgreSQL Setup

1. Create PostgreSQL database:
   ```sql
   CREATE DATABASE ai_agency;
   CREATE USER ai_agency_user WITH ENCRYPTED PASSWORD 'your-password';
   GRANT ALL PRIVILEGES ON DATABASE ai_agency TO ai_agency_user;
   ```

2. Run migrations:
   ```bash
   cd backend/ai_agency_backend
   npx wrangler d1 migrations apply DB
   ```

### Database Backup and Restore

1. Backup database:
   ```bash
   pg_dump -U postgres -d ai_agency > backup.sql
   ```

2. Restore database:
   ```bash
   psql -U postgres -d ai_agency < backup.sql
   ```

## Environment Configuration

### Required Environment Variables

#### Backend

Create a `.env` file in the `backend/ai_agency_backend` directory:

```
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_agency

# Authentication
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Application
NODE_ENV=development
```

#### Frontend

Create a `.env` file in the `frontend/ai_agency_frontend` directory:

```
# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Authentication
NEXT_PUBLIC_NEXTAUTH_URL=http://localhost:3000
```

## Continuous Integration and Deployment

### GitHub Actions

Create a `.github/workflows/ci-cd.yml` file:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install backend dependencies
        run: |
          cd backend/ai_agency_backend
          npm ci
      
      - name: Run backend tests
        run: |
          cd backend/ai_agency_backend
          npm test
      
      - name: Install frontend dependencies
        run: |
          cd frontend/ai_agency_frontend
          npm ci
      
      - name: Run frontend tests
        run: |
          cd frontend/ai_agency_frontend
          npm test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        run: |
          # Add deployment commands here
          # For example, deploy to Vercel:
          npm install -g vercel
          cd backend/ai_agency_backend
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
          cd ../../frontend/ai_agency_frontend
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

### GitLab CI/CD

Create a `.gitlab-ci.yml` file:

```yaml
stages:
  - test
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: node:${NODE_VERSION}
  script:
    - cd backend/ai_agency_backend
    - npm ci
    - npm test
    - cd ../../frontend/ai_agency_frontend
    - npm ci
    - npm test

deploy:
  stage: deploy
  image: node:${NODE_VERSION}
  only:
    - main
  script:
    # Add deployment commands here
    # For example, deploy to Vercel:
    - npm install -g vercel
    - cd backend/ai_agency_backend
    - vercel --prod --token ${VERCEL_TOKEN}
    - cd ../../frontend/ai_agency_frontend
    - vercel --prod --token ${VERCEL_TOKEN}
```

## Monitoring and Logging

### Application Monitoring

1. Set up Prometheus and Grafana for monitoring:
   - Deploy Prometheus and Grafana using Helm charts
   - Configure Prometheus to scrape metrics from your application
   - Set up Grafana dashboards for visualizing metrics

2. Implement health check endpoints:
   ```typescript
   // backend/ai_agency_backend/src/app/api/health/route.ts
   import { NextResponse } from 'next/server';
   import { db } from '@/lib/db';

   export async function GET() {
     try {
       // Check database connection
       await db.execute('SELECT 1');
       
       return NextResponse.json({
         status: 'healthy',
         timestamp: new Date().toISOString(),
         services: {
           database: 'up'
         }
       });
     } catch (error) {
       return NextResponse.json({
         status: 'unhealthy',
         timestamp: new Date().toISOString(),
         services: {
           database: 'down'
         },
         error: error.message
       }, { status: 500 });
     }
   }
   ```

### Logging

1. Set up centralized logging with ELK Stack (Elasticsearch, Logstash, Kibana) or Cloud provider logging services.

2. Implement structured logging in your application:
   ```typescript
   // backend/ai_agency_backend/src/lib/logger.ts
   import pino from 'pino';

   const logger = pino({
     level: process.env.LOG_LEVEL || 'info',
     transport: {
       target: 'pino-pretty',
       options: {
         colorize: true
       }
     }
   });

   export default logger;
   ```

3. Use the logger throughout your application:
   ```typescript
   import logger from '@/lib/logger';

   logger.info('API request received', { path: '/api/clients', method: 'GET' });
   ```

## Conclusion

This document provides comprehensive deployment options and instructions for the AI Agency Ecosystem SaaS application. Choose the deployment approach that best fits your organization's requirements and technical expertise.

For additional support or questions, please contact the development team or refer to the project documentation.
