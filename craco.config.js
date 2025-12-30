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
      // Disable treating warnings as errors in production builds
      const eslintPlugin = webpackConfig.plugins?.find(
        plugin => plugin.constructor?.name === 'ESLintWebpackPlugin'
      );
      if (eslintPlugin && eslintPlugin.options) {
        eslintPlugin.options.failOnWarning = false;
        eslintPlugin.options.failOnError = false;
      }
      return webpackConfig;
    },
  },
};
