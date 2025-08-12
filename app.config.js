import 'dotenv/config';

export default {
  expo: {
    name: "T-CASH",
    slug: "tcash-rn",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/tcash.png",
    scheme: "mobile",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/tcash.png",
        backgroundColor: "#E8FFD7"
      },
      edgeToEdgeEnabled: true,
      package: "com.comdev2k23.casht"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/tcash.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/tcash.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#E8FFD7"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "8918d92a-f6c1-4b05-bb2a-ba16e96987cd"
      },
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
    },
    owner: "nachttv22"
  }
};
