module.exports = {
  preset: 'ts-jest',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: '.',
        outputName: 'test-report.integration.xml',
      },
    ],
  ],
  maxWorkers: '50%',
  testEnvironment: 'node',
  testMatch: ['**/*.integration.spec.ts'],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
}
