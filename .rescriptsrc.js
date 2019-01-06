const fs = require('fs');

module.exports = [{
  devServer: (config) => {
    // TODO: implement actual CSP
    config.headers = Object.assign({}, config.headers, {
      // "Content-Security-Policy": "default-src 'unsafe-eval' 'unsafe-inline' *"
    });
    if (process.env.HTTPS_CERT_FILE && process.env.HTTPS_KEY_FILE) {
      config.https = {
        cert: fs.readFileSync(process.env.HTTPS_CERT_FILE),
        key: fs.readFileSync(process.env.HTTPS_KEY_FILE),
      };
    }
    return config;
  }
}];
