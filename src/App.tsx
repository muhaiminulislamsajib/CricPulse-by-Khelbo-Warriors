/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LiveMatches from './pages/LiveMatches';
import MatchCenter from './pages/MatchCenter';
import TournamentDashboard from './pages/TournamentDashboard';
import Profile from './pages/Profile';

// Placeholder Pages (will be built out in next turns)
const Placeholder = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center h-[60vh] text-slate-500 font-mono italic">
    {name} page coming soon...
  </div>
);

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/live" element={<LiveMatches />} />
          <Route path="/match/:matchId" element={<MatchCenter />} />
          <Route path="/tournaments" element={<TournamentDashboard />} />
          <Route path="/teams" element={<Placeholder name="Teams" />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}

