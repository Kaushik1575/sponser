import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddBike from './pages/AddBike';
import MyBikes from './pages/MyBikes';
import Bookings from './pages/Bookings';
import Revenue from './pages/Revenue';
import Profile from './pages/Profile';
import Withdrawal from './pages/Withdrawal';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

import FleetManager from './pages/FleetManager';
import AdminWithdrawals from './pages/AdminWithdrawals';
import AdminSponsorReport from './pages/AdminSponsorReport';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Fleet Setup Tool (Temporary/Admin) */}
          <Route path="/fleet-manager" element={<FleetManager />} />
          <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
          <Route path="/admin/sponsor-report" element={<AdminSponsorReport />} />

          {/* Protected Routes (Sponsor only) */}
          <Route element={<ProtectedRoute allowedRoles={['sponsor']} />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-bike" element={<AddBike />} />
              <Route path="/my-bikes" element={<MyBikes />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/revenue" element={<Revenue />} />
              <Route path="/withdrawal" element={<Withdrawal />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Catch all - Redirect to Login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
