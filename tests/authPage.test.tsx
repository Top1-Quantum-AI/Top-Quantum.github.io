/**
 * AuthPage component tests
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import AuthPage from '../src/pages/AuthPage';
import { apiLogin, apiRegister, checkBackendAvailable } from '../src/services/apiClient';

// Mock apiClient to avoid real network calls and import.meta issues
jest.mock('../src/services/apiClient', () => ({
  apiLogin: jest.fn(),
  apiRegister: jest.fn(),
  checkBackendAvailable: jest.fn().mockResolvedValue(false),
  isAuthenticated: jest.fn().mockReturnValue(false),
  clearToken: jest.fn(),
  ApiError: class ApiError extends Error {
    status: number;
    body: unknown;
    name = 'ApiError';
    constructor(message: string, status: number, body: unknown) {
      super(message);
      this.status = status;
      this.body = body;
    }
  },
}));

// Mock subscriptionService to simplify
jest.mock('../src/services/subscriptionService', () => {
  const makePlan = (name: string, price: number) => ({
    name,
    price,
    features: [],
    limits: {
      maxQubits: 5,
      maxSimulationsPerMonth: 100,
      maxAlgorithms: 3,
      maxAPIRequestsPerDay: 100,
      maxTokensPerDay: 10000,
    },
  });
  return {
    createUser: jest.fn(),
    loginUser: jest.fn(),
    getCurrentUser: jest.fn().mockReturnValue(null),
    PLANS: {
      free: makePlan('المجاني', 0),
      professional: makePlan('الاحترافي', 29),
      enterprise: makePlan('المؤسسات', 99),
    },
  };
});

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...p }: React.HTMLProps<HTMLDivElement>) => <div {...p}>{children}</div>,
    h1: ({ children, ...p }: React.HTMLProps<HTMLHeadingElement>) => <h1 {...p}>{children}</h1>,
    h2: ({ children, ...p }: React.HTMLProps<HTMLHeadingElement>) => <h2 {...p}>{children}</h2>,
    p: ({ children, ...p }: React.HTMLProps<HTMLParagraphElement>) => <p {...p}>{children}</p>,
    button: ({ children, ...p }: React.HTMLProps<HTMLButtonElement>) =>
      <button {...(p as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>,
    span: ({ children, ...p }: React.HTMLProps<HTMLSpanElement>) => <span {...p}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const renderLogin = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  );

const renderRegister = () =>
  render(
    <MemoryRouter initialEntries={['/register']}>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  );

describe('AuthPage – Login mode', () => {
  it('should render without crashing', () => {
    renderLogin();
    expect(document.body).toBeTruthy();
  });

  it('should render login form', () => {
    renderLogin();
    // Login page has email and password inputs
    expect(screen.getByPlaceholderText('name@company.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('أدخل كلمة مرور قوية')).toBeInTheDocument();
  });

  it('should show error when submitting without email and password', async () => {
    const user = userEvent.setup({ delay: null });
    renderLogin();
    const submitBtn = screen.getByRole('button', { name: /تسجيل الدخول/i });
    await user.click(submitBtn);
    expect(screen.getByText(/يرجى ملء جميع الحقول/i)).toBeInTheDocument();
  });

  it('should have password type for password field', () => {
    renderLogin();
    const passwordInput = screen.getByPlaceholderText('أدخل كلمة مرور قوية');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should call apiLogin with credentials on submit', async () => {
    const user = userEvent.setup({ delay: null });
    const mockLogin = apiLogin as jest.Mock;
    const mockCheck = checkBackendAvailable as jest.Mock;
    mockCheck.mockResolvedValue(true);
    mockLogin.mockResolvedValue({ user: { id: '1', email: 'test@test.com', username: 'test' }, token: 'token' });

    renderLogin();
    await user.type(screen.getByPlaceholderText('name@company.com'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('أدخل كلمة مرور قوية'), 'password123');
    const submitBtn = screen.getByRole('button', { name: /تسجيل الدخول/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should show error message on login failure', async () => {
    const user = userEvent.setup({ delay: null });
    const mockLogin = apiLogin as jest.Mock;
    const mockCheck = checkBackendAvailable as jest.Mock;
    mockCheck.mockResolvedValue(true);
    const { ApiError: MockApiError } = jest.requireMock('../src/services/apiClient');
    mockLogin.mockRejectedValue(new MockApiError('بيانات خاطئة', 401, {}));

    renderLogin();
    await user.type(screen.getByPlaceholderText('name@company.com'), 'bad@example.com');
    await user.type(screen.getByPlaceholderText('أدخل كلمة مرور قوية'), 'wrongpassword');
    const submitBtn = screen.getByRole('button', { name: /تسجيل الدخول/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/بيانات خاطئة|خطأ/i)).toBeInTheDocument();
    });
  });
});

describe('AuthPage – Register mode', () => {
  it('should render register form', () => {
    renderRegister();
    expect(screen.getByPlaceholderText('name@company.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('أدخل كلمة مرور قوية')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('أدخل اسمك الكامل')).toBeInTheDocument();
  });

  it('should show error when submitting without name', async () => {
    const user = userEvent.setup({ delay: null });
    renderRegister();
    await user.type(screen.getByPlaceholderText('name@company.com'), 'test@test.com');
    await user.type(screen.getByPlaceholderText('أدخل كلمة مرور قوية'), 'password123');
    const submitBtn = screen.getByRole('button', { name: /إنشاء الحساب/i });
    await user.click(submitBtn);
    await waitFor(() => {
      expect(document.body.textContent).toMatch(/يرجى/);
    });
  });

  it('should show error when terms not accepted', async () => {
    const user = userEvent.setup({ delay: null });
    renderRegister();
    await user.type(screen.getByPlaceholderText('أدخل اسمك الكامل'), 'Test User');
    await user.type(screen.getByPlaceholderText('name@company.com'), 'test@test.com');
    await user.type(screen.getByPlaceholderText('أدخل كلمة مرور قوية'), 'password123');
    const submitBtn = screen.getByRole('button', { name: /إنشاء الحساب/i });
    await user.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByText(/يرجى الموافقة/i)).toBeInTheDocument();
    });
  });

  it('should call apiRegister with form data on valid submission', async () => {
    const user = userEvent.setup({ delay: null });
    const mockRegister = apiRegister as jest.Mock;
    const mockCheck = checkBackendAvailable as jest.Mock;
    mockCheck.mockResolvedValue(true);
    mockRegister.mockResolvedValue({ user: { id: '1', email: 'new@test.com', username: 'new' }, token: 'token' });

    renderRegister();
    await user.type(screen.getByPlaceholderText('أدخل اسمك الكامل'), 'Test User');
    await user.type(screen.getByPlaceholderText('name@company.com'), 'new@test.com');
    await user.type(screen.getByPlaceholderText('أدخل كلمة مرور قوية'), 'password123');
    // Check the terms checkbox
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    const submitBtn = screen.getByRole('button', { name: /إنشاء الحساب/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });
  });

  it('should render plan selection', () => {
    renderRegister();
    // Register page shows plan options
    expect(document.body.textContent).toMatch(/مجاني|احترافي|خطة/);
  });
});
