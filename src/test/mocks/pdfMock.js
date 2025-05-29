// Mock for @react-pdf/renderer
module.exports = {
  Document: ({ children }) => children,
  Page: ({ children }) => children,
  Text: ({ children }) => children,
  View: ({ children }) => children,
  StyleSheet: {
    create: (styles) => styles,
  },
  Font: {
    register: () => {},
  },
  Image: ({ src }) => src,
  pdf: {
    create: async () => ({
      toBlob: () => new Blob(),
      toBuffer: () => Buffer.from([]),
    }),
  },
};
