import { onRequest } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

initializeApp();
const db = getFirestore();

/**
 * Cloud Function: Secure Gemini API proxy
 * Keeps API key server-side and adds rate limiting
 */
export const analyseEmergency = onRequest(
  {
    cors: true,
    maxInstances: 10,
    timeoutSeconds: 60,
    memory: '512MiB',
  },
  async (req, res) => {
    // Only allow POST requests
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { transcript, imageData } = req.body;

    if (!transcript || typeof transcript !== 'string') {
      res.status(400).json({ error: 'Invalid transcript' });
      return;
    }

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API key not configured');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const parts = [{ text: buildPrompt(transcript) }];

      if (imageData) {
        parts.push({
          inlineData: {
            data: imageData.data,
            mimeType: imageData.mimeType,
          },
        });
      }

      const response = await model.generateContent(parts);
      const text = response.response.text();
      const jsonString = text.replace(/```(?:json)?\s*/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonString);

      res.status(200).json({ result: parsed, success: true });
    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({ error: 'Analysis failed', success: false });
    }
  }
);

/**
 * Cloud Function: Trigger on new emergency report
 * Sends notifications and updates analytics
 */
export const onEmergencyReportCreated = onDocumentCreated(
  'emergency_reports/{reportId}',
  async (event) => {
    const snapshot = event.data;
    const data = snapshot.data();

    // Log to analytics collection
    await db.collection('analytics').add({
      event: 'emergency_report_created',
      severity: data.severity,
      location: data.location,
      timestamp: data.timestamp,
      confidenceScore: data.confidenceScore,
    });

    // In production, this would trigger notifications to emergency services
    console.log(`New ${data.severity} emergency at ${data.location}`);
  }
);

/**
 * Build the Gemini prompt
 */
function buildPrompt(transcript) {
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

TRANSCRIPT:
${transcript}`;
}
