/**
 * Service Worker registration and offline support utilities
 */

/**
 * Register service worker for offline support
 */
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      console.log('Service Worker registered:', registration.scope);
      
      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60000); // Check every minute
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

/**
 * Check if the app is currently online
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Add online/offline event listeners
 */
export function setupConnectivityListeners(onOnline, onOffline) {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);
  
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}
