const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  resolver: {
    alias: {
      'http': 'https',
    },
  },
  ...defaultConfig,
};

