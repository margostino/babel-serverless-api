module.exports = {
  preset: 'ts-jest',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  coverageReporters: ['text', 'json'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '.',
        outputName: 'test-report.unit.xml',
      },
    ],
  ],
  maxWorkers: '50%',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['integration.spec.ts$'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
  prettierPath: require.resolve('prettier-2'),
}
