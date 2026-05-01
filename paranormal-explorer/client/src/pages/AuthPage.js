import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const { data } = await axios.post(url, form);
      login(data.token, data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <div className="auth-title">
          <span className="glyph">{mode === 'login' ? '🔮' : '👁️'}</span>
          <h1>{mode === 'login' ? 'Enter the Darkness' : 'Join the Order'}</h1>
          <p>{mode === 'login' ? 'Welcome back, wanderer.' : 'Begin your paranormal journey.'}</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {mode === 'signup' && (
          <div className="form-group">
            <label>Explorer Name</label>
            <input name="username" placeholder="Your alias in the shadows" value={form.username} onChange={handle} />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handle} />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle}
            onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
          onClick={submit} disabled={loading}>
          {loading ? '...' : mode === 'login' ? '⚡ Enter' : '🌑 Create Account'}
        </button>

        <div className="auth-switch">
          {mode === 'login' ? (
            <>Not yet initiated? <span onClick={() => { setMode('signup'); setError(''); }}>Join the Order</span></>
          ) : (
            <>Already a member? <span onClick={() => { setMode('login'); setError(''); }}>Sign In</span></>
          )}
        </div>
      </div>
    </div>
  );
}
