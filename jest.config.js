const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@react-pdf/renderer$': '<rootDir>/src/test/mocks/pdfMock.js',
    '^canvas$': '<rootDir>/src/test/mocks/canvasMock.js',
    '^date-fns/locale/tr$': '<rootDir>/src/test/mocks/dateMock.ts',
  },
  collectCoverageFrom: [
    'src/contexts/FilterContext.tsx',
    'src/hooks/useCarePlanForm.ts',
    'src/components/lab/LabResultDetailView.tsx',
    'src/components/notifications/NotificationFeed.tsx',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/index.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 80,
      functions: 90,
      lines: 85,
    },
  },
  testMatch: [
    '<rootDir>/src/__tests__/hooks/useCarePlanForm.test.ts',
    '<rootDir>/src/contexts/__tests__/FilterContext.test.tsx',
    '<rootDir>/src/components/lab/__tests__/LabResultDetailView.test.tsx',
    '<rootDir>/src/components/notifications/__tests__/NotificationFeed.test.tsx',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  testTimeout: 10000,
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  transformIgnorePatterns: ['node_modules/(?!(@react-native|react-native)/)'],
  testEnvironmentOptions: {
    customExportConditions: [''],
    resources: 'usable',
    runScripts: 'dangerously',
  },
};

module.exports = createJestConfig(customJestConfig);
