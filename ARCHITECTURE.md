# ResQBridge Architecture

## System Overview

ResQBridge is a production-grade emergency response assistant built with React, Vite, Firebase, and Google Gemini AI.

## Architecture Layers

### 1. Presentation Layer
- **React Components**: Modular, accessible UI components
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Lazy Loading**: Code-split ResultsScreen for optimal initial load

### 2. State Management
- **Custom Hooks**: Encapsulated business logic
  - `useEmergencyAnalysis`: Core analysis workflow
  - `useCountdown`: ETA countdown timer
- **React State**: Local component state with minimal prop drilling

### 3. Service Layer
- **geminiService.js**: Gemini API integration with validation
- **firestoreService.js**: Emergency report persistence
- **storageService.js**: Photo upload to Firebase Storage
- **analyticsService.js**: Google Analytics event tracking
- **hospitalMatcher.js**: Zone-based hospital selection algorithm

### 4. Infrastructure Layer
- **Firebase Hosting**: Static asset delivery with CDN
- **Cloud Functions**: Secure API proxy for Gemini
- **Firestore**: NoSQL database for reports and logs
- **Cloud Storage**: Encrypted photo storage
- **Google Analytics**: User behavior and performance tracking

## Data Flow

```
User Input → Validation → Rate Limiting → Cache Check
    ↓
Gemini API (via Cloud Function) → Response Validation
    ↓
Cache Store → Hospital Matching → Firestore Save
    ↓
Results Display → Analytics Logging → Performance Monitoring
```

## Security Architecture

1. **Input Sanitization**: HTML stripping, injection detection
2. **Rate Limiting**: Client-side throttling (5 req/min)
3. **API Key Protection**: Server-side proxy via Cloud Functions
4. **Content Security Policy**: Strict CSP headers
5. **Firebase Security Rules**: Row-level access control
6. **HTTPS Only**: Enforced via Firebase Hosting

## Performance Optimizations

1. **Code Splitting**: Lazy-loaded routes and components
2. **Bundle Optimization**: Vendor chunking for better caching
3. **Response Caching**: 5-minute TTL for identical requests
4. **Image Optimization**: 4MB limit, format validation
5. **Service Worker**: Offline support and asset caching
6. **Web Vitals Monitoring**: LCP, FID, CLS tracking

## Testing Strategy

1. **Unit Tests**: Vitest for utilities and hooks
2. **Component Tests**: React Testing Library
3. **Integration Tests**: Full user flow testing
4. **E2E Tests**: Playwright across browsers
5. **Coverage Target**: >80% code coverage

## Deployment Pipeline

```
Git Push → GitHub Actions → Run Tests → Build → Deploy to Firebase
    ↓
Cloud Build → Run Linter → Security Scan → Deploy Functions
```

## Monitoring & Observability

1. **Google Analytics**: User events, errors, performance
2. **Firestore Logs**: Detailed error tracking with stack traces
3. **Performance API**: Web Vitals and custom metrics
4. **Firebase Crashlytics**: Production error reporting (future)
