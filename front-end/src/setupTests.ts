import '@testing-library/jest-dom';

Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_SERVER_PATH: 'http://localhost:6033',
      },
    },
  },
});

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

global.fetch = jest.fn();

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

afterEach(() => {
  jest.clearAllMocks();
});
