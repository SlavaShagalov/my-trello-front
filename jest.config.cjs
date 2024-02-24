/** @type {import('ts-jest').JestConfigWithTsJest} */

module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules'],
  testMatch: ['**/*.test.ts'],
  automock: false,
  setupFiles: [
    "./setupJest.cjs"
  ]
};
