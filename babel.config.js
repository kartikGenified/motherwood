module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    ['module:react-native-dotenv'],
    ["module-resolver", {
      "root": ["./"],
      "alias": {
        // "@components": "./src/components",
        "@": "./src",
        "@assets": ["./assets"],
      "@redux": ["./redux"],
      }
    }],
  ],
  env: {
    production: {
      plugins:[
        ['react-native-paper/babel'],
        ['transform-remove-console'],
    ],
    },
  },
};
