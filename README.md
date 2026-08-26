# 🚀 GURUKUL - Multi-Category Personal Growth Platform

> **Ancient Wisdom. Modern Guidance. Limitless Potential.**

GURUKUL is a premium AI-powered personal growth platform delivering world-class coaching across multiple domains: Gym/Fitness, English Learning, Cricket, Career, and Meditation.

## 🎯 Quick Overview

| Aspect | Details |
|--------|---------|
| **Stack** | MERN (MongoDB, Express, React 18+, Node.js 20 LTS) |
| **Architecture** | 3-Layer: Shared Platform Services → Category Engine → Domain-Specific Features |
| **Build Tool** | Vite (3-4x faster than CRA) |
| **Design** | Tailwind CSS + Premium Indian Gold Theme (#D4AF37) |
| **AI** | Anthropic Claude API for personalized coaching |
| **Payments** | Stripe integration for subscriptions |
| **Hosting** | Vercel (Frontend) + Render (Backend) |

## 📁 Project Structure

**For detailed folder explanations, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**

```
gurukul/
├── docs/                    # SRS, designs, API docs
├── src/
│   ├── backend/            # Node.js/Express API
│   ├── frontend/           # React 18+ application
│   └── shared/             # Shared types & utilities
├── tests/                  # Unit, integration, E2E tests
├── infra/                  # Docker, deployment configs
└── scripts/                # Setup & migration scripts
```

## 🏗️ Architecture Highlights

### Layer 1: Shared Platform Services (Core Infrastructure)
- Authentication (JWT, OAuth2, MFA)
- User Management & Profiles
- Payments & Subscriptions (Stripe)
- Notifications (Push, Email, SMS)
- Analytics & Observability
- Media Management (Images, Videos)
- Community Foundation
- AI Infrastructure

### Layer 2: Category Engine
Each category inherits platform features independently:
- **Gym**: Programs, Workouts, Progress Tracking, 1RM Calculator
- **English**: Lessons, Assessments, Speaking Practice, Pronunciation
- **Cricket**: Drills, Video Analysis, Strategy Tools, Match Replays
- **Future**: Career, Meditation, Leadership (extensible architecture)

### Layer 3: Domain-Specific Features
Specialized tools per category that don't require platform rewrite.

## 🛠️ Tech Stack Details

### Frontend
- **React 18+** with Hooks & Concurrent Rendering
- **TypeScript** for type safety
- **Tailwind CSS** + Shadcn/UI components
- **TanStack Query** for server state
- **Zustand** for client state
- **React Router v6** for navigation
- **Framer Motion** for animations
- **Lucide Icons** for consistent iconography

### Backend
- **Node.js 20 LTS** with Express.js 4.18+
- **MongoDB 6.0+** with Mongoose ODM
- **JWT + bcrypt** for auth security
- **Stripe SDK** for payments
- **Anthropic Claude API** for AI coaching
- **Winston** for structured logging
- **node-cron** for background jobs

### External Services
- **Stripe**: Payment processing & subscriptions
- **Anthropic Claude API**: AI coach conversations & content generation
- **Cloudinary**: Image optimization & video streaming
- **PostHog**: Product analytics & feature flags
- **Sentry**: Error tracking & monitoring
- **MongoDB Atlas**: Managed database

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 20+
npm 10+ or yarn 4+
MongoDB Atlas account (or local MongoDB)
Stripe account
Anthropic API key
```

### Setup (First Time)
```bash
# Clone repository
git clone <repo-url>
cd gurukul

# Install dependencies
npm run setup

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development servers
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### Common Commands
```bash
npm run dev          # Start both servers
npm run build        # Build for production
npm run test         # Run all tests
npm run test:e2e     # Run E2E tests
npm run lint         # Check code quality
npm run type-check   # TypeScript checks
npm run db:seed      # Populate sample data
```

## 📚 Documentation

- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Detailed folder guide
- **[docs/requirements/SRS.pdf](./docs/requirements/SRS.pdf)** - Full specification
- **[docs/design/reference_design.jpg](./docs/design/reference_design.jpg)** - UI reference
- **[docs/api/endpoints.md](./docs/api/endpoints.md)** - API documentation (coming soon)

## 🎨 Design System

### Color Palette
- **Primary Gold**: #D4AF37 (premium, trust)
- **Dark Theme**: #1a1a1a with gold accents
- **Light Theme**: #ffffff with gold highlights
- **Accent Colors**: By category (Gym: Blue, English: Green, Cricket: Teal)

### Typography
- **Headings**: Poppins (bold, modern)
- **Body**: Inter (readable, accessible)
- **Mono**: Fira Code (documentation, code blocks)

## 🔐 Security Features

- **JWT** with refresh token rotation
- **bcrypt** with adaptive salt rounds (password hashing)
- **CORS** properly configured
- **Rate limiting** on sensitive endpoints
- **SQL Injection prevention** via Mongoose
- **XSS protection** via Helmet middleware
- **CSRF tokens** for state-changing operations

## 📊 MVP Scope (2 Weeks)
- Landing page with hero & program browsing
- User registration/login flow
- Goal selection onboarding
- Program browsing interface
- Basic user profile setup

## 🚦 Development Phases

**Phase 1 (MVP)**: Core platform + Gym category
**Phase 2**: English category + payment integration
**Phase 3**: Cricket category + community features
**Phase 4**: Future categories + advanced AI coaching

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Write tests for new code
3. Run linter: `npm run lint`
4. Submit PR with clear description

## 📞 Support

For issues or questions:
- Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for guidance
- Review SRS document for specifications
- Check existing code patterns

## 📄 License

[Your License Here]

---

**Built with ❤️ for holistic personal growth | India | 2024**
