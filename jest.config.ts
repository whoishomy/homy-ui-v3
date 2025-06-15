import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^scripts/(.*)$': '<rootDir>/scripts/__mocks__/$1',
    '^@env$': '<rootDir>/jest.env.ts',
    '^@mui/styled-engine$': '@mui/styled-engine-sc',
    '^@emotion/styled$': '@emotion/styled/base',
    '^@emotion/core$': '@emotion/react',
    '^@emotion/styled/base$': '@emotion/styled/base/dist/emotion-styled-base.cjs.js',
    '^recharts$': '<rootDir>/src/__mocks__/recharts.tsx',
    '^@/utils/trademark$': '<rootDir>/src/__mocks__/trademark.ts',
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@emotion|@radix-ui|framer-motion|@mui|@babel/runtime)/)',
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.stories.{ts,tsx}', '!src/**/*.d.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  snapshotSerializers: ['@emotion/jest/serializer'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      babelConfig: true,
    },
  },
  setupFiles: ['<rootDir>/jest.env.ts'],
  verbose: true,
  testEnvironmentOptions: {
    customExportConditions: ['browser', 'node'],
  },
};

export default config;
