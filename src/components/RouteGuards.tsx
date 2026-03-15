import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../services/subscriptionService';

// ═══════════════════════════════════════════════════════════
// ─── ROUTE GUARDS ─────────────────────────────────────────
// ═══════════════════════════════════════════════════════════

/**
 * ProtectedRoute — requires user to be logged in.
 * Redirects to /login if not authenticated.
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = getCurrentUser();
  const location = useLocation();

  if (user == null) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

/**
 * AdminRoute — requires user to be logged in AND have admin role.
 * Redirects to /login if not authenticated, or /dashboard if not admin.
 */
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = getCurrentUser();
  const location = useLocation();

  if (user == null) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check admin: look for 'admin' in name/email or explicit role marker
  const isAdmin =
    user.email.includes('admin') ||
    localStorage.getItem('quantum_user_role') === 'admin';

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

/**
 * GuestRoute — only accessible when NOT logged in.
 * Redirects to /dashboard if already authenticated.
 */
export const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = getCurrentUser();

  if (user != null) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
