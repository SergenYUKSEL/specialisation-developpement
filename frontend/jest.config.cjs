/**
 * Jest configuration for frontend testing
 * Configured for ES modules and jsdom environment
 */
module.exports = {
  // Use jsdom environment for DOM manipulation testing
  testEnvironment: 'jsdom',
  
  // Transform ES modules with babel
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.js',
    '**/src/**/*.test.js'
  ],
  
  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/main.js',
    '!src/**/*.test.js'
  ],
  
  // Coverage thresholds following TDD best practices
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Module name mapping for static assets
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks after each test
  restoreMocks: true,
  
  // Verbose output for better debugging
  verbose: true
}; 