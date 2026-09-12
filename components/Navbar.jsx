'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar({ currentRole = 'member', onRoleChange }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/', icon: '📊' },
    { label: 'Standup Archive', href: '/history', icon: '📁' },
    { label: 'Team Directory', href: '/team', icon: '👥' },
    { label: 'AI Digest & Email', href: '/digest', icon: '⚡' },
  ];

  return (
    <header className="navbar">
      <div className="nav-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' }}>
            ⚡ Standup.AI
          </span>
          <span className="nav-logo-badge">MVP</span>
        </div>
      </div>

      <nav className="nav-links">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-sm)',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Role:</span>
          <select
            value={currentRole}
            onChange={(e) => onRoleChange && onRoleChange(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontWeight: '600',
              fontSize: '0.85rem',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="member" style={{ background: '#12161f' }}>🧑‍💻 Team Member</option>
            <option value="manager" style={{ background: '#12161f' }}>👑 Tech Lead / Manager</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '999px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }}></span>
          <span>Alpha Team</span>
        </div>
      </div>
    </header>
  );
}
