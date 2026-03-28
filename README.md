# ResQBridge — Emergency Response Assistant

ResQBridge is a production-grade, Gemini-powered emergency response assistant designed for bystanders at accident scenes. A bystander describes what they see (text and/or photo), and the app uses Google's Gemini 2.5 Flash multimodal API to extract structured incident data — location, casualty count, severity, nearest hospital, dispatch recommendations, and step-by-step bystander instructions — all in seconds.

## Features

✅ **Multimodal AI Analysis** - Text + image processing via Gemini 2.5 Flash  
✅ **Real-time Hospital Matching** - Zone-based algorithm with specialization scoring  
✅ **Offline Support** - Service Worker caching for critical functionality  
✅ **Comprehensive Testing** - Unit, integration, and E2E tests with >80% coverage  
✅ **Performance Monitoring** - Web Vitals tracking and analytics  
✅ **Security Hardened** - Rate limiting, input sanitization, CSP headers  
✅ **Firebase Integration** - Hosting, Firestore, Storage, Analytics, Cloud Functions  
✅ **Accessibility** - WCAG 2.1 AA compliant with ARIA labels and keyboard navigation  
✅ **CI/CD Pipeline** - Automated testing and deployment via GitHub Actions  

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env and add your API keys

# 3. Start development server
npm run dev

# 4. Run tests
npm run test

# 5. Run E2E tests
npm run test:e2e

# 6. Build for production
npm run build
```

## Google Services Integration

### 1. Gemini 2.5 Flash API
- Multimodal analysis (text + image)
- Structured JSON extraction
- Regional language translation support
- Confidence scoring

### 2. Firebase Hosting
- Global CDN distribution
- Automatic SSL certificates
- Custom domain support
- Rollback capabilities

### 3. Cloud Firestore
- Emergency report persistence
- Real-time sync capabilities
- Composite indexes for queries
- Security rules enforcement

### 4. Cloud Storage
- Encrypted photo storage
- Automatic backup
- Access control via security rules
- CDN integration

### 5. Google Analytics
- User behavior tracking
- Performance metrics (Web Vitals)
- Error monitoring
- Custom event logging

### 6. Cloud Functions
- Secure API proxy for Gemini
- Server-side rate limiting
- Automated triggers on new reports
- Background processing

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ InputScreen  │→ │ Gemini API   │→ │ResultsScreen │  │
│  │              │  │ (via Cloud   │  │              │  │
│  │ - Validation │  │  Functions)  │  │ - Hospital   │  │
│  │ - Rate Limit │  │              │  │   Matching   │  │
│  │ - Caching    │  │ - Security   │  │ - Analytics  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Firebase Backend                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Firestore   │  │   Storage    │  │  Analytics   │  │
│  │  - Reports   │  │  - Photos    │  │  - Events    │  │
│  │  - Logs      │  │  - Encrypted │  │  - Metrics   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E with UI
npm run test:e2e:ui

# Linting
npm run lint
npm run lint:fix
```

## Deployment

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init

# Deploy
firebase deploy
```

### Google Cloud Build
```bash
# Submit build
gcloud builds submit --config cloudbuild.yaml

# View logs
gcloud builds log [BUILD_ID]
```

## Performance Metrics

- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Time to Interactive**: <3.5s
- **Cumulative Layout Shift**: <0.1
- **First Input Delay**: <100ms

## Security Features

- Input sanitization and injection detection
- Client-side rate limiting (5 req/min)
- Server-side API key protection
- Content Security Policy headers
- Firebase security rules
- HTTPS enforcement
- Image validation (type, size)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## License

MIT

## Contributing

See [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details.
See [SECURITY.md](./SECURITY.md) for security policy.

