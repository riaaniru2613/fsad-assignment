import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import MapPage from './pages/MapPage';
import StoriesPage from './pages/StoriesPage';
import ChallengesPage from './pages/ChallengesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import './index.css';

function AppShell() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('map');

  if (loading) return <div className="loading" style={{ paddingTop: '40vh' }}>Awakening...</div>;
  if (!user && page !== 'stories' && page !== 'map' && page !== 'leaderboard' && page !== 'challenges') {
    return <AuthPage />;
  }

  const handleNav = (p) => {
    if (!user && (p === 'profile')) {
      setPage('auth');
      return;
    }
    setPage(p);
  };

  if (page === 'auth') return <AuthPage />;

  const pages = { map: MapPage, stories: StoriesPage, challenges: ChallengesPage, leaderboard: LeaderboardPage, profile: ProfilePage };
  const PageComponent = pages[page] || MapPage;

  return (
    <div className="app-shell">
      <Navbar current={page} onNavigate={handleNav} />
      <main className="main-content">
        <PageComponent onNavigate={handleNav} />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
