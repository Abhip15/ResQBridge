import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from './firebaseConfig';

/**
 * Upload emergency scene photo to Firebase Storage
 * @param {File} file - Image file to upload
 * @returns {Promise<string>} Download URL of uploaded image
 */
export async function uploadEmergencyPhoto(file) {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to upload photos');
  }

  const userId = auth.currentUser.uid;
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const storageRef = ref(storage, `emergency_photos/${userId}/${fileName}`);

  await uploadBytes(storageRef, file, {
    contentType: file.type,
    customMetadata: {
      uploadedAt: new Date().toISOString(),
    },
  });

  return getDownloadURL(storageRef);
}
