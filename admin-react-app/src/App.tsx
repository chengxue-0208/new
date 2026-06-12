import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Nodes from './pages/Nodes';
import Orders from './pages/Orders';
import SubscriptionPlans from './pages/SubscriptionPlans';
import Logs from './pages/Logs';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      setIsAuthenticated(!!token && !!userData);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  useEffect(() => {
    import('./services/api').then(api => {
      const token = localStorage.getItem('token');
      if (token) {
        api.default.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="nodes" element={<Nodes />} />
            <Route path="orders" element={<Orders />} />
            <Route path="plans" element={<SubscriptionPlans />} />
            <Route path="logs" element={<Logs />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;