import { supabase } from '../lib/supabaseClient';
import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Lock,
  Mail,
  User,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building,
  ArrowRight,
  Recycle,
  HelpCircle,
  BadgeCheck,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  DEMO_USERS, 
  authenticateUser, 
  registerUser, 
  setCurrentUser 
} from '../utils/storage';

const STUDENT_DEPARTMENTS = [
  'Computer Science & Environmental Eng.',
  'Biotechnology & Life Sciences',
  'Civil & Urban Planning',
  'Mechanical & Materials Science',
  'Business Administration & Economics',
  'School of Architecture & Design',
  'Campus Arts & Humanities'
];

const ADMIN_DIVISIONS = [
  'Campus Facilities & Operations',
  'Campus Sanitation & Safety Division',
  'Office of Campus Sustainability',
  'Hazardous & E-Waste Environmental Council',
  'Campus Estate & Grounds Management'
];

export default function LoginPage({ 
  onLoginSuccess, 
  initialRole = 'student', 
  onCancel 
}) {
  const [role, setRole] = useState(initialRole); // 'student' or 'admin'
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'register'
  
  // Form fields
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [securityCode, setSecurityCode] = useState('');
  
  // Registration specific fields
  const [name, setName] = useState('');
  const [customId, setCustomId] = useState('');
  const [department, setDepartment] = useState(STUDENT_DEPARTMENTS[0]);
  const [hostel, setHostel] = useState('North Quad Residences - Hall 3');
  const [pledgeAccepted, setPledgeAccepted] = useState(true);

  // Status & Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const isStudent = role === 'student';
  const themeColor = isStudent ? '#10b981' : '#06b6d4';
  const themeGlow = isStudent ? 'rgba(16, 185, 129, 0.3)' : 'rgba(6, 182, 212, 0.3)';
  const themeBgSubtle = isStudent ? 'rgba(16, 185, 129, 0.1)' : 'rgba(6, 182, 212, 0.1)';
  const themeBorder = isStudent ? 'rgba(52, 211, 153, 0.3)' : 'rgba(6, 182, 212, 0.35)';

  const handleRoleSwitch = (newRole) => {
    setRole(newRole);
    setErrorMsg('');
    setSuccessMsg('');
    setIdentifier('');
    setPassword('');
    setSecurityCode('');
    if (newRole === 'admin') {
      setDepartment(ADMIN_DIVISIONS[0]);
    } else {
      setDepartment(STUDENT_DEPARTMENTS[0]);
    }
  };

  const handleQuickDemo = (demoUser) => {
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setCurrentUser(demoUser);
      setIsLoading(false);
      setSuccessMsg(`Welcome back, ${demoUser.name}! Access granted as ${demoUser.role === 'admin' ? 'Campus Staff Admin' : 'Student'}.`);
      
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(demoUser);
        }
      }, 700);
    }, 400);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (authMode === 'signin') {
      if (!identifier.trim()) {
        setErrorMsg(isStudent ? 'Please enter your Campus Email or Student ID.' : 'Please enter your Staff Email or Admin ID.');
        return;
      }
      if (!password) {
        setErrorMsg('Please enter your password.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        const result = authenticateUser({
          identifier,
          password,
          role,
          securityCode
        });

        setIsLoading(false);

        if (!result.success) {
          setErrorMsg(result.message);
        } else {
          setSuccessMsg(`Authentication successful! Welcome, ${result.user.name}.`);
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 }
          });
          setTimeout(() => {
            if (onLoginSuccess) {
              onLoginSuccess(result.user);
            }
          }, 700);
        }
      }, 450);

    } else {
      // Registration
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!identifier.trim()) {
        setErrorMsg('Please enter a valid campus email address.');
        return;
      }
      if (!customId.trim()) {
        setErrorMsg(isStudent ? 'Please provide a Student ID (e.g. STU-8899).' : 'Please provide an Employee/Staff ID (e.g. ADM-3011).');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      if (isStudent && !pledgeAccepted) {
        setErrorMsg('Please accept the Campus Eco-Segregation Pledge to proceed.');
        return;
      }
      if (!isStudent && securityCode.trim().toUpperCase() !== 'ADMIN2026') {
        setErrorMsg('Administrative enrollment requires authorization passkey (ADMIN2026).');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        const result = registerUser({
          name,
          email: identifier,
          id: customId,
          role,
          department,
          hostel: isStudent ? hostel : undefined,
          password,
          securityCode
        });

        setIsLoading(false);

        if (!result.success) {
          setErrorMsg(result.message);
        } else {
          setSuccessMsg(
            isStudent 
              ? `Account registered! 🎁 +100 Welcome Eco-Points awarded to ${result.user.name}!` 
              : `Admin profile authorized for ${result.user.name}. Terminal ready.`
          );
          confetti({
            particleCount: 110,
            spread: 90,
            origin: { y: 0.55 }
          });
          setTimeout(() => {
            if (onLoginSuccess) {
              onLoginSuccess(result.user);
            }
          }, 850);
        }
      }, 500);
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      position: 'relative'
    }}>
      {/* Background ambient decorative glowing orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: '320px',
        height: '320px',
        borderRadius: '50%',
        background: isStudent ? 'rgba(16, 185, 129, 0.12)' : 'rgba(6, 182, 212, 0.12)',
        filter: 'blur(90px)',
        pointerEvents: 'none',
        zIndex: 0,
        transition: 'all 0.5s ease'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '15%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: isStudent ? 'rgba(5, 150, 105, 0.09)' : 'rgba(2, 132, 199, 0.09)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        zIndex: 0,
        transition: 'all 0.5s ease'
      }} />

      {/* Main Container Card */}
      <div 
        className="glass-card" 
        style={{
          width: '100%',
          maxWidth: '680px',
          position: 'relative',
          zIndex: 1,
          padding: '0',
          overflow: 'hidden',
          border: `1px solid ${themeBorder}`,
          boxShadow: `0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px ${themeGlow}`
        }}
      >
        {/* Card Top Brand & Role Tabs */}
        <div style={{
          background: 'rgba(10, 18, 14, 0.9)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '24px 28px 16px'
        }}>
          {/* Top Logo and Tag */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${themeColor} 0%, #059669 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 15px ${themeGlow}`
              }}>
                <Recycle size={22} color="#ffffff" style={{ animation: 'spin 14s linear infinite' }} />
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#ffffff'
                }}>
                  WASTE<span style={{ color: themeColor }}>WISE</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Campus Identity & Authentication Gateway
                </div>
              </div>
            </div>

            {onCancel && (
              <button
                onClick={onCancel}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-muted)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                Continue as Guest
              </button>
            )}
          </div>

          {/* Role Switching Selector Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            background: 'rgba(0, 0, 0, 0.35)',
            padding: '6px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            {/* Student Role Tab */}
            <button
              type="button"
              onClick={() => handleRoleSwitch('student')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '12px',
                border: isStudent ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid transparent',
                background: isStudent 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%)' 
                  : 'transparent',
                color: isStudent ? '#34d399' : 'var(--text-muted)',
                fontWeight: isStudent ? 700 : 500,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: isStudent ? '0 4px 15px rgba(16, 185, 129, 0.2)' : 'none'
              }}
            >
              <GraduationCap size={19} color={isStudent ? '#34d399' : 'var(--text-muted)'} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ lineHeight: 1.2 }}>Student Portal</div>
                <div style={{ fontSize: '0.68rem', opacity: 0.8, fontWeight: 400 }}>Eco-Points & AI Scanner</div>
              </div>
            </button>

            {/* Admin Role Tab */}
            <button
              type="button"
              onClick={() => handleRoleSwitch('admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '12px 14px',
                borderRadius: '12px',
                border: !isStudent ? '1px solid rgba(6, 182, 212, 0.5)' : '1px solid transparent',
                background: !isStudent 
                  ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(2, 132, 199, 0.1) 100%)' 
                  : 'transparent',
                color: !isStudent ? '#38bdf8' : 'var(--text-muted)',
                fontWeight: !isStudent ? 700 : 500,
                fontSize: '0.92rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: !isStudent ? '0 4px 15px rgba(6, 182, 212, 0.2)' : 'none'
              }}
            >
              <ShieldCheck size={19} color={!isStudent ? '#38bdf8' : 'var(--text-muted)'} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ lineHeight: 1.2 }}>Campus Admin</div>
                <div style={{ fontSize: '0.68rem', opacity: 0.8, fontWeight: 400 }}>Sanitation & Dispatch</div>
              </div>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div style={{ padding: '28px 32px' }}>
          
          {/* Header Description Banner */}
          <div style={{
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <h2 style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {isStudent ? (
                  <>
                    <span>Student Campus Login</span>
                    <span style={{
                      fontSize: '0.72rem',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      fontWeight: 600
                    }}>
                      Green Rewards
                    </span>
                  </>
                ) : (
                  <>
                    <span>Facilities & Admin Portal</span>
                    <span style={{
                      fontSize: '0.72rem',
                      background: 'rgba(6, 182, 212, 0.2)',
                      color: '#38bdf8',
                      padding: '3px 8px',
                      borderRadius: '999px',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      fontWeight: 600
                    }}>
                      Staff Clearance
                    </span>
                  </>
                )}
              </h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
                {isStudent 
                  ? 'Access your Eco-Points wallet, scan items with AI, and track dormitory rankings.'
                  : 'Restricted administrative dispatch terminal for incident management and sanitation crews.'
                }
              </p>
            </div>

            {/* Sign In vs Register Segmented Control */}
            <div style={{
              display: 'inline-flex',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setErrorMsg(''); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  background: authMode === 'signin' ? themeColor : 'transparent',
                  color: authMode === 'signin' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  background: authMode === 'register' ? themeColor : 'transparent',
                  color: authMode === 'register' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {isStudent ? 'Join / Sign Up' : 'Request Access'}
              </button>
            </div>
          </div>

          {/* 1-Click Demo Profiles Bar */}
          <div style={{
            background: themeBgSubtle,
            border: `1px dashed ${themeBorder}`,
            borderRadius: '14px',
            padding: '12px 16px',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: themeColor,
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                <Sparkles size={14} />
                <span>Instant 1-Click Demo Testing</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                Click any profile to test instantly
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {(isStudent ? DEMO_USERS.students : DEMO_USERS.admins).map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleQuickDemo(demo)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    background: 'rgba(10, 18, 14, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = themeColor;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <img
                    src={demo.avatar}
                    alt={demo.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: `1px solid ${themeBorder}`
                    }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {demo.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {isStudent ? `${demo.ecoPoints} Pts • ${demo.id}` : `${demo.roleTitle.split(' ')[0]} • ${demo.id}`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMsg && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#f87171',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#34d399',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Login / Register Form */}
          <form onSubmit={handleSubmit}>
            {authMode === 'register' && (
              <>
                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>
                    Full Name & Title
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User 
                      size={17} 
                      color="var(--text-muted)" 
                      style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder={isStudent ? "e.g. Maya Lin" : "e.g. Dr. Arthur Vance"}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ paddingLeft: '42px' }}
                    />
                  </div>
                </div>

                {/* ID Field */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>
                    {isStudent ? 'Campus Student ID' : 'Official Staff / Employee ID'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <BadgeCheck 
                      size={17} 
                      color="var(--text-muted)" 
                      style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder={isStudent ? "e.g. STU-9182" : "e.g. ADM-4402"}
                      value={customId}
                      onChange={(e) => setCustomId(e.target.value)}
                      style={{ paddingLeft: '42px' }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email / Identifier */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.8rem' }}>
                {authMode === 'signin' 
                  ? (isStudent ? 'Campus Email or Student ID' : 'Official Staff Email or Admin ID')
                  : (isStudent ? 'University Email Address' : 'Official Facilities Email')
                }
              </label>
              <div style={{ position: 'relative' }}>
                <Mail 
                  size={17} 
                  color="var(--text-muted)" 
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder={
                    isStudent 
                      ? "alex.chen@campus.edu or STU-8821" 
                      : "a.vance@campus.facilities.edu or ADM-1044"
                  }
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  style={{ paddingLeft: '42px' }}
                />
              </div>
            </div>

            {/* Department / Division Select (for registration or context) */}
            {authMode === 'register' && (
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem' }}>
                  {isStudent ? 'Academic Department' : 'Campus Division'}
                </label>
                <div style={{ position: 'relative' }}>
                  <Building 
                    size={17} 
                    color="var(--text-muted)" 
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
                  />
                  <select
                    className="form-select"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                  >
                    {(isStudent ? STUDENT_DEPARTMENTS : ADMIN_DIVISIONS).map((dept, i) => (
                      <option key={i} value={dept} style={{ background: '#121c18', color: '#fff' }}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Student Hostel (only on student register) */}
            {authMode === 'register' && isStudent && (
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem' }}>
                  Residence Hall / Hostel
                </label>
                <div style={{ position: 'relative' }}>
                  <Compass 
                    size={17} 
                    color="var(--text-muted)" 
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Greenwood Hall - Suite 12"
                    value={hostel}
                    onChange={(e) => setHostel(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label" style={{ margin: 0, fontSize: '0.8rem' }}>
                  Password
                </label>
                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: themeColor,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock 
                  size={17} 
                  color="var(--text-muted)" 
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your security password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '42px', paddingRight: '42px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Admin Security Key (Only for Admin Mode) */}
            {!isStudent && (
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ margin: 0, fontSize: '0.8rem' }}>
                    Security Key / 2FA Passcode {authMode === 'signin' ? '(Optional for Demo)' : '(Required)'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setSecurityCode('ADMIN2026')}
                    style={{
                      background: 'rgba(6, 182, 212, 0.15)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      color: '#38bdf8',
                      fontSize: '0.7rem',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Autofill "ADMIN2026"
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <KeyRound 
                    size={17} 
                    color="var(--text-muted)" 
                    style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter clearance code (Default: ADMIN2026)"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                  />
                </div>
              </div>
            )}

            {/* Eco Pledge Checkbox for Student Registration */}
            {authMode === 'register' && isStudent && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 14px',
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '10px',
                marginBottom: '20px',
                cursor: 'pointer'
              }} onClick={() => setPledgeAccepted(!pledgeAccepted)}>
                <input
                  type="checkbox"
                  checked={pledgeAccepted}
                  onChange={(e) => setPledgeAccepted(e.target.checked)}
                  style={{ marginTop: '3px', cursor: 'pointer', accentColor: '#10b981' }}
                />
                <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                  <strong>Campus Circularity Pledge:</strong> I commit to correctly sorting recyclables, reporting facility issues, and promoting zero-waste campus habits.
                </div>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: isStudent
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                color: '#ffffff',
                fontFamily: 'var(--font-heading)',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: isLoading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: `0 6px 20px ${themeGlow}`,
                transition: 'all 0.25s ease'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 10px 25px ${themeGlow}`;
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 6px 20px ${themeGlow}`;
                }
              }}
            >
              {isLoading ? (
                <span>Authenticating with Campus Directory...</span>
              ) : (
                <>
                  <span>
                    {authMode === 'signin' 
                      ? (isStudent ? 'Sign In to Student Portal' : 'Access Admin Incident Terminal') 
                      : (isStudent ? 'Complete Registration & Claim 100 Pts' : 'Submit Admin Clearance Request')
                    }
                  </span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer Perks & Guarantees */}
          <div style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: themeColor }} />
              <span>Campus Single Sign-On Ready</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: themeColor }} />
              <span>256-Bit Incident Logging</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: themeColor }} />
              <span>Sustainable Campus Initiative</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal Helper */}
      {showForgotModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '16px'
        }}>
          <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <HelpCircle size={22} color={themeColor} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Campus Account Assistance</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              In this university simulation environment, demo accounts are pre-configured for your convenience:
            </p>
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.82rem',
              marginBottom: '20px'
            }}>
              <div><strong>Default Demo Password:</strong> <code style={{ color: '#34d399' }}>password123</code></div>
              <div style={{ marginTop: '6px' }}><strong>Admin Security Passkey:</strong> <code style={{ color: '#38bdf8' }}>ADMIN2026</code></div>
              <div style={{ marginTop: '6px' }}>Or simply tap any of the <strong>1-Click Demo Testing</strong> profile cards on the login screen!</div>
            </div>
            <button
              className="btn-primary"
              style={{ width: '100%', padding: '10px' }}
              onClick={() => setShowForgotModal(false)}
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
