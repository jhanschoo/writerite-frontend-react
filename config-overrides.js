const fs = require("fs");
const { overrideDevServer } = require("customize-cra");

module.exports = {
  devServer: overrideDevServer((config) => {
    // TODO: implement actual CSP
    config.headers = Object.assign({}, config.headers, {
      // "Content-Security-Policy": "default-src 'unsafe-eval' 'unsafe-inline' *"
    });
    config.https = {
      cert: fs.readFileSync(process.env.HTTPS_CERT_FILE),
      key: fs.readFileSync(process.env.HTTPS_KEY_FILE),
    };
    return config;
  })
};
