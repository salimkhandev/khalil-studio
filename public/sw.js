// Service Worker for Khalil Studio
// This service worker only handles the install prompt and does not cache anything

// Install event - do nothing, no caching
self.addEventListener('install', () => {
  console.log('Service Worker: Install event');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - do nothing, no caching
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event');
  // Take control of all clients immediately
  event.waitUntil(self.clients.claim());
});

// Fetch event - do nothing, no caching, just pass through
self.addEventListener('fetch', () => {
  // Do not cache anything, just pass through to network
  // This ensures all requests go directly to the server
  return;
});

// Handle install prompt
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Handle push notifications (if needed in future)
self.addEventListener('push', () => {
  // No push notifications for now
  console.log('Service Worker: Push event received');
});

// Handle notification click
self.addEventListener('notificationclick', () => {
  // No notifications for now
  console.log('Service Worker: Notification click event');
});
