import '@testing-library/jest-dom';

// Mock do import.meta para Vite
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_SERVER_PATH: 'http://localhost:3000'
      }
    }
  }
});

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Mock do fetch
global.fetch = jest.fn();

// Mock do console.error para testes mais limpos
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Limpar mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});
