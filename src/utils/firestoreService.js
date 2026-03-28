import { collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';

/**
 * Save emergency report to Firestore
 * @param {object} analysisResult - Gemini analysis result
 * @param {string|null} photoUrl - Firebase Storage URL of uploaded photo
 * @returns {Promise<string>} Document ID
 */
export async function saveEmergencyReport(analysisResult, photoUrl = null) {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to save reports');
  }

  const reportData = {
    userId: auth.currentUser.uid,
    timestamp: serverTimestamp(),
    location: analysisResult.location,
    incidentType: analysisResult.incident_type,
    severity: analysisResult.severity,
    casualties: analysisResult.casualties,
    dispatch: analysisResult.dispatch,
    bystanderInstructions: analysisResult.bystander_instructions,
    confidenceScore: analysisResult.confidence_score,
    photoUrl: photoUrl || null,
  };

  const docRef = await addDoc(collection(db, 'emergency_reports'), reportData);
  return docRef.id;
}

/**
 * Get user's recent emergency reports
 * @param {number} maxResults - Maximum number of reports to fetch
 * @returns {Promise<Array>} Array of report documents
 */
export async function getUserReports(maxResults = 10) {
  if (!auth.currentUser) {
    return [];
  }

  const q = query(
    collection(db, 'emergency_reports'),
    where('userId', '==', auth.currentUser.uid),
    orderBy('timestamp', 'desc'),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
