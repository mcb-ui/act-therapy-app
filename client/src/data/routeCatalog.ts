import { exerciseCatalog } from './exerciseCatalog';

export interface AppRoute {
  path: string;
  title: string;
  componentPath: string;
  requiresAuth: boolean;
  withLayout: boolean;
}

export const appRoutes: AppRoute[] = [
  {
    path: '/login',
    title: 'Login',
    componentPath: './pages/Login.tsx',
    requiresAuth: false,
    withLayout: false,
  },
  {
    path: '/register',
    title: 'Register',
    componentPath: './pages/Register.tsx',
    requiresAuth: false,
    withLayout: false,
  },
  {
    path: '/',
    title: 'Dashboard',
    componentPath: './pages/Dashboard.tsx',
    requiresAuth: true,
    withLayout: true,
  },
  {
    path: '/progress',
    title: 'Progress',
    componentPath: './pages/Progress.tsx',
    requiresAuth: true,
    withLayout: true,
  },
  {
    path: '/modules',
    title: 'Modules',
    componentPath: './pages/Modules.tsx',
    requiresAuth: true,
    withLayout: true,
  },
  {
    path: '/coach',
    title: 'Coach',
    componentPath: './pages/Coach.tsx',
    requiresAuth: true,
    withLayout: true,
  },
  {
    path: '/hexaflex',
    title: 'Hexaflex',
    componentPath: './pages/Hexaflex.tsx',
    requiresAuth: true,
    withLayout: true,
  },
  ...exerciseCatalog.map<AppRoute>((exercise) => ({
    path: exercise.route,
    title: exercise.title,
    componentPath: exercise.componentPath,
    requiresAuth: true,
    withLayout: true,
  })),
  {
    path: '*',
    title: 'Not Found',
    componentPath: './pages/NotFound.tsx',
    requiresAuth: false,
    withLayout: false,
  },
];
