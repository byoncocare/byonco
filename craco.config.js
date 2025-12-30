const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/pages": path.resolve(__dirname, "src/pages"),
      "@/products": path.resolve(__dirname, "src/products"),
    },
    configure: (webpackConfig, { env }) => {
      // Disable ESLint plugin entirely in production builds to avoid warnings-as-errors
      if (env === 'production' || process.env.CI === 'true') {
        // Remove ESLint plugin
        webpackConfig.plugins = webpackConfig.plugins.filter(
          plugin => plugin.constructor?.name !== 'ESLintWebpackPlugin'
        );
      } else {
        // In development, just disable failOnWarning
        const eslintPlugin = webpackConfig.plugins?.find(
          plugin => plugin.constructor?.name === 'ESLintWebpackPlugin'
        );
        if (eslintPlugin && eslintPlugin.options) {
          eslintPlugin.options.failOnWarning = false;
        }
      }
      return webpackConfig;
    },
  },
};
