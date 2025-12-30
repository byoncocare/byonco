const path = require("path");

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/pages": path.resolve(__dirname, "src/pages"),
      "@/products": path.resolve(__dirname, "src/products"),
    },
    configure: (webpackConfig) => {
      // Disable treating warnings as errors in production builds
      if (process.env.CI === 'true') {
        const eslintPlugin = webpackConfig.plugins.find(
          plugin => plugin.constructor.name === 'ESLintWebpackPlugin'
        );
        if (eslintPlugin) {
          eslintPlugin.options.failOnWarning = false;
        }
      }
      return webpackConfig;
    },
  },
};
