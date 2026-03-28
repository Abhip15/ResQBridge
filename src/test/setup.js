import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock import.meta.env
vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_GEMINI_API_KEY: 'test-key',
      VITE_FIREBASE_API_KEY: 'test-firebase-key',
      VITE_FIREBASE_PROJECT_ID: 'test-project',
    },
  },
});

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url');
global.URL.revokeObjectURL = vi.fn();
