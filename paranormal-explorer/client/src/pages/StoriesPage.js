import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Ghost', 'UFO', 'Cryptid', 'Asylum', 'Other'];

export default function StoriesPage() {
  const [stories, setStories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', location: '', category: 'Ghost', excerpt: '', content: '', tags: '' });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    axios.get('/api/stories').then(r => { setStories(r.data); setLoading(false); });
  }, []);

  const filtered = filter === 'All' ? stories : stories.filter(s => s.category === filter);

  const submit = async () => {
    try {
      const { data } = await axios.post('/api/stories', { ...form, tags: form.tags.split(',').map(t => t.trim()) });
      setStories(s => [data, ...s]);
      setShowForm(false);
      setForm({ title: '', location: '', category: 'Ghost', excerpt: '', content: '', tags: '' });
    } catch (e) {
      alert(e.response?.data?.error || 'Error submitting story');
    }
  };

  if (loading) return <div className="loading">Summoning tales from the beyond...</div>;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2>Field Stories</h2>
          <p>Testimonies from those who dared to look beyond the veil.</p>
        </div>
        {user && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>📝 Submit Story</button>
        )}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`btn ${filter === c ? 'btn-primary' : 'btn-ghost'}`}
            style={{ padding: '6px 16px', fontSize: 11 }}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid-2">
        {filtered.map(story => (
          <div key={story.id} className="card story-card" onClick={() => setSelected(story)}>
            <div className="story-category">{story.category} · {story.location}</div>
            <h3>{story.title}</h3>
            <p className="story-excerpt">"{story.excerpt}"</p>
            <div className="story-meta">
              <span>🖊 {story.author}</span>
              <span>👁 {story.reads.toLocaleString()} reads</span>
              <span>⭐ {story.rating > 0 ? story.rating.toFixed(1) : 'New'}</span>
              {story.verified && <span className="verified-badge">✓ Verified</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Story Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            <div className="story-category" style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-heading)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
              {selected.category} · {selected.location}
            </div>
            <h2>{selected.title}</h2>
            <div className="story-meta" style={{ marginTop: 8 }}>
              <span>🖊 {selected.author}</span>
              <span>{selected.date}</span>
              {selected.verified && <span className="verified-badge">✓ Verified</span>}
            </div>
            <p className="story-full-content">{selected.content}</p>
            {selected.tags?.length > 0 && (
              <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {selected.tags.map(t => (
                  <span key={t} style={{ padding: '2px 8px', background: 'var(--bg-deep)', border: '1px solid var(--border)', fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-heading)' }}>
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: 24 }}>Submit Your Encounter</h2>
            <div className="form-group">
              <label>Title</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Name your experience" />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Location</label>
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="City, State/Country" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {['Ghost', 'UFO', 'Cryptid', 'Asylum', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Hook (1-2 sentences)</label>
              <input value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="The line that makes readers stop scrolling" />
            </div>
            <div className="form-group">
              <label>Full Account</label>
              <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Tell the full story. Be specific. Details matter." style={{ minHeight: 160 }} />
            </div>
            <div className="form-group">
              <label>Tags (comma separated)</label>
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="ghost, abandoned, voices" />
            </div>
            <button className="btn btn-primary" onClick={submit}>📜 Submit Account</button>
          </div>
        </div>
      )}
    </div>
  );
}
