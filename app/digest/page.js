'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

export default function DigestPage() {
  const [role, setRole] = useState('manager');
  const [standups, setStandups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recipientEmail, setRecipientEmail] = useState('engineering-leads@company.com');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [htmlPreview, setHtmlPreview] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/standups');
        const data = await res.json();
        if (data.success) {
          setStandups(data.standups);
          generatePreview(data.standups);
        }
      } catch (err) {
        console.error('Digest data load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const generatePreview = async (items) => {
    try {
      const res = await fetch('/api/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ standups: items, recipientEmail })
      });
      const data = await res.json();
      if (data.htmlPreview) {
        setHtmlPreview(data.htmlPreview);
      }
    } catch (err) {
      console.warn('Preview error:', err);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setSendResult(null);

    try {
      const res = await fetch('/api/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ standups, recipientEmail })
      });
      const data = await res.json();
      setSendResult({
        success: data.success,
        message: data.message || 'Email digest dispatched!'
      });
    } catch (err) {
      setSendResult({
        success: false,
        message: 'Failed to send digest: ' + err.message
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentRole={role} onRoleChange={setRole} />

      <main className="main-container">
        {/* Page Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff' }}>
            ⚡ AI Daily Digest Broadcast Center
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Automatically compile and dispatch daily executive standup summaries to management, product leads, or the entire team via Resend API.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Dispatch Controls */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📬</span> Email Distribution Settings
              </h3>

              <form onSubmit={handleSendEmail} style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                    Recipient Email Address / Mailing List
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="engineering-leads@company.com"
                    required
                  />
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    <strong>Digest Package Contents:</strong>
                  </div>
                  <ul style={{ fontSize: '0.8rem', color: 'var(--text-main)', paddingLeft: '1.2rem', display: 'grid', gap: '0.25rem' }}>
                    <li>Executive summary of today's completed tasks</li>
                    <li>Highlighted active blockers requiring escalation</li>
                    <li>Member status breakdown ({standups.length} recorded)</li>
                  </ul>
                </div>

                {sendResult && (
                  <div style={{
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    background: sendResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                    border: sendResult.success ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
                    color: sendResult.success ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                    fontSize: '0.85rem'
                  }}>
                    {sendResult.success ? '✓ ' : '⚠️ '} {sendResult.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSending || loading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
                >
                  {isSending ? 'Dispatching Digest Email...' : '🚀 Send Digest Email Now'}
                </button>
              </form>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              💡 <em>Tip: Configure <code>RESEND_API_KEY</code> and <code>DIGEST_EMAIL_FROM</code> in <code>.env.local</code> to enable real SMTP delivery.</em>
            </div>
          </div>

          {/* HTML Email Live Preview */}
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>👁️</span> Live Email Template Preview
            </h3>

            {loading ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
                Generating email template preview...
              </div>
            ) : (
              <div
                style={{
                  maxHeight: '480px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  background: '#0a0c10',
                  padding: '1rem'
                }}
                dangerouslySetInnerHTML={{ __html: htmlPreview || '<p style="color:#9ca3af;">Preview unavailable</p>' }}
              />
            )}
          </div>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem 0', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem', marginTop: 'auto' }}>
        Standup AI Engine • Voice-First Daily Updates for Modern Remote Teams
      </footer>
    </div>
  );
}
