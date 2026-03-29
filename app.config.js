const appJson = require("./app.json");
const baseExtra = appJson.expo.extra || {};

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      ...baseExtra,
      geminiApiKey:
        process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
        baseExtra.geminiApiKey ||
        "",
    },
  },
};
