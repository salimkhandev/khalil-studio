// Install Prompt Handler for Khalil Studio
// This script handles the PWA install prompt without caching

let deferredPrompt;
let isInstalled = false;

// Check if app is already installed
window.addEventListener('load', () => {
  // Check if running in standalone mode (installed)
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    isInstalled = true;
    console.log('App is already installed');
    return;
  }

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  }

  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt event fired');
    
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button
    showInstallButton();
  });

  // Listen for the appinstalled event
  window.addEventListener('appinstalled', () => {
    console.log('App was installed');
    isInstalled = true;
    hideInstallButton();
  });
});

// Function to show install button
function showInstallButton() {
  // Create install button if it doesn't exist
  let installButton = document.getElementById('install-button');
  
  if (!installButton && !isInstalled) {
    installButton = document.createElement('button');
    installButton.id = 'install-button';
    installButton.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7,10 12,15 17,10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Install for quick access
    `;
    installButton.className = 'fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors z-50';
    installButton.style.display = 'flex';
    
    // Add click event listener
    installButton.addEventListener('click', installApp);
    
    // Add to body
    document.body.appendChild(installButton);
  }
}

// Function to hide install button
function hideInstallButton() {
  const installButton = document.getElementById('install-button');
  if (installButton) {
    installButton.remove();
  }
}

// Function to trigger the install prompt
async function installApp() {
  if (!deferredPrompt) {
    console.log('No install prompt available');
    return;
  }

  // Show the install prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`User response to the install prompt: ${outcome}`);
  
  // Clear the deferredPrompt
  deferredPrompt = null;
  
  // Hide the install button
  hideInstallButton();
}

// Export functions for global access
window.installApp = installApp;
window.showInstallButton = showInstallButton;
window.hideInstallButton = hideInstallButton;
