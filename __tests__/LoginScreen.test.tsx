import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../src/route/LoginScreen/LoginScreen';
import { supabase } from '../src/services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock Supabase
jest.mock('../services/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn()
    }
  }
}));

describe('LoginScreen', () => {
  it('renders correctly', () => {
    // Simple shallow test to start with
    const { toJSON } = render(<LoginScreen />);
    expect(toJSON()).toBeTruthy();
  });
});
/*jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)), // Mock empty storage
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Jest Mock Setup
jest.mock('../src/services/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      resetPasswordForEmail: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockImplementation(() => Promise.resolve({ data: { email: 'test@example.com' }, error: null })),
    })),
  },
}));

describe('LoginScreen Tests', () => {
  // Testas, kuris patikrina, ar teisingai render'ina LoginScreen
  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<LoginScreen navigation={{ replace: jest.fn() }} />);
    expect(getByPlaceholderText('Username (Email)')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
  });

  // Testas, kuris patikrina, ar teisingai veikia prisijungimas su el. paštu
  it('logs in successfully with email', async () => {
    const mockNavigation = { replace: jest.fn() };
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);

    const emailInput = getByPlaceholderText('Username (Email)');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Log in');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');


    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: '123' } },
      error: null,
    });

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockNavigation.replace).toHaveBeenCalledWith('Home');
    });
  });

  // Testas, kuris patikrina, ar teisingai veikia prisijungimas su vartotojo vardu
  it('logs in successfully with username', async () => {
    const mockNavigation = { replace: jest.fn() };
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={mockNavigation} />);

    const emailInput = getByPlaceholderText('Username (Email)');
    const passwordInput = getByPlaceholderText('Password');
    const loginButton = getByText('Log in');

    fireEvent.changeText(emailInput, 'testuser'); // username instead of email
    fireEvent.changeText(passwordInput, 'password123');

    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValueOnce({
        data: { email: 'test@example.com' },
        error: null,
      }),
    }));

    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: '123' } },
      error: null,
    });

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockNavigation.replace).toHaveBeenCalledWith('Home');
    });
  });

  // Testas, kuris patikrina, ar teisingai veikia klaidos pranesimas, kai prisijungimo duomenys neteisingi
  it('shows an error on invalid login', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={{ replace: jest.fn() }} />);

    fireEvent.changeText(getByPlaceholderText('Username (Email)'), 'wronguser');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpassword');

    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid credentials' },
    });

    fireEvent.press(getByText('Log in'));

    await waitFor(() => {
      expect(getByText('Invalid credentials')).toBeTruthy();
    });
  });

  // Testas, kuris patikrina, ar veikia slaptažodžio pakeitimas
  it('sends a password reset email', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen navigation={{ replace: jest.fn() }} />);

    const emailInput = getByPlaceholderText('Username (Email)');
    const forgotPasswordButton = getByText('Forgot Password?');

    fireEvent.changeText(emailInput, 'test@example.com');

    (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValueOnce({
      error: null,
    });

    fireEvent.press(forgotPasswordButton);

    await waitFor(() => {
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('test@example.com');
    });
  });
});*/
