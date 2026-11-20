import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WasteScanner from './components/WasteScanner';
import ReportIssue from './components/ReportIssue';
import AdminDashboard from './components/AdminDashboard';
import EcoHub from './components/EcoHub';
import LoginPage from './components/LoginPage';
import { 
  getEcoPoints, 
  getScanCount, 
  incrementScanCount, 
  getCurrentUser, 
  logoutUser 
} from './utils/storage';

export default function App() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [activeTab, setActiveTab] = useState('scanner');
  const [userRole, setUserRole] = useState(currentUser?.role || 'student');
  const [loginRoleTarget, setLoginRoleTarget] = useState('student');
  const [ecoPoints, setEcoPoints] = useState(getEcoPoints());
  const [scanCount, setScanCount] = useState(getScanCount());

  // Synchronize state when user changes
  useEffect(() => {
    if (currentUser) {
      setUserRole(currentUser.role);
      if (currentUser.ecoPoints !== undefined) {
        setEcoPoints(currentUser.ecoPoints);
      }
      if (currentUser.scansCount !== undefined) {
        setScanCount(currentUser.scansCount);
      }
    }
  }, [currentUser]);

  const handleScanSuccess = () => {
    const updatedCount = incrementScanCount();
    setScanCount(updatedCount);
    setEcoPoints(getEcoPoints());
  };

  const handleReportSubmitted = () => {
    setEcoPoints(getEcoPoints());
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setUserRole(user.role);
    setEcoPoints(user.ecoPoints !== undefined ? user.ecoPoints : getEcoPoints());
    setScanCount(user.scansCount !== undefined ? user.scansCount : getScanCount());
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('scanner');
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setLoginRoleTarget('student');
    setActiveTab('login');
  };

  const handleOpenLogin = (preferredRole = 'student') => {
    setLoginRoleTarget(preferredRole);
    setActiveTab('login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Banner Ticker */}
      <div style={{
        background: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #06b6d4 100%)',
        color: '#ffffff',
        fontSize: '0.8rem',
        fontWeight: 700,
        padding: '6px 16px',
        textAlign: 'center',
        letterSpacing: '0.04em'
      }}>
        🌱 CAMPUS SUSTAINABILITY INITIATIVE: 94.2% Waste Segregation Target Reached • 480+ Incidents Resolved • 14 Tons Recycled
      </div>

      {/* Main Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        ecoPoints={ecoPoints}
        userRole={userRole}
        setUserRole={setUserRole}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLogin={handleOpenLogin}
      />

      {/* Main View Area */}
      <main style={{ flex: 1, paddingBottom: '60px' }}>
        {activeTab === 'login' && (
          <LoginPage 
            initialRole={loginRoleTarget}
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setActiveTab(userRole === 'admin' ? 'admin' : 'scanner')}
          />
        )}
        {activeTab === 'scanner' && (
          <WasteScanner onScanSuccess={handleScanSuccess} />
        )}
        {activeTab === 'report' && (
          <ReportIssue 
            onReportSubmitted={handleReportSubmitted} 
            currentUser={currentUser}
          />
        )}
        {activeTab === 'admin' && (
          <AdminDashboard 
            currentUser={currentUser}
            onNavigateLogin={handleOpenLogin}
          />
        )}
        {activeTab === 'eco' && (
          <EcoHub ecoPoints={ecoPoints} scanCount={scanCount} />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: 'rgba(10, 15, 13, 0.95)',
        borderTop: '1px solid rgba(52, 211, 153, 0.15)',
        padding: '24px 16px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <strong style={{ color: '#ffffff' }}>WasteWise</strong> — Smart Campus Waste Segregation & Management System
          </div>
          <div style={{ fontSize: '0.8rem' }}>
            Built for Campus Sustainability & Circular Economy Excellence
          </div>
        </div>
      </footer>
    </div>
  );
}
