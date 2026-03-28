import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { logError } from './analyticsService';

/**
 * Log error to Firestore for monitoring and debugging
 * @param {Error} error - Error object
 * @param {object} context - Additional context about the error
 */
export async function logErrorToFirestore(error, context = {}) {
  try {
    await addDoc(collection(db, 'error_logs'), {
      timestamp: serverTimestamp(),
      userId: auth.currentUser?.uid || 'anonymous',
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  } catch (loggingError) {
    console.error('Failed to log error to Firestore:', loggingError);
  }
}

/**
 * Comprehensive error handler that logs to both Analytics and Firestore
 * @param {Error} error - Error object
 * @param {string} errorType - Type/category of error
 * @param {object} context - Additional context
 */
export function handleError(error, errorType, context = {}) {
  // Log to console for development
  console.error(`[${errorType}]`, error, context);
  
  // Log to Google Analytics
  logError(errorType, error.message);
  
  // Log to Firestore for detailed monitoring
  logErrorToFirestore(error, { ...context, errorType });
}
