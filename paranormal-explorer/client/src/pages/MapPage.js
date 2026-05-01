import { useState, useEffect } from 'react';
import axios from 'axios';

const DANGER_LABELS = { 1: 'Mild', 2: 'Moderate', 3: 'Active', 4: 'Intense', 5: 'Extreme' };
const TYPE_ICONS = { Prison: '⛓️', Mansion: '🏚️', Battlefield: '⚔️', Asylum: '🏥', Hotel: '🏨', Sanatorium: '🫁', Cemetery: '⚰️', Island: '🏝️' };

// Simple world map projection (lat/lng to %)
function project(lat, lng) {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
}

export default function MapPage() {
  const [locations, setLocations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/locations').then(r => { setLocations(r.data); setLoading(false); });
  }, []);

  const types = ['All', ...new Set(locations.map(l => l.type))];
  const filtered = filter === 'All' ? locations : locations.filter(l => l.type === filter);

  if (loading) return <div className="loading">Charting cursed ground...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Haunted Map</h2>
        <p>Documented paranormal sites across the globe. Approach with caution.</p>
      </div>

      {/* Type filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`btn ${filter === t ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '5px 14px', fontSize: 11 }}>
            {t !== 'All' && (TYPE_ICONS[t] || '👻')} {t}
          </button>
        ))}
      </div>

      {/* World map SVG */}
      <div className="map-container" style={{ position: 'relative', background: '#080810', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden', marginBottom: 24, height: 420 }}>
        {/* World map background using a simple CSS grid effect */}
        <svg viewBox="0 0 100 50" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
          {/* Grid lines */}
          {[...Array(19)].map((_, i) => (
            <line key={`v${i}`} x1={i * 100 / 18} y1="0" x2={i * 100 / 18} y2="50"
              stroke="rgba(139,0,0,0.08)" strokeWidth="0.2" />
          ))}
          {[...Array(10)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 50 / 9} x2="100" y2={i * 50 / 9}
              stroke="rgba(139,0,0,0.08)" strokeWidth="0.2" />
          ))}

          {/* Approximate world land mass shapes */}
          {/* North America */}
          <path d="M 10 8 L 24 8 L 26 12 L 28 18 L 22 22 L 16 24 L 12 20 L 8 14 Z" fill="rgba(30,30,50,0.8)" stroke="rgba(139,0,0,0.2)" strokeWidth="0.3" />
          {/* South America */}
          <path d="M 18 24 L 24 24 L 24 38 L 18 40 L 14 34 L 16 28 Z" fill="rgba(30,30,50,0.8)" stroke="rgba(139,0,0,0.2)" strokeWidth="0.3" />
          {/* Europe */}
          <path d="M 44 8 L 54 8 L 54 16 L 48 18 L 44 14 Z" fill="rgba(30,30,50,0.8)" stroke="rgba(139,0,0,0.2)" strokeWidth="0.3" />
          {/* Africa */}
          <path d="M 46 16 L 56 16 L 58 28 L 54 36 L 48 36 L 44 28 L 44 20 Z" fill="rgba(30,30,50,0.8)" stroke="rgba(139,0,0,0.2)" strokeWidth="0.3" />
          {/* Asia */}
          <path d="M 54 6 L 82 6 L 84 16 L 78 20 L 70 22 L 58 20 L 54 14 Z" fill="rgba(30,30,50,0.8)" stroke="rgba(139,0,0,0.2)" strokeWidth="0.3" />
          {/* Australia */}
          <path d="M 74 28 L 84 28 L 84 36 L 78 38 L 72 36 L 72 32 Z" fill="rgba(30,30,50,0.8)" stroke="rgba(139,0,0,0.2)" strokeWidth="0.3" />

          {/* Location dots */}
          {filtered.map(loc => {
            const { x, y } = project(loc.lat, loc.lng);
            const isSelected = selected?.id === loc.id;
            return (
              <g key={loc.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(loc === selected ? null : loc)}>
                {/* Pulse ring */}
                <circle cx={x} cy={y} r={isSelected ? 1.4 : 0.8}
                  fill="none" stroke={isSelected ? '#e74c3c' : '#8b0000'}
                  strokeWidth="0.15" opacity={isSelected ? 1 : 0.6}
                  style={{ animation: 'pulse-map 2s infinite' }} />
                {/* Core dot */}
                <circle cx={x} cy={y} r={0.5}
                  fill={isSelected ? '#e74c3c' : `rgba(139,0,0,${0.4 + loc.dangerLevel * 0.12})`}
                  stroke={isSelected ? '#fff' : '#c0392b'} strokeWidth="0.15" />
              </g>
            );
          })}
        </svg>

        {/* Info panel */}
        {selected && (
          <div className="map-info-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 22 }}>{TYPE_ICONS[selected.type] || '👻'}</span>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: 14 }}>✕</button>
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 14, marginTop: 8, marginBottom: 4 }}>{selected.name}</h3>
            <p style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 8 }}>{selected.city}</p>
            <div className="danger-dots" style={{ marginBottom: 8 }}>
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`danger-dot ${i < selected.dangerLevel ? '' : 'inactive'}`} />
              ))}
              <span style={{ fontSize: 11, color: 'var(--red-glow)', marginLeft: 6, fontFamily: 'var(--font-heading)' }}>
                {DANGER_LABELS[selected.dangerLevel]}
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{selected.description}</p>
            <p style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 8, fontFamily: 'var(--font-heading)', letterSpacing: 1 }}>
              📋 {selected.reports} reports · {selected.type}
            </p>
          </div>
        )}

        <div style={{ position: 'absolute', top: 12, left: 16, fontFamily: 'var(--font-heading)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-dim)' }}>
          Interactive Paranormal Map
        </div>
      </div>

      {/* Location cards grid */}
      <div className="grid-4">
        {filtered.map(loc => (
          <div key={loc.id} className="card" style={{ cursor: 'pointer', borderColor: selected?.id === loc.id ? 'var(--red-bright)' : undefined }}
            onClick={() => setSelected(loc === selected ? null : loc)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20 }}>{TYPE_ICONS[loc.type] || '👻'}</span>
              <div className="danger-dots" style={{ marginTop: 4 }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`danger-dot ${i < loc.dangerLevel ? '' : 'inactive'}`} style={{ width: 7, height: 7 }} />
                ))}
              </div>
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 13, marginTop: 8, marginBottom: 4, lineHeight: 1.3 }}>{loc.name}</h3>
            <p style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 6 }}>{loc.city}</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{loc.description}</p>
            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-heading)', letterSpacing: 0.5 }}>
              {loc.reports} field reports
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
