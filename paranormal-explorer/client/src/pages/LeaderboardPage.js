import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const RANK_MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function LeaderboardPage() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    axios.get('/api/leaderboard').then(r => { setScores(r.data); setLoading(false); });
  }, []);

  if (loading) return <div className="loading">Consulting the spirits...</div>;

  const userRank = scores.findIndex(s => s.username === user?.username) + 1;

  return (
    <div>
      <div className="page-header">
        <h2>Leaderboard</h2>
        <p>The bravest souls in our order, ranked by deeds done in the dark.</p>
      </div>

      {user && userRank > 0 && (
        <div className="card" style={{ marginBottom: 24, background: 'rgba(139,0,0,0.08)', borderColor: 'var(--red-bright)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--red-bright)' }}>#{userRank}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, color: 'var(--text-primary)' }}>Your Ranking</div>
              <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>{user.rank} · {user.totalPoints?.toLocaleString()} points</div>
            </div>
          </div>
        </div>
      )}

      {scores.length === 0 ? (
        <div className="card text-center" style={{ padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👻</div>
          <p style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>No explorers on the board yet. Complete a challenge to be first.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Rank</th>
                <th>Explorer</th>
                <th>Title</th>
                <th>Challenges</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, i) => (
                <tr key={s.userId} className={`rank-${i + 1}`}
                  style={{ background: s.username === user?.username ? 'rgba(139,0,0,0.08)' : undefined }}>
                  <td>
                    <span className="rank-number">
                      {RANK_MEDALS[i + 1] || `#${i + 1}`}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={s.avatar} alt="" width={28} height={28} style={{ borderRadius: '50%', border: '1px solid var(--border)' }} />
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 14 }}>
                        {s.username}
                        {s.username === user?.username && <span style={{ color: 'var(--red-bright)', fontSize: 10, marginLeft: 6 }}>YOU</span>}
                      </span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{s.rank}</td>
                  <td style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-heading)' }}>{s.completed}</td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--gold-light)' }}>
                      {s.points.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
