import React, { useState, useRef, useEffect } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Upload, 
  Send, 
  CheckCircle, 
  Clock, 
  Tag, 
  FileText, 
  User, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { createReport, fetchReports } from '../lib/api';
import confetti from 'canvas-confetti';

const CAMPUS_LOCATIONS = [
  'Central Library Grounds & Quad',
  'Student Union Cafeteria & Courtyard',
  'Engineering Building A & B Hallways',
  'Science & Biotech Research Complex',
  'Student Residential Hostels (North Campus)',
  'Sports Stadium & Athletic Track',
  'Administration Block & Main Plaza',
  'East Gate Bus Stop & Pathway'
];

const ISSUE_CATEGORIES = [
  'Overflowing Waste Bin',
  'Unsegregated Mixed Waste Dump',
  'Hazardous / E-Waste Abandonment',
  'Broken / Damaged Bin Facility',
  'Littered Event Area'
];

export default function ReportIssue({ onReportSubmitted, currentUser }) {
 const [reports, setReports] = useState([]);
const [imageFile, setImageFile] = useState(null);
const [isSubmitting, setIsSubmitting] = useState(false);

// Load reports from Supabase when the page opens
useEffect(() => {
  fetchReports().then(setReports);
}, []);
  const [submittedId, setSubmittedId] = useState(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(ISSUE_CATEGORIES[0]);
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [severity, setSeverity] = useState('Medium');
  const [description, setDescription] = useState('');
  const [reportedBy, setReportedBy] = useState(
    currentUser 
      ? `${currentUser.name} (${currentUser.role === 'admin' ? 'Staff ID: #' + currentUser.id : 'Student ID: #' + currentUser.id})`
      : 'Student ID: #8841'
  );
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(url);
    }
  };

  const handleQuickSamplePhoto = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611284446314-60a55ac7de9f?w=600&auto=format&fit=crop&q=80'
    ];
    const picked = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    setImagePreview(picked);
    setImageFile(null);
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please sign in to submit a report.');
      return;
    }
    if (!title || !description) {
      alert("Please provide a title and detailed description of the issue.");
      return;
    }

    setIsSubmitting(true);
    const result = await createReport({
      title,
      category,
      urgency: severity,
      location,
      description,
      file: imageFile,
    });
    setIsSubmitting(false);

    if (!result.success) {
      alert(`Could not submit report: ${result.message}`);
      return;
    }

    setSubmittedId(result.report.id);
    setReports(await fetchReports());

    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch (err) {}

    if (onReportSubmitted) {
      onReportSubmitted();
    }

    // Reset form
    setTitle('');
    setDescription('');
    setImagePreview(null);
    setImageFile(null);
  };  

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#fbbf24',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '12px'
        }}>
          <AlertTriangle size={16} />
          <span>Campus Sanitation Reporting System</span>
        </div>
        <h1 style={{
          fontSize: '2.3rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #ffffff 0%, #fde68a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px'
        }}>
          Report Campus Waste Mismanagement
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
          Encountered overflowing bins or unsegregated waste? Submit a quick photo report to notify campus authorities for fast cleanup.
        </p>
      </div>

      {submittedId && (
        <div className="glass-card" style={{
          padding: '20px 24px',
          marginBottom: '28px',
          borderLeft: '6px solid #10b981',
          background: 'rgba(16, 185, 129, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <CheckCircle size={32} color="#34d399" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#34d399' }}>
                Report Successfully Dispatched! (Tracking ID: {submittedId})
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '2px' }}>
                Campus Facilities team notified. You earned <strong style={{ color: '#34d399' }}>+50 Eco-Points</strong> for keeping campus clean!
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        
        {/* LEFT FORM: Submit Report */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#f59e0b" />
            <span>New Incident Report Form</span>
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Issue Headline / Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Overflowing plastic bin outside Library"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Category & Severity Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {ISSUE_CATEGORIES.map((cat, i) => (
                    <option key={i} value={cat} style={{ background: '#121c18' }}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Urgency Level</label>
                <select
                  className="form-select"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <option value="Low" style={{ background: '#121c18' }}>Low Priority</option>
                  <option value="Medium" style={{ background: '#121c18' }}>Medium Priority</option>
                  <option value="High" style={{ background: '#121c18' }}>High Priority</option>
                  <option value="Urgent" style={{ background: '#121c18' }}>Urgent Cleanup</option>
                </select>
              </div>
            </div>

            {/* Location Selector */}
            <div className="form-group">
              <label className="form-label">Campus Location</label>
              <div style={{ position: 'relative' }}>
                <select
                  className="form-select"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                >
                  {CAMPUS_LOCATIONS.map((loc, i) => (
                    <option key={i} value={loc} style={{ background: '#121c18' }}>{loc}</option>
                  ))}
                </select>
                <MapPin size={18} color="#f59e0b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            {/* Detailed Description */}
            <div className="form-group">
              <label className="form-label">Detailed Description</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Describe the condition, exact spot, or any safety hazards..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Photo Attachment */}
            <div className="form-group">
              <label className="form-label">Attach Photo Evidence</label>
              <div style={{
                height: '140px',
                borderRadius: '14px',
                border: '2px dashed var(--border-subtle)',
                background: 'rgba(10, 18, 14, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', padding: '12px' }}>
                    <Upload size={24} color="var(--text-muted)" style={{ marginBottom: '4px' }} />
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Click upload or pick sample photo</div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                >
                  <Upload size={14} />
                  <span>Choose File</span>
                </button>

                <button
                  type="button"
                  onClick={handleQuickSamplePhoto}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                >
                  <Sparkles size={14} color="#f59e0b" />
                  <span>Sample Photo</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ width: '100%', marginTop: '10px', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)' }}
            >
              <Send size={18} />
              <span>Submit Report to Campus Mgmt</span>
            </button>
          </form>
        </div>

        {/* RIGHT LIST: Live Campus Reports Feed */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="#34d399" />
              <span>Live Campus Incident Tracker</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {reports.length} Total Reports
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '720px', overflowY: 'auto', paddingRight: '4px' }}>
            {reports.map((rpt) => (
              <div key={rpt.id} className="glass-card" style={{ padding: '18px', position: 'relative' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <img
                    src={rpt.imageUrl}
                    alt={rpt.title}
                    style={{ width: '84px', height: '84px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                        {rpt.id}
                      </span>
                      <span style={{
                        padding: '2px 10px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: rpt.status === 'Resolved' ? 'rgba(16, 185, 129, 0.15)' : rpt.status === 'In Progress' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: rpt.status === 'Resolved' ? '#34d399' : rpt.status === 'In Progress' ? '#60a5fa' : '#fbbf24',
                        border: `1px solid ${rpt.status === 'Resolved' ? 'rgba(16, 185, 129, 0.3)' : rpt.status === 'In Progress' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                      }}>
                        {rpt.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>
                      {rpt.title}
                    </h4>

                    <div style={{ fontSize: '0.8rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                      <MapPin size={13} />
                      <span>{rpt.location}</span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {rpt.description}
                    </p>

                    {rpt.adminNotes && (
                      <div style={{
                        marginTop: '8px',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        fontSize: '0.78rem',
                        color: '#a7f3d0',
                        borderLeft: '3px solid #10b981'
                      }}>
                        <strong>Staff Update:</strong> {rpt.adminNotes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
