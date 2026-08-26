# ✅ GURUKUL Setup Checklist

Complete these steps to prepare the project for development:

## Phase 1: Project Initialization

- [ ] **Initialize Git Repository**
  ```bash
  git init
  git add .
  git commit -m "Initial project structure setup"
  ```

- [ ] **Create Root package.json** (Monorepo/Workspace)
  ```bash
  npm init -y
  ```
  Configure workspaces in package.json:
  ```json
  {
    "name": "gurukul",
    "private": true,
    "workspaces": ["src/backend", "src/frontend"]
  }
  ```

- [ ] **Setup .gitignore**
  Create root `.gitignore`:
  ```
  node_modules/
  dist/
  build/
  .env*
  !.env.example
  .DS_Store
  *.log
  .vscode/
  .idea/
  ```

- [ ] **Create .env.example files**
  
  **Root `.env.example`** (for reference):
  ```
  # Frontend
  VITE_API_URL=http://localhost:3000/api
  VITE_APP_NAME=GURUKUL

  # Backend
  NODE_ENV=development
  PORT=3000
  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gurukul
  JWT_SECRET=your-super-secret-jwt-key-min-32-chars
  REFRESH_TOKEN_SECRET=your-refresh-token-secret
  
  # Stripe
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_PUBLISHABLE_KEY=pk_test_...
  
  # Anthropic Claude API
  ANTHROPIC_API_KEY=sk-ant-...
  
  # Email Service
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_USER=your-email@gmail.com
  SMTP_PASS=your-app-password
  
  # Cloudinary
  CLOUDINARY_CLOUD_NAME=...
  CLOUDINARY_API_KEY=...
  CLOUDINARY_API_SECRET=...
  
  # Analytics
  POSTHOG_API_KEY=phc_...
  SENTRY_DSN=https://...
  
  # Admin
  ADMIN_EMAIL=admin@gurukul.com
  ```

---

## Phase 2: Backend Setup

- [ ] **Initialize Backend**
  ```bash
  cd src/backend
  npm init -y
  ```

- [ ] **Install Backend Dependencies**
  ```bash
  npm install express mongoose dotenv cors helmet express-rate-limit
  npm install jsonwebtoken bcryptjs nodemailer axios stripe
  npm install winston express-validator multer
  npm install --save-dev nodemon jest supertest typescript @types/node
  ```

- [ ] **Create Backend Structure Files**

  **`src/backend/server.js`**:
  ```javascript
  require('dotenv').config();
  const app = require('./app');
  
  const PORT = process.env.PORT || 3000;
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
  ```

  **`src/backend/app.js`**:
  ```javascript
  const express = require('express');
  const helmet = require('helmet');
  const cors = require('cors');
  
  const app = express();
  
  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  
  // Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
  });
  
  // Error handling
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message });
  });
  
  module.exports = app;
  ```

- [ ] **Setup Database Connection**
  
  **`src/backend/config/database.js`**:
  ```javascript
  const mongoose = require('mongoose');
  
  const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✓ MongoDB connected');
    } catch (error) {
      console.error('✗ MongoDB connection failed:', error);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;
  ```

- [ ] **Create package.json scripts**
  ```json
  {
    "scripts": {
      "start": "node server.js",
      "dev": "nodemon server.js",
      "test": "jest",
      "lint": "eslint ."
    }
  }
  ```

---

## Phase 3: Frontend Setup

- [ ] **Create Frontend (Vite)**
  ```bash
  npm create vite@latest src/frontend -- --template react-ts
  cd src/frontend
  npm install
  ```

- [ ] **Install Frontend Dependencies**
  ```bash
  npm install axios react-router-dom zustand react-hook-form
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```

- [ ] **Setup Tailwind CSS**
  
  **`src/frontend/tailwind.config.js`**:
  ```javascript
  export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          gold: '#D4AF37',
          dark: '#1a1a1a',
        },
      },
    },
    plugins: [],
  }
  ```

- [ ] **Create .env.local template**
  ```
  VITE_API_URL=http://localhost:3000/api
  VITE_APP_NAME=GURUKUL
  ```

- [ ] **Create package.json scripts**
  ```json
  {
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview",
      "type-check": "tsc --noEmit"
    }
  }
  ```

---

## Phase 4: Shared Setup

- [ ] **Create shared types**
  
  **`src/shared/types/index.ts`**:
  ```typescript
  export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    createdAt: Date;
  }
  
  export interface Program {
    id: string;
    category: 'gym' | 'english' | 'cricket';
    name: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  }
  ```

