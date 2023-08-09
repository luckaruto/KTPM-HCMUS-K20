module.exports = {
  presets: ['module:metro-react-native-babel-preset', 'babel-preset-expo'],
  plugins: [
    'nativewind/babel',
    ['module:react-native-dotenv', {moduleName: '@env', path: '.env'}],
  ],
};
