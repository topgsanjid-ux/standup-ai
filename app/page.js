'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatsOverview from '../components/StatsOverview';
import TeamDigestBanner from '../components/TeamDigestBanner';
import StandupRecorder from '../components/StandupRecorder';
import StandupCard from '../components/StandupCard';

export default function Dashboard() {
  const [role, setRole] = useState('member'); // 'member' or 'manager'
  const [standups, setStandups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBlockersOnly, setFilterBlockersOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStandups();
  }, []);

  const fetchStandups = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/standups');
      const data = await res.json();
      if (data.success) {
        setStandups(data.standups);
      }
    } catch (err) {
      console.error('Failed to load standups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStandupCreated = (newStandup) => {
    setStandups((prev) => [newStandup, ...prev]);
  };

  // Filtering
  const filteredStandups = standups.filter((item) => {
    const matchesSearch =
      item.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user_role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.summary?.status && item.summary.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.summary?.blockers && item.summary.blockers.toLowerCase().includes(searchQuery.toLowerCase()));

    const isBlocker = item.summary?.blockers && item.summary.blockers !== 'None reported.' && item.summary.blockers !== 'None';
    const matchesBlockerFilter = filterBlockersOnly ? isBlocker : true;

    return matchesSearch && matchesBlockerFilter;
  });

  const activeBlockersCount = standups.filter(
    (s) => s.summary?.blockers && s.summary.blockers !== 'None reported.' && s.summary.blockers !== 'None'
  ).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentRole={role} onRoleChange={setRole} />

      <main className="main-container">
        {/* Top Hero Banner */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', background: 'linear-gradient(135deg, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Daily Standup Hub
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Engineering Alpha Team • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setFilterBlockersOnly(!filterBlockersOnly)}
              className={`btn ${filterBlockersOnly ? 'btn-danger' : 'btn-secondary'}`}
              style={{ fontSize: '0.85rem' }}
            >
              🚨 {filterBlockersOnly ? 'Showing Blockers Only' : 'Filter Blockers'}
            </button>
          </div>
        </div>

        {/* Performance Metrics */}
        <StatsOverview
          totalMembers={7}
          submittedCount={standups.length}
          blockerCount={activeBlockersCount}
        />

        {/* AI Synthesis Summary Banner */}
        <TeamDigestBanner standups={standups} isManagerMode={role === 'manager'} />

        {/* Standup Recorder Widget */}
        <StandupRecorder onStandupCreated={handleStandupCreated} />

        {/* Feed Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚡</span> Today's Team Feed ({filteredStandups.length})
          </h2>

          <div style={{ width: '100%', maxWidth: '280px' }}>
            <input
              type="text"
              className="input-field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search updates or tags..."
              style={{ fontSize: '0.85rem', padding: '0.45rem 0.8rem' }}
            />
          </div>
        </div>

        {/* Feed Items */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            ⚡ Loading team updates...
          </div>
        ) : filteredStandups.length > 0 ? (
          <div>
            {filteredStandups.map((item) => (
              <StandupCard key={item.id} standup={item} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🔍</span>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.25rem' }}>No standups match your current filter</h3>
            <p style={{ fontSize: '0.85rem' }}>Try clearing your search query or record your update above!</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: 'auto' }}>
        Standup AI Engine • Voice-First Daily Updates for Modern Remote Teams
      </footer>
    </div>
  );
}
