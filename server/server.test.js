import { describe, it, expect, vi, afterAll } from 'vitest';
import request from 'supertest';

// Capture the express app and listener instances
let appInstance;
let serverListener;

vi.mock('express', async (importOriginal) => {
  const originalExpress = await importOriginal();
  const expressDefault = originalExpress.default || originalExpress;
  const mockExpress = () => {
    const app = expressDefault();
    appInstance = app;
    
    const originalListen = app.listen;
    app.listen = function (...args) {
      serverListener = originalListen.apply(this, args);
      return serverListener;
    };
    
    return app;
  };
  
  mockExpress.json = expressDefault.json;
  mockExpress.Router = expressDefault.Router;
  
  return {
    default: mockExpress,
    json: expressDefault.json,
    Router: expressDefault.Router,
  };
});

// Mock database connection
vi.mock('./configs/db.js', () => ({
  default: vi.fn().mockResolvedValue(true)
}));

// Mock firebase config to avoid key errors during routes loading
vi.mock('./configs/firebase.js', () => ({
  initFirebase: vi.fn().mockReturnValue({
    auth: () => ({
      verifyIdToken: vi.fn().mockResolvedValue({ uid: 'mock-uid' })
    })
  }),
  default: {}
}));

// Set Port to 0 (ephemeral port) to avoid conflicts
process.env.PORT = '0';

// Import server.js to trigger express app initialization and routing
await import('./server.js');

describe('Server API Routes', () => {
  afterAll(() => {
    if (serverListener) {
      serverListener.close();
    }
  });

  it('GET / should return Server is running status', async () => {
    const response = await request(appInstance).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Server is running');
  });
});
