'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';

export default function TeamPage() {
  const [role, setRole] = useState('manager');
  const [members, setMembers] = useState([
    { id: 1, name: 'Sarah Chen', role: 'Staff Backend Engineer', timezone: 'America/New_York (UTC-4)', status: 'submitted', streak: 18, email: 'sarah.chen@engineering.io' },
    { id: 2, name: 'Marcus Vance', role: 'Tech Lead', timezone: 'America/Los_Angeles (UTC-7)', status: 'submitted', streak: 24, email: 'marcus.vance@engineering.io' },
    { id: 3, name: 'Priya Patel', role: 'DevOps Lead', timezone: 'Europe/London (UTC+1)', status: 'submitted', streak: 12, email: 'priya.patel@engineering.io' },
    { id: 4, name: 'David Kim', role: 'Security Engineer', timezone: 'Asia/Seoul (UTC+9)', status: 'submitted', streak: 9, email: 'david.kim@engineering.io' },
    { id: 5, name: 'Elena Rostova', role: 'Data Engineer', timezone: 'Europe/Berlin (UTC+2)', status: 'submitted', streak: 15, email: 'elena.rostova@engineering.io' },
    { id: 6, name: 'Alex Rivera', role: 'Frontend Engineer', timezone: 'America/Chicago (UTC-5)', status: 'pending', streak: 7, email: 'alex.rivera@engineering.io' },
    { id: 7, name: 'Jordan Taylor', role: 'QA Automation Lead', timezone: 'America/Denver (UTC-6)', status: 'pending', streak: 4, email: 'jordan.taylor@engineering.io' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTimezone, setNewTimezone] = useState('America/New_York');

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    setMembers([
      ...members,
      {
        id: Date.now(),
        name: newName,
        role: newRole || 'Software Engineer',
        timezone: newTimezone,
        status: 'pending',
        streak: 0,
        email: newEmail
      }
    ]);

    setNewName('');
    setNewRole('');
    setNewEmail('');
    setShowAddForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentRole={role} onRoleChange={setRole} />

      <main className="main-container">
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
              👥 Team Roster & Settings
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Manage Engineering Alpha team members, timezones, and daily standup dispatch triggers.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            {showAddForm ? 'Close Form' : '➕ Invite Team Member'}
          </button>
        </div>

        {/* Add Member Drawer */}
        {showAddForm && (
          <div className="card" style={{ marginBottom: '2rem', border: '1px solid var(--border-active)' }}>
            <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '1rem' }}>Invite New Team Member</h3>
            <form onSubmit={handleAddMember} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Full Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Sam Smith"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="sam@company.com"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Role Title</label>
                <input
                  type="text"
                  className="input-field"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. Mobile Developer"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Timezone</label>
                <select
                  className="select-field"
                  value={newTimezone}
                  onChange={(e) => setNewTimezone(e.target.value)}
                >
                  <option value="America/New_York (UTC-4)">UTC-4 (Eastern)</option>
                  <option value="America/Los_Angeles (UTC-7)">UTC-7 (Pacific)</option>
                  <option value="Europe/London (UTC+1)">UTC+1 (London)</option>
                  <option value="Asia/Tokyo (UTC+9)">UTC+9 (Tokyo)</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
                  Send Invite & Add to Roster
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Member Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {members.map((m) => (
            <div key={m.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(m.name)}`}
                      alt={m.name}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#1e2638' }}
                    />
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff' }}>{m.name}</h3>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.role}</div>
                    </div>
                  </div>

                  <span className={m.status === 'submitted' ? "badge badge-submitted" : "badge badge-pending"}>
                    {m.status === 'submitted' ? '✓ Submitted' : '⏳ Pending'}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'grid', gap: '0.35rem', background: 'rgba(0,0,0,0.2)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Timezone:</span>
                    <strong style={{ color: '#fff' }}>{m.timezone}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Submission Streak:</span>
                    <strong style={{ color: 'var(--accent-cyan)' }}>🔥 {m.streak} Days</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Email:</span>
                    <span style={{ color: 'var(--text-dim)' }}>{m.email}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem' }}>
                  🔔 Send Nudge
                </button>
                <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem', padding: '0.35rem' }}>
                  ⚙️ Settings
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Reminder Settings Banner */}
        <div className="card" style={{ background: 'rgba(18, 22, 31, 0.9)' }}>
          <h3 style={{ fontSize: '1rem', color: '#fff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⏰</span> Daily Standup Reminder Automation
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Standup AI automatically pings team members on Slack / Discord and sends email reminders if updates are pending.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Daily Deadline:</span>
              <input type="time" className="input-field" defaultValue="10:00" style={{ width: '130px', fontSize: '0.85rem', padding: '0.3rem 0.6rem' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Slack Webhook:</span>
              <input type="text" className="input-field" defaultValue="https://hooks.slack.com/services/..." style={{ width: '220px', fontSize: '0.85rem', padding: '0.3rem 0.6rem' }} />
            </div>

            <button className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
              Save Automation Rules
            </button>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: 'auto' }}>
        Standup AI Engine • Voice-First Daily Updates for Modern Remote Teams
      </footer>
    </div>
  );
}
