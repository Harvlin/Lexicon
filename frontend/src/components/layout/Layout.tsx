import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '@/components/providers/AuthProvider';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Don't show navbar on auth pages
  const isAuthPage = ['/login', '/register', '/onboarding'].includes(location.pathname);
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && !isAuthPage && !isLandingPage && <Navbar />}
      <main className={isAuthenticated && !isAuthPage && !isLandingPage ? 'pt-16' : ''}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;