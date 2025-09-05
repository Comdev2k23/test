import 'dotenv/config';

export default {
  expo: {
    name: "tcash",
    slug: "tcash",
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
      package: "com.comdev2k23.tcash"
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
        projectId: "9f2500e6-c388-4b54-8c2b-df5c8031a5bc"
      },
    },
    owner: "nachttv22"
  }
};
