module.exports = function (config) {
  config.set({
    frameworks: ["mocha"],

    files: [
      "tests/**/*.test.js"
    ],

    browsers: ["ChromeHeadless"],

    reporters: ["progress"],
    singleRun: false,

    // Esto obliga a headless en caso que Karma intente Chrome normal
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"]
      }
    },

    browsers: ["ChromeHeadlessNoSandbox"]
  });
};
