import { logEvent } from 'firebase/analytics';
import { analytics } from './firebaseConfig';

/**
 * Log an emergency analysis event to Google Analytics
 * @param {string} eventName - Name of the event
 * @param {object} params - Event parameters
 */
export function logAnalyticsEvent(eventName, params = {}) {
  if (!analytics) return;
  
  try {
    logEvent(analytics, eventName, params);
  } catch (error) {
    console.warn('Analytics logging failed:', error);
  }
}

/**
 * Log emergency report submission
 */
export function logEmergencySubmit(hasImage, transcriptLength) {
  logAnalyticsEvent('emergency_submit', {
    has_image: hasImage,
    transcript_length: transcriptLength,
  });
}

/**
 * Log analysis completion
 */
export function logAnalysisComplete(severity, confidence, usedFallback) {
  logAnalyticsEvent('analysis_complete', {
    severity,
    confidence_score: confidence,
    used_fallback: usedFallback,
  });
}

/**
 * Log errors for monitoring
 */
export function logError(errorType, errorMessage) {
  logAnalyticsEvent('error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
  });
}
