# GURUKUL - Project Structure Guide

## Overview
GURUKUL is a multi-category personal growth platform built with MERN stack. This document describes the folder organization and conventions.

## Root Directory Structure

```
gurukul/
├── docs/                      # Documentation & Design
├── src/                       # Source code
├── tests/                     # Test suites
├── infra/                     # Infrastructure & deployment
├── scripts/                   # Utility scripts
├── .github/                   # GitHub workflows & CI/CD
└── package.json, .env.example, etc.
```

---

## 📁 `/docs` - Documentation & Design

```
docs/
├── requirements/
│   └── SRS.pdf               # Software Requirements Specification
├── design/
│   ├── reference_design.jpg
│   ├── architecture.md       # System architecture diagrams
│   ├── ui-mockups/          # Figma/design exports
│   └── database-schema.md   # MongoDB schema documentation
└── api/
    ├── endpoints.md          # REST API documentation
    └── webhooks.md          # Third-party webhook specs
```

**Purpose**: Store all non-code documentation, design files, and specifications.

---

## 🔧 `/src` - Source Code

### `/src/backend` - Node.js/Express Server

```
src/backend/
├── config/                   # Configuration & environment setup
│   ├── database.js
│   ├── email.js
│   ├── payment.js           # Stripe config
│   └── ai.js                # Claude API config
│
├── middleware/              # Express middleware
│   ├── auth.js              # JWT, OAuth validation
│   ├── errorHandler.js      # Global error handling
│   ├── validation.js        # Request validation
│   ├── rateLimit.js         # Rate limiting
│   └── cors.js
│
├── models/                  # MongoDB Mongoose models
│   ├── User.js
│   ├── UserProfile.js
│   ├── Gym/
│   │   ├── Program.js
│   │   ├── Workout.js
│   │   └── Progress.js
│   ├── English/
│   │   ├── Lesson.js
│   │   ├── Assessment.js
│   │   └── Progress.js
│   ├── Cricket/
│   │   ├── Drill.js
│   │   ├── Match.js
│   │   └── Analysis.js
│   ├── Community.js
│   ├── Subscription.js
│   └── Analytics.js
│
├── routes/                  # API route handlers
│   ├── auth.js
│   ├── users.js
│   ├── gym.js
│   ├── english.js
│   ├── cricket.js
│   ├── community.js
│   ├── payments.js
│   └── admin.js
│
├── controllers/             # Business logic
│   ├── authController.js
│   ├── userController.js
│   ├── gym/
│   │   ├── programController.js
│   │   ├── workoutController.js
│   │   └── progressController.js
│   ├── english/
│   ├── cricket/
│   ├── communityController.js
│   ├── paymentController.js
│   └── analyticsController.js
│
├── services/                # Reusable business logic
│   ├── AuthService.js       # Auth logic, token generation
│   ├── UserService.js
│   ├── EmailService.js      # Email sending (Nodemailer)
│   ├── PaymentService.js    # Stripe integration
│   ├── AnalyticsService.js  # Event tracking
│   ├── NotificationService.js # Push/SMS
│   ├── ai/
│   │   ├── CoachService.js  # Claude API integration
│   │   ├── ContentGenerator.js
│   │   └── RecommendationEngine.js
│   └── MediaService.js      # Cloudinary/image handling
│
├── utils/                   # Helper functions
│   ├── logger.js            # Winston logging
│   ├── validators.js        # Input validation logic
│   ├── formatters.js        # Data formatting
│   ├── constants.js         # App constants
│   └── helpers.js           # Misc helpers
│
├── validators/              # Request/data validation schemas
│   ├── userValidator.js
│   ├── programValidator.js
│   └── paymentValidator.js
│
├── ai-integration/          # AI/LLM specific code
│   ├── anthropic/
│   │   ├── client.js        # Claude API client wrapper
│   │   ├── prompts/         # Prompt templates
│   │   └── handlers.js
│   └── context-management.js
│
├── jobs/                    # Background jobs (node-cron, bull)
│   ├── dailyNotifications.js
│   ├── progressCalculation.js
│   ├── cleanupTasks.js
│   └── emailReports.js
│
├── app.js                   # Express app configuration
├── server.js                # Entry point
└── .env.example             # Environment template
```

### `/src/frontend` - React Application

