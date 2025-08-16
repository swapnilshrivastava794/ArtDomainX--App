module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      require.resolve('expo-router/babel'),
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
            '~': './app',
            '@app': './app',
            '@components': './app/components',
            '@store': './app/store',
            '@utils': './app/utils',
            '@assets': './assets',
          },
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};


