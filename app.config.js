import 'dotenv/config';

export default {
  expo: {
    name: 'muscu-appli',
    slug: 'muscu-appli',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSPhotoLibraryUsageDescription: "Cette application nécessite l'accès à votre galerie photos pour sélectionner des images d'exercices."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      permissions: [
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    },
    web: {
      favicon: './assets/favicon.png',
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
      }
    },
    plugins: [
      [
        "expo-build-properties",
        {
          "android": {
            "usesCleartextTraffic": true
          }
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "Cette application nécessite l'accès à votre galerie photos pour sélectionner des images d'exercices."
        }
      ]
    ],
    extra: {
      API_URL: process.env.API_URL,
      API_TOKEN: process.env.API_TOKEN,
      eas: {
        projectId: "your-project-id"
      }
    }
  }
}; 