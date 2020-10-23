module.exports = {
  plugins: [
    "@babel/plugin-proposal-class-properties",
  ],
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript",
    ["@emotion/babel-preset-css-prop", {
      "autoLabel": true,
      "labelFormat": "[local]",
    }]
  ],
};