- [ ] **Create shared constants**
  
  **`src/shared/constants/index.ts`**:
  ```typescript
  export const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';
  
  export const CATEGORIES = ['gym', 'english', 'cricket', 'career', 'meditation'] as const;
  
  export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
  ```

---

## Phase 5: Infrastructure & CI/CD

- [ ] **Create Docker Configuration**
  
  **`infra/docker/docker-compose.yml`**:
  ```yaml
  version: '3.8'
  services:
    mongodb:
      image: mongo:6.0
      ports:
        - "27017:27017"
      volumes:
        - mongo_data:/data/db
    
    backend:
      build:
        context: ../../src/backend
        dockerfile: ../../infra/docker/Dockerfile.backend
      ports:
        - "3000:3000"
      environment:
        - MONGODB_URI=mongodb://mongodb:27017/gurukul
      depends_on:
        - mongodb
    
    frontend:
      build:
        context: ../../src/frontend
        dockerfile: ../../infra/docker/Dockerfile.frontend
      ports:
        - "5173:5173"
      depends_on:
        - backend
  
  volumes:
    mongo_data:
  ```

- [ ] **Create GitHub Actions Workflows**
  
  **`.github/workflows/backend-tests.yml`**:
  ```yaml
  name: Backend Tests
  on: [push, pull_request]
  jobs:
    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-node@v3
          with:
            node-version: '20'
        - run: cd src/backend && npm ci && npm test
  ```

- [ ] **Setup Deployment Config**
  
  **`infra/deployment/vercel.json`** (Frontend):
  ```json
  {
    "buildCommand": "npm run build",
    "outputDirectory": "dist"
  }
  ```

---

## Phase 6: Development Setup

- [ ] **Install ESLint & Prettier**
  ```bash
  npm install --save-dev eslint prettier eslint-config-prettier
  npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
  ```

- [ ] **Create `.eslintrc.json`**
  ```json
  {
    "extends": ["eslint:recommended", "prettier"],
    "parser": "@typescript-eslint/parser",
    "plugins": ["@typescript-eslint"],
    "env": {
      "node": true,
      "es2022": true
    }
  }
  ```

- [ ] **Create `.prettierrc`**
  ```json
  {
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5"
  }
  ```

- [ ] **Setup VS Code Extensions** (.vscode/extensions.json)
  ```json
  {
    "recommendations": [
      "dbaeumer.vscode-eslint",
      "esbenp.prettier-vscode",
      "mongodb.mongodb-vscode",
      "ms-vscode.makefile-tools"
    ]
  }
  ```

---

## Phase 7: Documentation

- [ ] **Create API Documentation** (`docs/api/endpoints.md`)
  - Document all REST endpoints
  - Include request/response examples
  - Add authentication requirements

- [ ] **Create Database Schema Docs** (`docs/design/database-schema.md`)
  - Document MongoDB collections
  - Show relationships between models

- [ ] **Create Architecture Docs** (`docs/design/architecture.md`)
  - System design diagrams
  - Data flow illustrations
  - Deployment architecture

---

## Phase 8: Initial Development

- [ ] **Create Auth System**
  - User model
  - Authentication routes
  - JWT middleware
  - Registration & login

- [ ] **Create User Profile System**
  - User profile model
  - Profile management API
  - Onboarding flow

- [ ] **Create Admin Dashboard Skeleton**
  - Basic layout
  - Navigation structure
  - Role-based access

- [ ] **Setup First Category (Gym)**
  - Program model
  - Program routes
  - Program listing UI

---

## 🎯 Quick Start Command Reference

```bash
# Initial setup
npm run setup

# Development
npm run dev        # Start both servers
cd src/backend && npm run dev  # Just backend
cd src/frontend && npm run dev # Just frontend

# Testing
npm run test
npm run test:e2e

# Building
npm run build

# Code quality
npm run lint
npm run format

# Database
npm run db:seed
npm run db:migrate
```

---

## 📝 Notes

- **Database**: Start with local MongoDB, migrate to Atlas after MVP
- **Payments**: Use Stripe test keys during development
- **AI**: Get Claude API key from Anthropic dashboard
- **Env Files**: Never commit `.env`, always use `.env.example` as template

## ⚠️ Critical Path Items

**Must Complete Before MVP:**
1. Auth system (registration, login, JWT)
2. User profile system
3. Gym category MVP
4. Landing page
5. Deployment pipeline

**Can Defer:**
- Email service setup (use console.log first)
- Analytics integration
- Complex AI features
- Community features

---

Last Updated: August 25, 2026
