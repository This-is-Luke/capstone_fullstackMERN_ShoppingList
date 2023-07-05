import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent } from '@testing-library/react';
import App from './App';
import Login from './components/Login';
import { useNavigate } from 'react-router-dom';

// Existing test
test('App renders correctly', () => {
  const tree = renderer
    .create(<App />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

// Mock the useNavigate function from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// New test for Register button
test('Register button redirects to /register', () => {
  // Create a mock function for the navigation
  const navigate = jest.fn();
  
  // When useNavigate is called, return the mock navigation function
  useNavigate.mockReturnValue(navigate);

  // Render the Login component
  const { getByText } = render(<Login />);

  // Get the Register button
  const registerButton = getByText('Register');

  // Simulate a click event on the Register button
  fireEvent.click(registerButton);

  // Expect that the navigate function has been called with the /register route
  expect(navigate).toHaveBeenCalledWith('/register');
});
