import React, { useState, useEffect } from 'react';
import { fetchBadges } from '../lib/api';
import { 
  BookOpen, 
  Award, 
  Leaf, 
  Zap, 
  Droplet, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles,
  TreePine,
  Layers,
  ChevronRight
} from 'lucide-react';

const SEVEN_RS = [
  { title: '1. Rethink', desc: 'Consider the lifecycle of items before purchasing. Opt for durable, eco-certified products.', icon: RotateCcw, color: '#10b981' },
  { title: '2. Refuse', desc: 'Say no to unnecessary single-use plastics, flyers, and disposable cutlery on campus.', icon: ShieldAlert, color: '#ef4444' },
  { title: '3. Reduce', desc: 'Minimize waste by purchasing in bulk and bringing reusable water bottles and coffee mugs.', icon: Zap, color: '#f59e0b' },
  { title: '4. Reuse', desc: 'Repurpose bags, containers, and boxes for dorm storage or campus book exchanges.', icon: Layers, color: '#3b82f6' },
  { title: '5. Repurpose', desc: 'Upcycle old clothes, glass jars, and electronics into creative DIY dorm projects.', icon: Sparkles, color: '#8b5cf6' },
  { title: '6. Recycle', desc: 'Always separate clean paper, plastics, and metals into designated campus Blue Bins.', icon: Leaf, color: '#06b6d4' },
  { title: '7. Rot (Compost)', desc: 'Dispose of organic food waste and compostable packaging in Green Compost Bins.', icon: TreePine, color: '#34d399' }
];

const BADGES = [
  { id: 1, title: 'Campus Eco-Pioneer', level: 'Level 1', desc: 'Completed first AI waste scan & segregation', unlocked: true, icon: '🌱' },
  { id: 2, title: 'AI Classification Master', level: 'Level 2', desc: 'Accurately scanned 10+ items into proper bins', unlocked: true, icon: '🤖' },
  { id: 3, title: 'Sanitation Guardian', level: 'Level 2', desc: 'Reported campus waste mismanagement issue', unlocked: true, icon: '📢' },
  { id: 4, title: 'Circular Economy Champion', level: 'Level 3', desc: 'Saved 25+ kg of CO2 equivalent', unlocked: false, icon: '🏆' }
];

export default function EcoHub({ ecoPoints, scanCount }) {
  const [bottlesPerWeek, setBottlesPerWeek] = useState(5);
  const [paperSheetsPerWeek, setPaperSheetsPerWeek] = useState(20);
    const [unlockedNames, setUnlockedNames] = useState([]);

  // Load this user's unlocked badges (reloads whenever points change)
  useEffect(() => {
    fetchBadges().then((list) => setUnlockedNames(list.map((b) => b.name)));
  }, [ecoPoints]);

  const badges = BADGES.map((b) => ({ ...b, unlocked: unlockedNames.includes(b.title) }));

  // Impact Calculator Math
  const annualBottles = bottlesPerWeek * 52;
  const annualCo2Kg = Math.round(annualBottles * 0.15 + paperSheetsPerWeek * 52 * 0.02);
  const annualEnergyKwh = Math.round(annualBottles * 0.25);
  const annualTreesSaved = (paperSheetsPerWeek * 52 / 5000).toFixed(1);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
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
          <BookOpen size={16} />
          <span>Circular Economy & Student Hub</span>
        </div>
        <h1 style={{
          fontSize: '2.4rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #ffffff 0%, #a7f3d0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px'
        }}>
          Educate, Upcycle & Empower
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
          Discover how proper campus waste segregation powers the circular economy and calculate your personal eco impact.
        </p>
      </div>

      {/* Calculator & Badges Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '40px' }}>
        
        {/* Interactive Impact Calculator */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={20} color="#fbbf24" />
            <span>Campus Personal Impact Calculator</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>
                <span>Plastic Water Bottles Recycled / Week:</span>
                <span style={{ color: '#34d399', fontWeight: 800 }}>{bottlesPerWeek}</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={bottlesPerWeek}
                onChange={(e) => setBottlesPerWeek(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px' }}>
                <span>Paper Sheets Recycled / Week:</span>
                <span style={{ color: '#fbbf24', fontWeight: 800 }}>{paperSheetsPerWeek}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={paperSheetsPerWeek}
                onChange={(e) => setPaperSheetsPerWeek(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Results Summary Box */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>CO₂ Saved/Yr</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>{annualCo2Kg} kg</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Energy Saved</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>{annualEnergyKwh} kWh</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Trees Preserved</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#60a5fa', marginTop: '2px' }}>{annualTreesSaved}</div>
            </div>
          </div>
        </div>

        {/* Gamification Achievements & Badges */}
        <div className="glass-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} color="#34d399" />
              <span>Student Eco Badges</span>
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 700 }}>
              {ecoPoints} Total Points
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {badges.map((b) => (
              <div
                key={b.id}
                style={{
                  background: b.unlocked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                  border: b.unlocked ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '14px',
                  padding: '14px',
                  opacity: b.unlocked ? 1 : 0.5
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{b.icon}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{b.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 7 R's Grid Section */}
      <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '20px', textAlign: 'center' }}>
        The 7 R's of Sustainable Campus Living
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
        {SEVEN_RS.map((r, i) => {
          const IconComp = r.icon;
          return (
            <div key={i} className="glass-card" style={{ padding: '20px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: `rgba(${parseInt(r.color.slice(1,3),16)}, ${parseInt(r.color.slice(3,5),16)}, ${parseInt(r.color.slice(5,7),16)}, 0.15)`,
                border: `1px solid ${r.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <IconComp size={20} color={r.color} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: r.color, marginBottom: '6px' }}>
                {r.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                {r.desc}
              </p>
            </div>
          );
        })}
      </div>

    </div>
  );
}
