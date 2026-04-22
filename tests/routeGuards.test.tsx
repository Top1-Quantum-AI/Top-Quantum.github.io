/**
 * Route Guards Tests
 */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { ProtectedRoute, AdminRoute, GuestRoute } from '../src/components/RouteGuards';
import { createUser, logoutUser } from '../src/services/subscriptionService';

const renderWithRouter = (initialRoute: string, element: React.ReactElement) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path='/login' element={<div data-testid='login-page'>Login</div>} />
        <Route path='/dashboard' element={<div data-testid='dashboard-page'>Dashboard</div>} />
        <Route path='/admin' element={<div data-testid='admin-page'>Admin</div>} />
        <Route path='/protected' element={element} />
        <Route path='/' element={<div data-testid='home-page'>Home</div>} />
      </Routes>
    </MemoryRouter>
  );
};

describe('RouteGuards', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('ProtectedRoute', () => {
    it('should redirect to /login when user is not authenticated', () => {
      renderWithRouter(
        '/protected',
        <ProtectedRoute>
          <div data-testid='protected-content'>Protected</div>
        </ProtectedRoute>
      );
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should render children when user is authenticated', () => {
      createUser('تست', 'test@test.com', 'شركة');
      renderWithRouter(
        '/protected',
        <ProtectedRoute>
          <div data-testid='protected-content'>Protected</div>
        </ProtectedRoute>
      );
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    });

    it('should redirect after logout', () => {
      createUser('تست', 'test@test.com', 'شركة');
      logoutUser();
      renderWithRouter(
        '/protected',
        <ProtectedRoute>
          <div data-testid='protected-content'>Protected</div>
        </ProtectedRoute>
      );
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });

  describe('AdminRoute', () => {
    it('should redirect to /login when not authenticated', () => {
      renderWithRouter(
        '/protected',
        <AdminRoute>
          <div data-testid='admin-content'>Admin Content</div>
        </AdminRoute>
      );
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('should redirect to /dashboard when authenticated but not admin', () => {
      createUser('مستخدم', 'user@test.com', 'شركة');
      renderWithRouter(
        '/protected',
        <AdminRoute>
          <div data-testid='admin-content'>Admin Content</div>
        </AdminRoute>
      );
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
    });

    it('should render children when user is admin (email contains admin)', () => {
      createUser('مدير', 'admin@test.com', 'شركة');
      renderWithRouter(
        '/protected',
        <AdminRoute>
          <div data-testid='admin-content'>Admin Content</div>
        </AdminRoute>
      );
      expect(screen.getByTestId('admin-content')).toBeInTheDocument();
    });

    it('should render children when user has admin role in localStorage', () => {
      createUser('مستخدم', 'user@test.com', 'شركة');
      localStorage.setItem('quantum_user_role', 'admin');
      renderWithRouter(
        '/protected',
        <AdminRoute>
          <div data-testid='admin-content'>Admin Content</div>
        </AdminRoute>
      );
      expect(screen.getByTestId('admin-content')).toBeInTheDocument();
    });
  });

  describe('GuestRoute', () => {
    it('should render children when not authenticated', () => {
      renderWithRouter(
        '/protected',
        <GuestRoute>
          <div data-testid='guest-content'>Guest Content</div>
        </GuestRoute>
      );
      expect(screen.getByTestId('guest-content')).toBeInTheDocument();
    });

    it('should redirect to /dashboard when authenticated', () => {
      createUser('تست', 'test@test.com', 'شركة');
      renderWithRouter(
        '/protected',
        <GuestRoute>
          <div data-testid='guest-content'>Guest Content</div>
        </GuestRoute>
      );
      expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
      expect(screen.queryByTestId('guest-content')).not.toBeInTheDocument();
    });
  });
});
