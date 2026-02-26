import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mashrok.ios",
  appName: "خته - 5ATTAH",
  webDir: "dist",
  server: {
    // For development: uncomment the url below for hot-reload
    // url: "https://caaca3d4-6651-48f7-b238-7be3e7c0fd4a.lovableproject.com?forceHideBadge=true",
    cleartext: false,
    allowNavigation: [
      "https://mashrouk.lovable.app",
      "https://mashrok.shop",
      "https://www.mashrok.shop",
      "https://frkdmxdfalohpmzlnsth.supabase.co",
      "https://*.supabase.co",
      "https://api.moyasar.com",
      "https://cdn.moyasar.com",
    ],
  },
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    allowsLinkPreview: false,
    backgroundColor: "#1a2340",
    scheme: "mashrok",
    limitsNavigationsToAppBoundDomains: true,
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#1a2340",
    useLegacyBridge: false,
    appendUserAgent: "MashrokApp/1.0",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#1a2340",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#1a2340",
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true,
    },
    CapacitorHttp: {
      enabled: true,
    },
  },
  loggingBehavior: "none",
};

export default config;
