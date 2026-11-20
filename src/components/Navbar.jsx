import React, { useState } from 'react';
import { 
  Recycle, 
  Scan, 
  AlertTriangle, 
  ShieldCheck, 
  BookOpen, 
  Award,
  Users,
  LogIn,
  LogOut,
  ChevronDown,
  GraduationCap
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  ecoPoints, 
  userRole, 
  setUserRole,
  currentUser,
  onLogout,
  onOpenLogin
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleRole = () => {
    const nextRole = userRole === 'student' ? 'admin' : 'student';
    setUserRole(nextRole);
    if (nextRole === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('scanner');
    }
  };

  const handleLoginClick = (preferredRole) => {
    setProfileDropdownOpen(false);
    if (onOpenLogin) {
      onOpenLogin(preferredRole);
    } else {
      setActiveTab('login');
    }
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10, 15, 13, 0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(52, 211, 153, 0.15)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('scanner')} 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '13px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
          }}>
            <Recycle size={25} color="#ffffff" style={{ animation: 'spin 14s linear infinite' }} />
          </div>
          <div>
            <div style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '1.35rem', 
              fontWeight: 800,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #ffffff 0%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              WASTE<span style={{ color: '#10b981', WebkitTextFillColor: '#10b981' }}>WISE</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Campus Circular Economy & Segregation
            </div>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '4px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => setActiveTab('scanner')}
            style={{
              padding: '8px 14px',
              borderRadius: '11px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'all 0.25s ease',
              background: activeTab === 'scanner' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'scanner' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <Scan size={16} />
            <span>AI Segregation</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            style={{
              padding: '8px 14px',
              borderRadius: '11px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'all 0.25s ease',
              background: activeTab === 'report' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'report' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <AlertTriangle size={16} />
            <span>Report Issue</span>
          </button>

          <button
            onClick={() => setActiveTab('eco')}
            style={{
              padding: '8px 14px',
              borderRadius: '11px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'all 0.25s ease',
              background: activeTab === 'eco' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'eco' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <BookOpen size={16} />
            <span>Circular Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            style={{
              padding: '8px 14px',
              borderRadius: '11px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'all 0.25s ease',
              background: activeTab === 'admin' ? '#06b6d4' : 'transparent',
              color: activeTab === 'admin' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            <ShieldCheck size={16} />
            <span>Campus Admin</span>
          </button>

          {/* Login / Auth Portal Tab */}
          <button
            onClick={() => setActiveTab('login')}
            style={{
              padding: '8px 14px',
              borderRadius: '11px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.86rem',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              transition: 'all 0.25s ease',
              background: activeTab === 'login' 
                ? (userRole === 'admin' ? '#06b6d4' : '#10b981') 
                : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === 'login' ? '#ffffff' : 'var(--text-main)',
              border: activeTab === 'login' 
                ? 'none' 
                : '1px solid rgba(52, 211, 153, 0.2)'
            }}
          >
            <LogIn size={16} color={activeTab === 'login' ? '#ffffff' : '#34d399'} />
            <span>Login Portal</span>
          </button>
        </nav>

        {/* Right Section: Points & Profile / Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
          {/* Eco-Points Pill (for students & general) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '5px 12px',
            borderRadius: '999px'
          }}>
            <Award size={16} color="#34d399" />
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399' }}>
              {ecoPoints} <span style={{ fontSize: '0.72rem', fontWeight: 500, opacity: 0.8 }}>Eco-Pts</span>
            </div>
          </div>

          {/* User Profile / Status Pill */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: currentUser.role === 'admin' 
                    ? 'rgba(6, 182, 212, 0.12)' 
                    : 'rgba(16, 185, 129, 0.12)',
                  border: currentUser.role === 'admin' 
                    ? '1px solid rgba(6, 182, 212, 0.35)' 
                    : '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '4px 10px 4px 5px',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: '#ffffff'
                }}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: currentUser.role === 'admin' ? '1.5px solid #38bdf8' : '1.5px solid #34d399'
                  }}
                />
                <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
                    {currentUser.name}
                  </div>
                  <div style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: currentUser.role === 'admin' ? '#38bdf8' : '#34d399'
                  }}>
                    {currentUser.role === 'admin' ? '🛡️ Campus Staff' : '🎓 Student'}
                  </div>
                </div>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div 
                  className="glass-card"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '260px',
                    padding: '12px',
                    zIndex: 200,
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.12)'
                  }}
                >
                  <div style={{
                    paddingBottom: '10px',
                    marginBottom: '10px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {currentUser.email}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: currentUser.role === 'admin' ? '#38bdf8' : '#34d399', marginTop: '4px', fontWeight: 600 }}>
                      ID: {currentUser.id} • {currentUser.role === 'admin' ? 'Admin Authority' : `${currentUser.ecoPoints} Eco-Points`}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <button
                      onClick={() => handleLoginClick('student')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: '#34d399',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <GraduationCap size={15} />
                      <span>Switch to Student Login</span>
                    </button>

                    <button
                      onClick={() => handleLoginClick('admin')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'rgba(6, 182, 212, 0.1)',
                        color: '#38bdf8',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <ShieldCheck size={15} />
                      <span>Switch to Admin Login</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        if (onLogout) onLogout();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#f87171',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left',
                        marginTop: '4px'
                      }}
                    >
                      <LogOut size={15} />
                      <span>Log Out Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleLoginClick('student')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.3)'
              }}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          )}

          {/* Quick Role Toggle Switcher */}
          <button
            onClick={toggleRole}
            title="Toggle between Student view and Campus Staff Admin view"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '999px',
              background: userRole === 'admin' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.06)',
              border: userRole === 'admin' ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              color: userRole === 'admin' ? '#38bdf8' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Users size={13} />
            <span>{userRole === 'admin' ? 'Staff Mode' : 'Student Mode'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
