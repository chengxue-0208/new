import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Nodes from './pages/Nodes';
import Orders from './pages/Orders';
import SubscriptionPlans from './pages/SubscriptionPlans';
import Logs from './pages/Logs';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        <Route
          path="/users"
          element={
            <AppLayout>
              <Users />
            </AppLayout>
          }
        />
        <Route
          path="/nodes"
          element={
            <AppLayout>
              <Nodes />
            </AppLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <AppLayout>
              <Orders />
            </AppLayout>
          }
        />
        <Route
          path="/plans"
          element={
            <AppLayout>
              <SubscriptionPlans />
            </AppLayout>
          }
        />
        <Route
          path="/logs"
          element={
            <AppLayout>
              <Logs />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;