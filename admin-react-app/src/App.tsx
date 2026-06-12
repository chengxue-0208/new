import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
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
  const { isAuthenticated } = (await import('./contexts/AuthContext')).useAuth();
  const token = localStorage.getItem('token');

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  useEffect(() => {
    const api = (await import('./services/api')).default;
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
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