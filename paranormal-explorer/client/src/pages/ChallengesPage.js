import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const difficultyOrder = { Easy: 0, Medium: 1, Hard: 2, Extreme: 3 };

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);
  const [toast, setToast] = useState(null);
  const { user, updateUser } = useAuth();

  useEffect(() => {
    axios.get('/api/challenges').then(r => {
      setChallenges(r.data.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]));
      setLoading(false);
    });
  }, []);

  const complete = async (challenge) => {
    setCompleting(challenge.id);
    try {
      const { data } = await axios.post(`/api/challenges/${challenge.id}/complete`);
      updateUser(data.user);
      setToast(`+${data.pointsEarned} pts! Challenge complete: ${challenge.title}`);
      setTimeout(() => setToast(null), 4000);
      setChallenges(cs => cs.map(c => c.id === challenge.id ? { ...c, completions: c.completions + 1 } : c));
    } catch (e) {
      alert(e.response?.data?.error || 'Error');
    } finally {
      setCompleting(null);
    }
  };

  const isCompleted = (id) => user?.completedChallenges?.includes(id);

  if (loading) return <div className="loading">Loading your trials...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Challenges</h2>
        <p>Prove your courage. Earn your rank. Document the unexplained.</p>
      </div>

      {user && (
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-value">{user.totalPoints?.toLocaleString()}</span>
            <span className="stat-label">Total Points</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{user.completedChallenges?.length || 0}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-card">
            <span className="stat-value" style={{ fontSize: 14, color: 'var(--gold-light)' }}>{user.rank}</span>
            <span className="stat-label">Current Rank</span>
          </div>
        </div>
      )}

      <div className="grid-3">
        {challenges.map(c => (
          <div key={c.id} className="card challenge-card" style={{ opacity: isCompleted(c.id) ? 0.75 : 1 }}>
            {isCompleted(c.id) && <div className="completed-stamp">✓ Complete</div>}
            <span className="challenge-badge-icon">{c.badge}</span>
            <h3>{c.title}</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
              <span className={`badge badge-${c.difficulty.toLowerCase()}`}>{c.difficulty}</span>
              <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-heading)', letterSpacing: 1 }}>{c.category}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 12 }}>{c.description}</p>
            <div className="challenge-requirements">
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'var(--font-heading)', color: 'var(--text-dim)', marginBottom: 6 }}>Required Evidence</div>
              <ul>
                {c.requirements.map(r => <li key={r}>{r}</li>)}
              </ul>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
              <div>
                <span className="challenge-points">{c.points}</span>
                <span style={{ fontSize: 11, color: 'var(--text-dim)', marginLeft: 4, fontFamily: 'var(--font-heading)' }}>pts</span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{c.completions} completions</span>
            </div>
            {user && !isCompleted(c.id) && (
              <button
                className="btn btn-gold"
                style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}
                onClick={() => complete(c)}
                disabled={completing === c.id}
              >
                {completing === c.id ? '...' : '⚡ Mark Complete'}
              </button>
            )}
            {!user && (
              <p style={{ fontSize: 12, color: 'var(--text-dim)', fontStyle: 'italic', marginTop: 12 }}>Sign in to track progress</p>
            )}
          </div>
        ))}
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 32, right: 32,
          background: 'var(--green-eerie)',
          border: '1px solid var(--green-bright)',
          color: 'var(--green-bright)',
          padding: '12px 24px',
          fontFamily: 'var(--font-heading)',
          fontSize: 13, letterSpacing: 1,
          zIndex: 2000, boxShadow: '0 4px 24px rgba(46,204,113,0.2)'
        }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
