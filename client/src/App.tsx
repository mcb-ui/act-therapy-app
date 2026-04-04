import { lazy, Suspense, type ComponentType, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLoader from './components/AppLoader';
import Layout from './components/Layout';
import { useAuth } from './contexts/AuthContext';
import { appRoutes } from './data/routeCatalog';

const pageModules = import.meta.glob('./pages/**/*.tsx');

const lazyPageMap = Object.fromEntries(
  appRoutes.map((route) => {
    const importer = pageModules[route.componentPath];

    if (!importer) {
      throw new Error(`Missing page module for ${route.componentPath}`);
    }

    return [
      route.componentPath,
      lazy(importer as () => Promise<{ default: ComponentType }>),
    ];
  })
) as Record<string, ComponentType>;

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status, isAuthenticated } = useAuth();

  if (status === 'loading') {
    return <AppLoader label="Loading your practice space..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function GuestOnlyRoute({ children }: { children: ReactNode }) {
  const { status, isAuthenticated } = useAuth();

  if (status === 'loading') {
    return <AppLoader label="Checking your session..." />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRouter() {
  return (
    <Routes>
      {appRoutes.map((route) => {
        const Page = lazyPageMap[route.componentPath];
        const isGuestOnly = route.path === '/login' || route.path === '/register';

        let element = (
          <Suspense fallback={<AppLoader label={`Loading ${route.title.toLowerCase()}...`} />}>
            <Page />
          </Suspense>
        );

        if (route.withLayout) {
          element = <Layout>{element}</Layout>;
        }

        if (route.requiresAuth) {
          element = <ProtectedRoute>{element}</ProtectedRoute>;
        } else if (isGuestOnly) {
          element = <GuestOnlyRoute>{element}</GuestOnlyRoute>;
        }

        return <Route key={route.path} path={route.path} element={element} />;
      })}
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppRouter />
    </BrowserRouter>
  );
}
