const appJson = require("./app.json");
const baseExtra = appJson.expo.extra || {};

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      ...baseExtra,
    },
  },
};
