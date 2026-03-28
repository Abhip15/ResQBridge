# Testing Guide

## Test Structure

```
src/
├── test/
│   ├── setup.js                    # Test configuration
│   └── integration/                # Integration tests
├── components/
│   ├── *.jsx                       # Components
│   └── *.test.jsx                  # Component tests
├── hooks/
│   ├── *.js                        # Custom hooks
│   └── *.test.js                   # Hook tests
└── utils/
    ├── *.js                        # Utilities
    └── *.test.js                   # Utility tests

e2e/
└── *.spec.js                       # Playwright E2E tests
```

## Running Tests

### Unit & Component Tests
```bash
# Run all tests once
npm run test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### E2E Tests
```bash
# Run E2E tests headless
npm run test:e2e

# Run with UI for debugging
npm run test:e2e:ui

# Run specific browser
npx playwright test --project=chromium
```

## Test Coverage Goals

- **Overall**: >80%
- **Critical paths**: 100% (geminiService, hospitalMatcher)
- **Components**: >75%
- **Utilities**: >90%

## Writing Tests

### Component Tests
```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

it('renders correctly', () => {
  render(<MyComponent />);
  expect(screen.getByText('Expected text')).toBeInTheDocument();
});
```

### Hook Tests
```javascript
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from './useMyHook';

it('updates state', () => {
  const { result } = renderHook(() => useMyHook());
  act(() => {
    result.current.updateValue('new');
  });
  expect(result.current.value).toBe('new');
});
```

### E2E Tests
```javascript
test('completes user flow', async ({ page }) => {
  await page.goto('/');
  await page.fill('textarea', 'Emergency');
  await page.click('button[type="submit"]');
  await expect(page.getByText('Results')).toBeVisible();
});
```

## Mocking

### Gemini API
```javascript
vi.mock('../utils/geminiService', () => ({
  analyseEmergency: vi.fn().mockResolvedValue({
    result: mockData,
    usedFallback: false,
  }),
}));
```

### Firebase
```javascript
vi.mock('./firebaseConfig', () => ({
  db: {},
  storage: {},
  analytics: null,
}));
```

## CI/CD Integration

Tests run automatically on:
- Every push to main/develop
- Every pull request
- Pre-deployment checks

Failed tests block deployment.