```
src/frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared (Header, Footer, Button)
│   │   ├── auth/            # Auth-related (Login, Register)
│   │   ├── layout/
│   │   ├── dashboard/
│   │   ├── gym/
│   │   ├── english/
│   │   ├── cricket/
│   │   ├── community/
│   │   └── admin/
│   │
│   ├── pages/               # Page components (Route handlers)
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Gym/
│   │   ├── English/
│   │   ├── Cricket/
│   │   ├── Community/
│   │   ├── Settings/
│   │   ├── Admin/
│   │   └── NotFound.tsx
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts       # Auth context hook
│   │   ├── useApi.ts        # API call wrapper
│   │   ├── usePagination.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── context/             # React Context (State Management)
│   │   ├── AuthContext.tsx
│   │   ├── UserContext.tsx
│   │   ├── AppContext.tsx   # Global app state
│   │   └── ThemeContext.tsx
│   │
│   ├── store/               # Zustand/Redux state (if used)
│   │   ├── authStore.ts
│   │   ├── userStore.ts
│   │   └── gymStore.ts
│   │
│   ├── services/            # API client & external services
│   │   ├── api/
│   │   │   ├── client.ts    # Axios instance
│   │   │   ├── auth.ts
│   │   │   ├── gym.ts
│   │   │   ├── english.ts
│   │   │   └── cricket.ts
│   │   ├── storage.ts       # LocalStorage service
│   │   └── analytics.ts     # PostHog/analytics
│   │
│   ├── utils/               # Utility functions
│   │   ├── formatters.ts    # Date, currency formatting
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   ├── assets/              # Static files
│   │   ├── images/
│   │   ├── icons/
│   │   └── videos/
│   │
│   ├── styles/              # Global styles
│   │   ├── globals.css
│   │   ├── variables.css    # Design tokens (#D4AF37 gold theme)
│   │   ├── animations.css
│   │   └── responsive.css
│   │
│   ├── types/               # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── api.ts
│   │   ├── models.ts        # User, Program, etc.
│   │   └── auth.ts
│   │
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── vite-env.d.ts
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

### `/src/shared` - Shared Code (Frontend + Backend)

```
src/shared/
├── types/                   # Shared TypeScript types
│   ├── index.ts
│   ├── user.ts
│   ├── program.ts
│   └── api.ts
│
├── constants/               # Shared constants
│   ├── index.ts
│   ├── messages.ts
│   └── config.ts
│
├── validators/              # Shared validation schemas (Zod/Joi)
│   ├── auth.ts
│   ├── program.ts
│   └── payment.ts
│
└── utils/                   # Shared utilities
    ├── date.ts
    ├── string.ts
    └── math.ts
```

---

## 🧪 `/tests` - Testing

```
tests/
├── backend/
│   ├── unit/                # Unit tests for services, models
│   │   ├── authService.test.js
│   │   └── aiCoach.test.js
│   ├── integration/         # API integration tests
│   │   ├── auth.integration.test.js
│   │   └── gym.integration.test.js
│   └── fixtures/            # Mock data
│
├── frontend/
│   ├── unit/                # Component unit tests
│   │   └── components/
│   ├── integration/         # User flow tests
│   └── mocks/               # MSW, vitest mocks
│
└── e2e/                     # End-to-end tests (Cypress/Playwright)
    ├── auth.spec.ts
    ├── gym.spec.ts
    └── checkout.spec.ts
```

---

## 🚀 `/infra` - Infrastructure & Deployment

```
infra/
├── docker/
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
│
├── deployment/
│   ├── vercel.json          # Frontend deployment (Vercel)
│   ├── render.json          # Backend deployment (Render)
│   ├── nginx.conf           # Nginx reverse proxy
│   └── kubernetes/          # K8s manifests (if scaling)
│
└── monitoring/
    ├── sentry.config.js     # Error tracking
    ├── posthog.config.js    # Product analytics
    └── grafana-dashboards/
```

---

## 🔄 `/.github` - CI/CD & Automation

```
.github/
└── workflows/
    ├── backend-tests.yml    # Run backend tests on PR
    ├── frontend-tests.yml   # Run frontend tests on PR
    ├── deploy-staging.yml   # Deploy to staging on merge to dev
    └── deploy-prod.yml      # Deploy to production on merge to main
```

---

## 📝 `/scripts` - Utility Scripts

```
scripts/
├── setup.sh                 # Initial project setup
├── seed-db.js              # Populate test data
├── migrate.js              # Database migrations
└── generate-types.sh       # Generate TS types from MongoDB
```

---

## Key Conventions

### Naming
- **Files**: camelCase for JavaScript/TypeScript
- **Folders**: lowercase
- **Database Collections**: PascalCase (e.g., `User`, `Gym.Program`)
- **Constants**: UPPER_SNAKE_CASE

### Architecture Layers (Per SRS)
1. **Shared Platform Services**: Auth, Payments, Notifications, Analytics, AI Infrastructure
2. **Category Engine**: Gym, English, Cricket (modular, independent logic)
3. **Domain-Specific Features**: Form videos, Pronunciation scoring, Match analysis

### Example: Adding a New Feature
If you're adding "Career Coaching" category:
```
src/
├── backend/models/Career/ → Career.js, Goal.js, Progress.js
├── backend/controllers/career/ → new files
├── backend/services/CareerCoachService.js
├── frontend/pages/Career/ → new pages
├── frontend/components/career/ → new components
└── src/shared/types/career.ts
```

---

## Environment & Configuration

Create `.env` files:
```
# .env.local (for development)
VITE_API_URL=http://localhost:3000/api
VITE_ANTHROPIC_KEY=sk-...

# Backend .env
MONGODB_URI=mongodb://...
STRIPE_SECRET_KEY=sk_...
JWT_SECRET=...
CLAUDE_API_KEY=sk-...
```

---

## Getting Started

1. **Install dependencies**
   ```bash
   npm run setup  # or custom setup script
   ```

2. **Start development servers**
   ```bash
   npm run dev    # Starts both frontend and backend
   ```

3. **Run tests**
   ```bash
   npm run test
   npm run test:e2e
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## Next Steps
- [ ] Create root package.json (monorepo or workspace setup)
- [ ] Initialize git repository
- [ ] Set up CI/CD pipelines
- [ ] Create environment configuration files
- [ ] Begin backend/frontend development
