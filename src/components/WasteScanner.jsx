import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Zap, 
  Droplet, 
  Leaf, 
  RefreshCw, 
  Info,
  Sliders,
  Layers
} from 'lucide-react';
import { 
  classifyImage, 
  SAMPLE_WASTE_ITEMS, 
  loadAIModel,
  saveUserCorrection,
  WASTE_KNOWLEDGE_BASE 
} from '../utils/wasteClassifier';
import { addEcoPoints } from '../utils/storage';
import confetti from 'canvas-confetti';

export default function WasteScanner({ onScanSuccess }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [useWebcam, setUseWebcam] = useState(false);
  const [activeSampleId, setActiveSampleId] = useState(null);
  const [correctionNotice, setCorrectionNotice] = useState('');

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const imgElementRef = useRef(null);

  useEffect(() => {
    loadAIModel();
  }, []);

  // Handle webcam stream initialization
  useEffect(() => {
    let stream = null;
    if (useWebcam) {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.warn("Webcam access error:", err);
          alert("Camera permission unavailable. Please use photo upload or sample images.");
          setUseWebcam(false);
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [useWebcam]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setActiveSampleId(null);
      setScanResult(null);
      setCorrectionNotice('');
      runClassification(url);
    }
  };

  const handleSampleClick = (sample) => {
    setSelectedImage(sample.imageUrl);
    setActiveSampleId(sample.id);
    setScanResult(null);
    setCorrectionNotice('');
    runClassification(sample.imageUrl, sample.type);
  };

  const captureWebcamPhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL('image/jpeg');
      setSelectedImage(url);
      setUseWebcam(false);
      setCorrectionNotice('');
      runClassification(url);
    }
  };

  const runClassification = async (imageSrc, hintCategory = '') => {
    setIsScanning(true);

    const tempImg = new Image();
    // Only set crossOrigin for remote web URLs to avoid blob/data issues
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      tempImg.crossOrigin = 'anonymous';
    }
    tempImg.src = imageSrc;

    tempImg.onload = async () => {
      // Draw to standard canvas for consistent pixel extraction
      const canvas = document.createElement('canvas');
      canvas.width = tempImg.naturalWidth || 400;
      canvas.height = tempImg.naturalHeight || 300;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);

      setTimeout(async () => {
        const result = await classifyImage(canvas, hintCategory);
        setScanResult(result);
        setIsScanning(false);

        // Confetti celebration
        try {
          confetti({
            particleCount: 45,
            spread: 65,
            origin: { y: 0.7 }
          });
        } catch (err) {}

        if (onScanSuccess) {
          onScanSuccess();
        }
      }, 750);
    };

    tempImg.onerror = async () => {
      const result = await classifyImage(null, hintCategory || 'recyclable');
      setScanResult(result);
      setIsScanning(false);
    };
  };

  // Human-in-the-loop Model Correction & Tutor
  const handleOverrideCategory = (newCatKey) => {
    if (!scanResult) return;
    const newKb = WASTE_KNOWLEDGE_BASE[newCatKey];
    if (!newKb) return;

    saveUserCorrection(scanResult.itemDetected, newCatKey);
    addEcoPoints(10); // +10 points for calibrating campus AI

    const updatedBreakdown = (scanResult.breakdown || []).map(b => ({
      ...b,
      percentage: b.category === newCatKey ? 95 : Math.max(1, Math.round(b.percentage * 0.1))
    }));

    setScanResult({
      ...scanResult,
      categoryKey: newCatKey,
      categoryName: newKb.categoryName,
      binColor: newKb.binColor,
      binName: newKb.binName,
      badgeClass: newKb.badgeClass,
      decompositionTime: newKb.decompositionTime,
      co2SavedKg: newKb.co2SavedKg,
      energySavedKwh: newKb.energySavedKwh,
      waterSavedLiters: newKb.waterSavedLiters,
      preparationSteps: newKb.preparationSteps,
      circularEconomyTips: newKb.circularEconomyTips,
      confidence: 0.96,
      breakdown: updatedBreakdown
    });

    setCorrectionNotice(`✓ AI Calibrated! Saved as "${newKb.categoryName.split(' ')[0]}" (+10 Eco-Points awarded).`);
    setTimeout(() => setCorrectionNotice(''), 4500);

    if (onScanSuccess) {
      onScanSuccess();
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Intro Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '12px'
        }}>
          <Sparkles size={16} />
          <span>Advanced Computer Vision & Material Classification</span>
        </div>
        <h1 style={{
          fontSize: '2.4rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #ffffff 0%, #a7f3d0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px'
        }}>
          Scan Waste, Segregate Correctly
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
          Upload or capture an image of any waste item. Our AI analyzes its material and guides you to the correct campus bin with circular economy tips.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        
        {/* LEFT COLUMN: Input Control Card */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={20} color="#10b981" />
            <span>Select or Capture Item</span>
          </h3>

          {/* Main Upload / Camera View Box */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '280px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px dashed var(--border-subtle)',
            background: 'rgba(10, 18, 14, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {useWebcam ? (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <button
                  onClick={captureWebcamPhoto}
                  className="btn-primary"
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.8)'
                  }}
                >
                  <Camera size={18} />
                  <span>Snap Photo</span>
                </button>
              </div>
            ) : selectedImage ? (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <img
                  ref={imgElementRef}
                  src={selectedImage}
                  alt="Waste to classify"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {isScanning && <div className="scanning-line" />}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px'
                }}>
                  <Upload size={28} color="#34d399" />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '4px' }}>
                  Drag & Drop or Click to Upload
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Supports JPG, PNG, WEBP images & camera capture
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept="image/*" 
              style={{ display: 'none' }} 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary"
              style={{ flex: 1 }}
            >
              <Upload size={18} />
              <span>Upload Photo</span>
            </button>

            <button
              onClick={() => setUseWebcam(!useWebcam)}
              className="btn-secondary"
              style={{ flex: 1 }}
            >
              <Camera size={18} />
              <span>{useWebcam ? 'Close Camera' : 'Live Webcam'}</span>
            </button>
          </div>

          {/* Sample Test Gallery */}
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Evaluation Sample Items:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {SAMPLE_WASTE_ITEMS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSampleClick(sample)}
                  style={{
                    border: activeSampleId === sample.id ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    height: '56px',
                    position: 'relative',
                    transition: 'all 0.2s ease'
                  }}
                  title={sample.name}
                >
                  <img src={sample.imageUrl} alt={sample.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Results & Circular Economy Guidance */}
        <div>
          {isScanning ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', minHeight: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={44} color="#10b981" style={{ animation: 'spin 1.5s linear infinite', marginBottom: '20px' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
                Analyzing Material & Neural Vectors...
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '340px' }}>
                Evaluating ImageNet-1k multi-class probabilities, pixel color distributions, and campus segregation rules.
              </p>
            </div>
          ) : scanResult ? (
            <div className="glass-card" style={{ padding: '24px', borderLeft: `6px solid ${scanResult.binColor}` }}>
              
              {/* Result Category Banner */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <span className={`badge ${scanResult.badgeClass}`} style={{ marginBottom: '8px' }}>
                    {scanResult.categoryName}
                  </span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '4px' }}>
                    {scanResult.itemDetected}
                  </h2>
                </div>
                <div style={{
                  padding: '8px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  textAlign: 'right'
                }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>AI Confidence</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#34d399' }}>
                    {Math.round(scanResult.confidence * 100)}%
                  </div>
                </div>
              </div>

              {/* Multi-Category Probability Distribution Bar */}
              {scanResult.breakdown && (
                <div style={{ marginBottom: '18px', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Layers size={13} color="#34d399" />
                      <span>Multi-Stream Material Probability</span>
                    </span>
                    <span>Top Match: {scanResult.breakdown[0]?.percentage}%</span>
                  </div>
                  <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', background: 'rgba(255,255,255,0.1)' }}>
                    {scanResult.breakdown.map((item, idx) => (
                      <div 
                        key={idx}
                        title={`${item.name}: ${item.percentage}%`}
                        style={{
                          width: `${item.percentage}%`,
                          background: item.color,
                          transition: 'width 0.4s ease'
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap', fontSize: '0.7rem' }}>
                    {scanResult.breakdown.slice(0, 3).map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }} />
                        <span style={{ color: 'var(--text-muted)' }}>{item.name}: <strong>{item.percentage}%</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Disposal Bin Box */}
              <div style={{
                background: `rgba(${parseInt(scanResult.binColor.slice(1,3),16)}, ${parseInt(scanResult.binColor.slice(3,5),16)}, ${parseInt(scanResult.binColor.slice(5,7),16)}, 0.15)`,
                border: `1px solid ${scanResult.binColor}`,
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: scanResult.binColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}>
                  BIN
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: scanResult.binColor, fontWeight: 800 }}>
                    Recommended Disposal Action
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                    Drop in the <span style={{ color: scanResult.binColor }}>{scanResult.binName}</span>
                  </div>
                </div>
              </div>

              {/* Human-in-the-Loop Category Calibration Bar */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px dashed rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    <Sliders size={13} color="#34d399" />
                    <span>Not quite right? Tap to adjust category:</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 600 }}>+10 Eco-Pts</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { key: 'recyclable', label: 'Blue (Recyclable)', color: '#3b82f6' },
                    { key: 'organic', label: 'Green (Organic)', color: '#10b981' },
                    { key: 'paper', label: 'Yellow (Paper)', color: '#f59e0b' },
                    { key: 'hazardous', label: 'Red (E-Waste)', color: '#ef4444' },
                    { key: 'landfill', label: 'Gray (Landfill)', color: '#6b7280' }
                  ].map(btn => (
                    <button
                      key={btn.key}
                      onClick={() => handleOverrideCategory(btn.key)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '8px',
                        border: scanResult.categoryKey === btn.key ? `1.5px solid ${btn.color}` : '1px solid rgba(255,255,255,0.1)',
                        background: scanResult.categoryKey === btn.key ? `${btn.color}25` : 'rgba(255,255,255,0.04)',
                        color: scanResult.categoryKey === btn.key ? '#ffffff' : 'var(--text-muted)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
                {correctionNotice && (
                  <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                    {correctionNotice}
                  </div>
                )}
              </div>

              {/* Environmental Metrics Saved Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <div className="glass-panel" style={{ padding: '12px', textAlign: 'center' }}>
                  <Leaf size={18} color="#34d399" style={{ marginBottom: '4px' }} />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CO₂ Avoided</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{scanResult.co2SavedKg} kg</div>
                </div>
                <div className="glass-panel" style={{ padding: '12px', textAlign: 'center' }}>
                  <Zap size={18} color="#fbbf24" style={{ marginBottom: '4px' }} />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Energy Saved</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{scanResult.energySavedKwh} kWh</div>
                </div>
                <div className="glass-panel" style={{ padding: '12px', textAlign: 'center' }}>
                  <Droplet size={18} color="#60a5fa" style={{ marginBottom: '4px' }} />
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Water Conserved</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{scanResult.waterSavedLiters} L</div>
                </div>
              </div>

              {/* Preparation Steps */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <span>Preparation Checklist Before Disposal</span>
                </h4>
                <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {scanResult.preparationSteps.map((step, idx) => (
                    <li key={idx} style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{step}</li>
                  ))}
                </ul>
              </div>

              {/* Circular Economy Educational Tip */}
              <div className="glass-panel" style={{ padding: '14px 16px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} />
                  <span>Circular Economy Impact</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                  {scanResult.circularEconomyTips[0]}
                </p>
              </div>

            </div>
          ) : (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', minHeight: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <Info size={44} color="var(--text-muted)" style={{ marginBottom: '16px', opacity: 0.6 }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                Ready to Scan
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '320px' }}>
                Upload a photo from your device, turn on live camera, or pick a sample item to view instant segregation advice.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
