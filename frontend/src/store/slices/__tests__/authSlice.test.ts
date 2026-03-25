import authReducer, { clearError, setCredentials } from '../authSlice';
import { AuthResponse } from '../../../types';

const mockAuthResponse: AuthResponse = {
  accessToken: 'test-access-token',
  refreshToken: 'test-refresh-token',
  tokenType: 'Bearer',
  user: {
    id: 1, firstName: 'John', lastName: 'Doe',
    email: 'john@test.com', role: 'CUSTOMER', createdAt: '2024-01-01',
  },
};

describe('authSlice', () => {
  const initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  test('initial state has no user', () => {
    // Clear localStorage for clean test
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    const state = authReducer({ ...initialState }, { type: '@@INIT' });
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  test('setCredentials updates state and localStorage', () => {
    const state = authReducer(initialState, setCredentials(mockAuthResponse));
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('john@test.com');
    expect(state.accessToken).toBe('test-access-token');
    expect(localStorage.getItem('accessToken')).toBe('test-access-token');
    expect(localStorage.getItem('refreshToken')).toBe('test-refresh-token');
  });

  test('clearError sets error to null', () => {
    const stateWithError = { ...initialState, error: 'Some error' };
    const state = authReducer(stateWithError, clearError());
    expect(state.error).toBeNull();
  });

  test('login.pending sets isLoading to true', () => {
    const state = authReducer(initialState, { type: 'auth/login/pending' });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('login.fulfilled sets user and tokens', () => {
    const state = authReducer(initialState, {
      type: 'auth/login/fulfilled',
      payload: mockAuthResponse,
    });
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.email).toBe('john@test.com');
    expect(state.accessToken).toBe('test-access-token');
  });

  test('login.rejected sets error', () => {
    const state = authReducer(initialState, {
      type: 'auth/login/rejected',
      payload: 'Invalid credentials',
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Invalid credentials');
  });

  test('logout.fulfilled clears state', () => {
    const loggedInState = {
      user: mockAuthResponse.user,
      accessToken: 'token',
      refreshToken: 'refresh',
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
    const state = authReducer(loggedInState, { type: 'auth/logout/fulfilled' });
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
