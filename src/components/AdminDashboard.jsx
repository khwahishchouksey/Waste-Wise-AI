import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Users, 
  Filter, 
  BarChart3, 
  Edit3,
  Search,
  Building,
  Sparkles
} from 'lucide-react';
import { getStoredReports, updateReportStatus } from '../utils/storage';

export default function AdminDashboard({ currentUser, onNavigateLogin }) {
  const [reports, setReports] = useState(getStoredReports());
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedReport, setSelectedReport] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [assignedTeam, setAssignedTeam] = useState('Zone Sanitation Crew A');

  const refreshReports = () => {
    setReports(getStoredReports());
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = updateReportStatus(id, newStatus, adminNotes);
    setReports(updated);
    setSelectedReport(null);
    setAdminNotes('');
  };

  // Stats calculation
  const total = reports.length;
  const pending = reports.filter(r => r.status === 'Pending').length;
  const inProgress = reports.filter(r => r.status === 'In Progress').length;
  const resolved = reports.filter(r => r.status === 'Resolved').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;

  const filteredReports = reports.filter(r => {
    if (filterStatus === 'All') return true;
    return r.status === filterStatus;
  });

  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Officer Clearance / Auth Status Bar */}
      <div style={{
        background: isAdmin ? 'rgba(6, 182, 212, 0.12)' : 'rgba(245, 158, 11, 0.1)',
        border: isAdmin ? '1px solid rgba(6, 182, 212, 0.35)' : '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '14px',
        padding: '12px 20px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAdmin ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #38bdf8'
              }}
            />
          ) : (
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={20} color="#fbbf24" />
            </div>
          )}
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
              {isAdmin 
                ? `Authorized Officer: ${currentUser.name}`
                : 'Campus Staff Terminal: Preview Mode'
              }
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {isAdmin 
                ? `${currentUser.roleTitle || 'Sanitation Lead'} • ID: #${currentUser.id} • ${currentUser.department}`
                : 'Currently active as Student / Guest. For verified dispatch rights and live crew triage, switch to Admin login.'
              }
            </div>
          </div>
        </div>

        {onNavigateLogin && (
          <button
            onClick={() => onNavigateLogin('admin')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: isAdmin ? 'rgba(6, 182, 212, 0.2)' : 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
              border: isAdmin ? '1px solid rgba(6, 182, 212, 0.4)' : 'none',
              color: '#ffffff',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShieldCheck size={14} />
            <span>{isAdmin ? 'Switch Admin User' : 'Log In with Admin Passkey'}</span>
          </button>
        )}
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(6, 182, 212, 0.12)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          color: '#38bdf8',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '12px'
        }}>
          <ShieldCheck size={16} />
          <span>Campus Management & Facilities Portal</span>
        </div>
        <h1 style={{
          fontSize: '2.3rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #ffffff 0%, #7dd3fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px'
        }}>
          Campus Waste & Incident Control Center
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
          Real-time incident dispatch board for campus sanitation teams, facility managers, and environmental officers.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '18px',
        marginBottom: '32px'
      }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Reports</span>
            <AlertTriangle size={20} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800 }}>{total}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Across all campus zones</div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase' }}>Pending Dispatch</span>
            <Clock size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#fbbf24' }}>{pending}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Requires immediate assignment</div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase' }}>Under Cleanup</span>
            <Users size={20} color="#3b82f6" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#60a5fa' }}>{inProgress}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>Sanitation team active</div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase' }}>Resolved</span>
            <CheckCircle2 size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#34d399' }}>{resolved}</div>
          <div style={{ fontSize: '0.78rem', color: '#34d399', marginTop: '4px', fontWeight: 700 }}>{resolutionRate}% Resolution Rate</div>
        </div>
      </div>

      {/* Main Board Layout */}
      <div className="glass-card" style={{ padding: '24px' }}>
        
        {/* Filter Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building size={20} color="#38bdf8" />
            <span>Incident Action Board</span>
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-muted)" />
            {['All', 'Pending', 'In Progress', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: 'none',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: filterStatus === st ? 'var(--primary)' : 'rgba(255, 255, 255, 0.06)',
                  color: filterStatus === st ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Table / List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredReports.map((rpt) => (
            <div
              key={rpt.id}
              style={{
                background: 'rgba(10, 18, 14, 0.7)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                alignItems: 'center'
              }}
            >
              {/* Photo & Core Info */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <img
                  src={rpt.imageUrl}
                  alt={rpt.title}
                  style={{ width: '96px', height: '96px', borderRadius: '14px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                      {rpt.id}
                    </span>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: rpt.severity === 'Urgent' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                      color: rpt.severity === 'Urgent' ? '#f87171' : '#fbbf24'
                    }}>
                      {rpt.severity}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>
                    {rpt.title}
                  </h4>

                  <div style={{ fontSize: '0.82rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} />
                    <span>{rpt.location}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Reported by: {rpt.reportedBy}
                  </div>
                </div>
              </div>

              {/* Status & Quick Actions */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '16px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Status:</span>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: rpt.status === 'Resolved' ? 'rgba(16, 185, 129, 0.15)' : rpt.status === 'In Progress' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: rpt.status === 'Resolved' ? '#34d399' : rpt.status === 'In Progress' ? '#60a5fa' : '#fbbf24'
                  }}>
                    {rpt.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleStatusChange(rpt.id, 'In Progress')}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '8px', fontSize: '0.78rem', background: rpt.status === 'In Progress' ? 'rgba(59,130,246,0.3)' : undefined }}
                  >
                    Set In Progress
                  </button>

                  <button
                    onClick={() => handleStatusChange(rpt.id, 'Resolved')}
                    className="btn-primary"
                    style={{ flex: 1, padding: '8px', fontSize: '0.78rem' }}
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
