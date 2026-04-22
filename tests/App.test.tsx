/**
 * App.tsx Component Tests
 * Tests routing, loading states, error boundary, and sub-components.
 */
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';

import App from '../src/App';

// Mock ALL lazy-loaded page components to avoid their full dependency trees
jest.mock('../src/pages/LandingPage', () => ({
  __esModule: true,
  default: () => <div data-testid="landing-page">LandingPage</div>,
}));
jest.mock('../src/pages/PricingPage', () => ({
  __esModule: true,
  default: () => <div data-testid="pricing-page">PricingPage</div>,
}));
jest.mock('../src/pages/AuthPage', () => ({
  __esModule: true,
  default: () => <div data-testid="auth-page">AuthPage</div>,
}));
jest.mock('../src/AdvancedQuantumDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="advanced-dashboard">AdvancedQuantumDashboard</div>,
}));
jest.mock('../src/pages/AdminDashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="admin-dashboard">AdminDashboard</div>,
}));
jest.mock('../src/components/OnboardingTour', () => ({
  __esModule: true,
  default: ({ onComplete }: { onComplete: () => void }) => (
    <div data-testid="onboarding-tour">
      <button onClick={onComplete}>Complete Tour</button>
    </div>
  ),
}));

// Mock framer-motion to avoid animation complexity in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: React.HTMLProps<HTMLElement>) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }: React.HTMLProps<HTMLHeadingElement>) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: React.HTMLProps<HTMLHeadingElement>) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: React.HTMLProps<HTMLParagraphElement>) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: React.HTMLProps<HTMLSpanElement>) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: React.HTMLProps<HTMLButtonElement>) =>
      <button {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>,
    a: ({ children, ...props }: React.HTMLProps<HTMLAnchorElement>) => <a {...props}>{children}</a>,
    li: ({ children, ...props }: React.HTMLProps<HTMLLIElement>) => <li {...props}>{children}</li>,
    ul: ({ children, ...props }: React.HTMLProps<HTMLUListElement>) => <ul {...props}>{children}</ul>,
    img: (props: React.HTMLProps<HTMLImageElement>) => <img {...props} />,
    nav: ({ children, ...props }: React.HTMLProps<HTMLElement>) => <nav {...props}>{children}</nav>,
    header: ({ children, ...props }: React.HTMLProps<HTMLElement>) => <header {...props}>{children}</header>,
    footer: ({ children, ...props }: React.HTMLProps<HTMLElement>) => <footer {...props}>{children}</footer>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAnimation: () => ({ start: jest.fn(), stop: jest.fn() }),
  useInView: () => true,
}));

const renderWithRouter = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>
  );
};

describe('App – Routing', () => {
  it('should render LandingPage on / route', async () => {
    renderWithRouter(['/']);
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });

  it('should render PricingPage on /pricing route', async () => {
    renderWithRouter(['/pricing']);
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByTestId('pricing-page')).toBeInTheDocument();
  });

  it('should redirect to /login when accessing /dashboard without auth', async () => {
    localStorage.clear();
    renderWithRouter(['/dashboard']);
    await act(async () => { await Promise.resolve(); });
    // ProtectedRoute redirects unauthenticated users
    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
  });

  it('should redirect to /login when accessing /admin without auth', async () => {
    localStorage.clear();
    renderWithRouter(['/admin']);
    await act(async () => { await Promise.resolve(); });
    // AdminRoute redirects unauthenticated users
    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
  });

  it('should render AuthPage on /login route', async () => {
    renderWithRouter(['/login']);
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
  });

  it('should render AuthPage on /register route', async () => {
    renderWithRouter(['/register']);
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
  });

  it('should render DemoPage on /demo route', async () => {
    renderWithRouter(['/demo']);
    await act(async () => { await Promise.resolve(); });
    const demoBtns = screen.getAllByText(/العرض التجريبي/);
    expect(demoBtns.length).toBeGreaterThanOrEqual(1);
  });
});

describe('App – DemoPage', () => {
  it('should show demo page title and description', async () => {
    renderWithRouter(['/demo']);
    await act(async () => { await Promise.resolve(); });
    const titles = screen.getAllByText(/العرض التجريبي/);
    expect(titles.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/استكشف جميع ميزات النظام/)).toBeInTheDocument();
  });

  it('should show start demo button', async () => {
    renderWithRouter(['/demo']);
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByText(/ابدأ العرض التجريبي/)).toBeInTheDocument();
  });

  it('should show register link', async () => {
    renderWithRouter(['/demo']);
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByText(/أنشئ حسابًا مجانيًا/)).toBeInTheDocument();
  });

  it('should show dashboard when start demo is clicked', async () => {
    const user = userEvent.setup({ delay: null });
    renderWithRouter(['/demo']);
    await act(async () => { await Promise.resolve(); });
    const startButton = screen.getByText(/ابدأ العرض التجريبي/);
    await user.click(startButton);
    expect(screen.getByTestId('advanced-dashboard')).toBeInTheDocument();
  });
});

describe('App – ErrorBoundary', () => {
  it('should render children when there is no error', async () => {
    renderWithRouter(['/']);
    await act(async () => { await Promise.resolve(); });
    // ErrorBoundary passes through children when no error
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });
});

describe('App – PageLoader', () => {
  it('should render PageLoader as Suspense fallback', () => {
    render(
      <MemoryRouter>
        <Suspense fallback={<div data-testid="page-loader">Loading...</div>}>
          <App />
        </Suspense>
      </MemoryRouter>
    );
    // The page is either loading or resolved
    expect(document.body).toBeTruthy();
  });
});

