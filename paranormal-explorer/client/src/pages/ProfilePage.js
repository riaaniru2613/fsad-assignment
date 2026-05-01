import { useAuth } from '../context/AuthContext';

const RANKS = [
  { name: 'Novice Wanderer', min: 0, max: 99 },
  { name: 'Curious Soul', min: 100, max: 499 },
  { name: 'Ghost Tracker', min: 500, max: 999 },
  { name: 'Shadow Seeker', min: 1000, max: 2499 },
  { name: 'Specter Hunter', min: 2500, max: 4999 },
  { name: 'Phantom Sovereign', min: 5000, max: Infinity },
];

export default function ProfilePage({ onNavigate }) {
  const { user, logout } = useAuth();

  if (!user) return (
    <div className="card text-center" style={{ padding: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
      <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', marginBottom: 24 }}>Sign in to view your explorer profile.</p>
      <button className="btn btn-primary" onClick={() => onNavigate('auth')}>🔮 Sign In</button>
    </div>
  );

  const currentRank = RANKS.find(r => user.totalPoints >= r.min && user.totalPoints <= r.max);
  const nextRank = RANKS.find(r => r.min > user.totalPoints);
  const progress = nextRank
    ? ((user.totalPoints - currentRank.min) / (nextRank.min - currentRank.min)) * 100
    : 100;

  return (
    <div>
      <div className="page-header">
        <h2>Explorer Profile</h2>
        <p>Your record in the field.</p>
      </div>

      {/* Profile hero */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <img src={user.avatar} alt="" width={80} height={80}
            style={{ borderRadius: '50%', border: '2px solid var(--red)', padding: 2 }} />
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, marginBottom: 4 }}>{user.username}</h3>
            <p style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-heading)', fontSize: 14, letterSpacing: 1, marginBottom: 4 }}>{user.rank}</p>
            <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>Member since {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
          <button className="btn btn-ghost" onClick={logout}>Sign Out</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{user.totalPoints?.toLocaleString()}</span>
          <span className="stat-label">Total Points</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{user.completedChallenges?.length || 0}</span>
          <span className="stat-label">Challenges Done</span>
        </div>
        <div className="stat-card">
          <span className="stat-value" style={{ fontSize: 20, color: 'var(--gold-light)' }}>{currentRank?.name}</span>
          <span className="stat-label">Current Rank</span>
        </div>
      </div>

      {/* Rank progression */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20, color: 'var(--text-secondary)' }}>
          Rank Progression
        </h3>
        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
          <span style={{ color: 'var(--gold-light)' }}>{currentRank?.name}</span>
          {nextRank && <span style={{ color: 'var(--text-dim)' }}>Next: {nextRank.name} ({nextRank.min} pts)</span>}
          {!nextRank && <span style={{ color: 'var(--red-glow)' }}>Maximum Rank Achieved</span>}
        </div>
        <div style={{ background: 'var(--bg-deep)', height: 8, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.min(100, progress)}%`,
            background: 'linear-gradient(90deg, var(--red), var(--red-bright))',
            borderRadius: 4,
            transition: 'width 0.5s ease',
            boxShadow: '0 0 10px rgba(192,57,43,0.4)'
          }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-dim)', textAlign: 'right' }}>
          {user.totalPoints} pts
        </div>
      </div>

      {/* All ranks */}
      <div className="card">
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20, color: 'var(--text-secondary)' }}>
          Rank Tiers
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {RANKS.map(r => (
            <div key={r.name} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 16px',
              background: user.rank === r.name ? 'rgba(139,0,0,0.1)' : 'var(--bg-deep)',
              border: `1px solid ${user.rank === r.name ? 'var(--red)' : 'var(--border)'}`,
              borderRadius: 2
            }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14, color: user.rank === r.name ? 'var(--gold-light)' : 'var(--text-secondary)' }}>
                {user.rank === r.name && '▶ '}{r.name}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-dim)', fontFamily: 'var(--font-heading)' }}>
                {r.max === Infinity ? `${r.min}+` : `${r.min}–${r.max}`} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
