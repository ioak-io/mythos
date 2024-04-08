const path = require('path')
 
module.exports = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  // reactStrictMode: false
}