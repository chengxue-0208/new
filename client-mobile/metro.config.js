const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  const config = {
    resolver: {
      ...defaultConfig.resolver,
    },
  };

  return mergeConfig(defaultConfig, config);
})();