module.exports = api => {
  let isProd = false;
  if (api && api.env) {
    // "development & test" are static values ​​and cannot be changed
    isProd = api.env() !== 'development' && api.env() !== 'test';
  }
  let config = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      'nativewind/babel',
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          root: ['./'],
          cwd: 'babelrc',
          extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
          alias: {
            '@app': './src/app',
            '@configs': './src/core/configs',
            '@locales': './src/containers/locales',
            '@routes': './src/containers/routes',
            '@screens': './src/containers/screens',
            '@store': './src/containers/store',
            '@containers': './src/containers',
            '@themes': './src/core/themes',
            '@utils': './src/core/utils',
            '@plugins': './src/core/plugins',
            '@validators': './src/core/validators',
            '@core': './src/core',
            '@fonts': './src/assets/fonts',
            '@images': './src/assets/images',
            '@icons': './src/assets/icons',
            '@assets': './src/assets',
            '@components': './src/components',
            '@src': './src',
          },
        },
      ],
      'lodash',
      'react-native-reanimated/plugin', // react-native-reanimated
    ],
  };
  if (isProd) {
    config.plugins.push(['transform-remove-console']);
  }

  return config;
};
