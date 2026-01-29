import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AuthRedirect } from './components/layout/AuthRedirect';
import { PublicOnlyRoute } from './components/layout/PublicOnlyRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { SkipLink } from './components/common/SkipLink';
import { AppWrapper } from './components/layout/AppWrapper';

// Lazy load pages for better performance
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const SplashPage = lazy(() => import('./pages/SplashPage').then(m => ({ default: m.SplashPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const BlogsPage = lazy(() => import('./pages/BlogsPage').then(m => ({ default: m.BlogsPage })));
const BlogViewPage = lazy(() => import('./pages/BlogViewPage').then(m => ({ default: m.BlogViewPage })));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage').then(m => ({ default: m.ResourcesPage })));
const LocalGuidePage = lazy(() => import('./pages/LocalGuidePage').then(m => ({ default: m.LocalGuidePage })));
const FareAnalysisPage = lazy(() => import('./pages/FareAnalysisPage').then(m => ({ default: m.FareAnalysisPage })));

import './styles/globals.css';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="lg" className="text-blue-600" />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppWrapper>
            <SkipLink />
              <Suspense fallback={<LoadingFallback />}>
              <Routes>
              {/* Public routes - only for non-authenticated users */}
              <Route element={<PublicOnlyRoute />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/splash" element={<SplashPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/blogs" element={<BlogsPage />} />
                <Route path="/blogs/:id" element={<BlogViewPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/local-guide" element={<LocalGuidePage />} />
                <Route path="/fare-analysis" element={<FareAnalysisPage />} />
              </Route>

              {/* Default redirect - check auth first */}
              <Route path="/" element={<AuthRedirect />} />
              <Route path="*" element={<AuthRedirect />} />
              </Routes>
            </Suspense>
          </AppWrapper>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
