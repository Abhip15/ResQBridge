import { GoogleGenerativeAI } from '@google/generative-ai';
import { mockResult } from '../data/mockResult';

/** Maximum transcript length in characters */
const MAX_TRANSCRIPT_LENGTH = 1000;

/** Maximum image size in bytes (4 MB) */
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

/** Allowed image MIME types */
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Patterns that indicate script injection attempts */
const DANGEROUS_PATTERNS = [
  /<script[\s>]/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /data:\s*text\/html/i,
];

/** Valid severity values for response validation */
const VALID_SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

/**
 * Strip HTML tags from a string to prevent injection.
 * @param {string} text
 * @returns {string}
 */
function sanitise(text) {
  return text.replace(/<[^>]*>/g, '');
}

/**
 * Check transcript for dangerous injection patterns.
 * @param {string} text
 * @returns {string|null} Error message if dangerous, null if safe.
 */
function detectInjection(text) {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(text)) {
      return 'Input contains disallowed content. Please describe the emergency in plain text.';
    }
  }
  return null;
}

/**
 * Build the Gemini prompt with the sanitised, truncated transcript.
 * @param {string} transcript
 * @returns {string}
 */
function buildPrompt(transcript) {
  const clean = sanitise(transcript).slice(0, MAX_TRANSCRIPT_LENGTH);

  return `You are an emergency response AI assistant. Analyse the following transcript \
from a bystander at an accident scene, and any attached image.

Extract and return ONLY this JSON structure with no markdown, no explanation:

{
  "location": "",
  "incident_type": "",
  "casualties": {
    "total": 0,
    "critical": 0,
    "description": ""
  },
  "dispatch": {
    "unit": "",
    "hospital": "",
    "eta_minutes": 0,
    "alert_sent": ""
  },
  "bystander_instructions": [],
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "confidence_score": 0.0
}

RULES:
- Translate any regional Indian language to English before extracting
- If location is vague, extract the best available landmark or road reference
- severity must be one of: LOW, MEDIUM, HIGH, CRITICAL
- confidence_score is 0.0–1.0 based on how complete the input information is
- Never hallucinate specifics. If a field cannot be determined, use null.
- For hospital and eta_minutes: use the closest match from this list:
  [Manipal Whitefield: 6min, Victoria Hospital: 9min, \
Sakra World Hospital: 11min, MS Ramaiah: 14min, NIMHANS: 17min]

TRANSCRIPT:
${clean}`;
}

/**
 * Convert a File object to a base64-encoded inline data part for Gemini.
 * @param {File} file
 * @returns {Promise<{inlineData: {data: string, mimeType: string}}>}
 */
async function fileToGenerativePart(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return {
    inlineData: {
      data: btoa(binary),
      mimeType: file.type || 'image/jpeg',
    },
  };
}

/**
 * Light validation of the parsed Gemini response shape.
 * @param {object} obj
 * @returns {boolean}
 */
function isValidResponse(obj) {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.location === 'string' &&
    typeof obj.incident_type === 'string' &&
    obj.casualties &&
    typeof obj.casualties.total === 'number' &&
    obj.dispatch &&
    Array.isArray(obj.bystander_instructions) &&
    VALID_SEVERITIES.includes(obj.severity) &&
    typeof obj.confidence_score === 'number'
  );
}

/**
 * Analyse an emergency situation using the Gemini 1.5 Pro model.
 *
 * @param {string} transcript - Bystander description of the emergency.
 * @param {File|null} imageFile - Optional photo of the scene.
 * @returns {Promise<{result: object, usedFallback: boolean, error?: string}>}
 */
export async function analyseEmergency(transcript, imageFile = null) {
  /* ── Guard: injection patterns ── */
  const injectionError = detectInjection(transcript);
  if (injectionError) {
    return { result: mockResult, usedFallback: true, error: injectionError };
  }

  /* ── Guard: image MIME type ── */
  if (imageFile && !ALLOWED_MIME_TYPES.includes(imageFile.type)) {
    return {
      result: mockResult,
      usedFallback: true,
      error: 'Unsupported image format. Please use JPEG, PNG, or WebP.',
    };
  }

  /* ── Guard: image size ── */
  if (imageFile && imageFile.size > MAX_IMAGE_SIZE) {
    return {
      result: mockResult,
      usedFallback: true,
      error: 'Image exceeds 4 MB limit. Please use a smaller photo.',
    };
  }

  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API key is not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    /* ── Build content parts ── */
    const parts = [{ text: buildPrompt(transcript) }];

    if (imageFile) {
      const imagePart = await fileToGenerativePart(imageFile);
      parts.push(imagePart);
    }

    /* ── Call Gemini ── */
    const response = await model.generateContent(parts);
    const text = response.response.text();

    /* ── Parse JSON — strip markdown fences if present ── */
    const jsonString = text.replace(/```(?:json)?\s*/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonString);

    if (!isValidResponse(parsed)) {
      throw new Error('Response failed shape validation');
    }

    return { result: parsed, usedFallback: false };
  } catch {
    /* ── Fallback to mock data ── */
    return { result: mockResult, usedFallback: true };
  }
}
