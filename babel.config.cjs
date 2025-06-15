module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic', importSource: '@emotion/react' }],
    ['@babel/preset-typescript', { isTSX: true, allExtensions: true }],
  ],
  plugins: [
    'babel-plugin-transform-import-meta',
    [
      '@emotion/babel-plugin',
      {
        importMap: {
          '@mui/system': {
            styled: { canonicalImport: ['@emotion/styled', 'default'] },
          },
          '@mui/material/styles': {
            styled: { canonicalImport: ['@emotion/styled', 'default'] },
          },
        },
      },
    ],
  ],
  env: {
    test: {
      plugins: ['@emotion/babel-plugin'],
    },
  },
};
