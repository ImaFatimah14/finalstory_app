export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function isServiceWorkerAvailable() {
  return 'serviceWorker' in navigator;
}

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.bundle.js', {
        scope: '/',
      });
      console.log('✅ Service Worker registered');
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  }
}
