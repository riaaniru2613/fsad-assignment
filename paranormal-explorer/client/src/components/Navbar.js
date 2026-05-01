import { useAuth } from '../context/AuthContext';

const links = [
  { icon: '🗺️', label: 'Haunted Map', page: 'map' },
  { icon: '📜', label: 'Field Stories', page: 'stories' },
  { icon: '⚔️', label: 'Challenges', page: 'challenges' },
  { icon: '🏆', label: 'Leaderboard', page: 'leaderboard' },
  { icon: '👤', label: 'My Profile', page: 'profile' },
];

export default function Navbar({ current, onNavigate }) {
  const { user, logout } = useAuth();
  return (
    <nav className="nav">
      <div className="nav-logo">
        <span className="skull">💀</span>
        <h1>Paranormal<br />Explorer</h1>
      </div>
      <div className="nav-links">
        {links.map(l => (
          <button
            key={l.page}
            className={`nav-link ${current === l.page ? 'active' : ''}`}
            onClick={() => onNavigate(l.page)}
          >
            <span className="icon">{l.icon}</span>
            <span>{l.label}</span>
          </button>
        ))}
      </div>
      <div className="nav-footer">
        {user && (
          <>
            <div style={{ marginBottom: 8, color: 'var(--text-secondary)', fontSize: 11, letterSpacing: 1 }}>
              {user.username}
            </div>
            <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={logout}>
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
