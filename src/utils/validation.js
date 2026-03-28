/**
 * Comprehensive input validation utilities
 */

/**
 * Validate transcript input
 * @param {string} transcript
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateTranscript(transcript) {
  if (!transcript || typeof transcript !== 'string') {
    return { valid: false, error: 'Transcript is required' };
  }

  const trimmed = transcript.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Transcript cannot be empty' };
  }

  if (trimmed.length > 1000) {
    return { valid: false, error: 'Transcript exceeds 1000 character limit' };
  }

  // Check for minimum meaningful content
  if (trimmed.length < 10) {
    return { valid: false, error: 'Please provide more details about the emergency' };
  }

  return { valid: true };
}

/**
 * Validate image file
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageFile(file) {
  if (!file) {
    return { valid: true }; // Image is optional
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid image format. Please use JPEG, PNG, or WebP.',
    };
  }

  const maxSize = 4 * 1024 * 1024; // 4MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image exceeds 4MB limit. Please use a smaller file.',
    };
  }

  return { valid: true };
}

/**
 * Validate Gemini API response structure
 * @param {object} response
 * @returns {boolean}
 */
export function validateGeminiResponse(response) {
  const requiredFields = [
    'location',
    'incident_type',
    'casualties',
    'dispatch',
    'bystander_instructions',
    'severity',
    'confidence_score',
  ];

  for (const field of requiredFields) {
    if (!(field in response)) {
      return false;
    }
  }

  // Validate nested structures
  if (!response.casualties || typeof response.casualties.total !== 'number') {
    return false;
  }

  if (!response.dispatch || typeof response.dispatch.eta_minutes !== 'number') {
    return false;
  }

  if (!Array.isArray(response.bystander_instructions)) {
    return false;
  }

  const validSeverities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  if (!validSeverities.includes(response.severity)) {
    return false;
  }

  if (typeof response.confidence_score !== 'number' || 
      response.confidence_score < 0 || 
      response.confidence_score > 1) {
    return false;
  }

  return true;
}
