'use client';

export default function StatsOverview({ totalMembers = 7, submittedCount = 5, blockerCount = 1 }) {
  const completionRate = Math.round((submittedCount / totalMembers) * 100);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '1.4rem' }}>
          📈
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submission Rate</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff' }}>{completionRate}% <span style={{ fontSize: '0.85rem', fontWeight: '400', color: 'var(--text-muted)' }}>({submittedCount}/{totalMembers})</span></div>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: blockerCount > 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: blockerCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
          🚨
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Blockers</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: blockerCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
            {blockerCount} {blockerCount === 1 ? 'Issue' : 'Issues'}
          </div>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
          🔥
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Team Streak</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff' }}>14 Days <span style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)' }}>⚡ Active</span></div>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
          ⏱️
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Standup Time</div>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff' }}>45s <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ update</span></div>
        </div>
      </div>
    </div>
  );
}
