const request = require('supertest');
const app = require('../server'); // Import the app instance
const mongoose = require('mongoose'); // Import the mongoose module

describe('Server', () => {
  let server;

  beforeAll(() => {
    server = app.listen(); // Start the server and store the instance
  });

  afterAll(async () => {
    await mongoose.disconnect();
    return new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  });
  

  // Test 1: Check if the server is running
  test('should verify that server is running', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Server is running');
  });

  // Test 2: Check if a non-existent route returns a 404 status
  test('should return 404 for non-existent route', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.statusCode).toBe(404);
  });
});
