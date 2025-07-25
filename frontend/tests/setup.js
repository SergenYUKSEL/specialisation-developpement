/**
 * Jest setup file
 * Configures testing environment and global mocks
 */

// Mock localStorage for tests with actual storage simulation
const localStorageData = {};
const localStorageMock = {
  getItem: jest.fn((key) => localStorageData[key] || null),
  setItem: jest.fn((key, value) => { localStorageData[key] = value; }),
  removeItem: jest.fn((key) => { delete localStorageData[key]; }),
  clear: jest.fn(() => { 
    Object.keys(localStorageData).forEach(key => delete localStorageData[key]); 
  }),
};

// Mock sessionStorage for tests
const sessionStorageData = {};
const sessionStorageMock = {
  getItem: jest.fn((key) => sessionStorageData[key] || null),
  setItem: jest.fn((key, value) => { sessionStorageData[key] = value; }),
  removeItem: jest.fn((key) => { delete sessionStorageData[key]; }),
  clear: jest.fn(() => { 
    Object.keys(sessionStorageData).forEach(key => delete sessionStorageData[key]); 
  }),
};

// Mock window object
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

// Mock fetch for API calls
global.fetch = jest.fn();

// Mock console methods for cleaner test output
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Clean up after each test
afterEach(() => {
  // Clear all mocks
  jest.clearAllMocks();
  
  // Clear localStorage and sessionStorage data
  Object.keys(localStorageData).forEach(key => delete localStorageData[key]);
  Object.keys(sessionStorageData).forEach(key => delete sessionStorageData[key]);
  
  // Reset localStorage mock
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  
  // Reset fetch mock
  fetch.mockClear();
  
  // Reset DOM
  document.body.innerHTML = '';
  document.head.innerHTML = '';
}); 