import { useEffect, useState } from "react";

// Extend Window interface for Botpress
declare global {
  interface Window {
    botpress: {
      init: (config: Record<string, unknown>) => void;
      on: (event: string, callback: () => void) => void;
      open: () => void;
    };
  }
}

export default function VirtualAssistant() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (scriptLoaded) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v3.3/inject.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [scriptLoaded]);

  useEffect(() => {
    if (!scriptLoaded || !window.botpress) return;

    // Add custom styles to position toggle button on right and ensure proper closing
    const style = document.createElement('style');
    style.textContent = `
      .bp-widget-container {
        right: 20px !important;
        left: auto !important;
        bottom: 20px !important;
      }
      .bp-widget-container .bp-widget {
        position: fixed !important;
        z-index: 9998 !important;
      }
      .bp-widget-container .bp-widget iframe {
        border-radius: 12px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
      }
      .bp-fab {
        right: 20px !important;
        left: auto !important;
        bottom: 20px !important;
        z-index: 9998 !important;
      }
      [data-bp-widget] {
        right: 20px !important;
        left: auto !important;
        bottom: 20px !important;
        z-index: 9998 !important;
      }
      .bp-widget-container,
      .bp-widget,
      .bp-fab,
      [data-bp-widget] {
        right: 20px !important;
        left: auto !important;
        bottom: 20px !important;
      }
    `;
    document.head.appendChild(style);

    window.botpress.init({
      "botId": "118bef4c-1839-41d9-94bc-0196b2a0cd19",
      "configuration": {
        "version": "v2",
        "botName": "Khalil Studio",
        "botAvatar": "./images/khalil.png",
        "botDescription": "",
        "website": {},
        "email": {},
        "phone": {},
        "termsOfService": {},
        "privacyPolicy": {},
        "color": "#3b82f6",
        "variant": "solid",
        "headerVariant": "glass",
        "themeMode": "dark",
        "fontFamily": "inter",
        "radius": 3,
        "feedbackEnabled": false,
        "footer": "[⚡ by Botpress](https://botpress.com/?from=webchat)",
        "soundEnabled": false,
        "proactiveMessageEnabled": false,
        "proactiveBubbleMessage": "Hi! 👋 Need help?",
        "proactiveBubbleTriggerType": "afterDelay",
        "proactiveBubbleDelayTime": 10
      },
      "clientId": "193532a1-d377-4c08-8f25-03524eca40af"
    });

    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [scriptLoaded]);

  return null;
}