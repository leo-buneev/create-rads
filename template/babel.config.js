module.exports = {
  // presets: ['@vue/app'],
  comments: true,
  plugins: [
    // normally those two are already included by @vue/babel-preset-app => @babel/preset-env, but in development mode babel doesn't include them
    // (because thwy're supported by latest browsers already, no need to transpile). However, webpack v4 doesn't understand ?. syntax, so we still need to transpile it - just for webpack, not for browsers.
    // Can be removed after upgrade to webpack v5.
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
  ],
}
