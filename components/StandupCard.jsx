'use client';

import { useState } from 'react';

export default function StandupCard({ standup }) {
  const {
    user_name = 'Engineering Member',
    user_role = 'Developer',
    avatar,
    media_url,
    transcript,
    summary = {},
    created_at = new Date().toISOString(),
    likes: initialLikes = 0,
    comments: initialComments = []
  } = standup;

  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const hasBlocker = summary.blockers && summary.blockers !== 'None reported.' && summary.blockers !== 'None';

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1);
      setHasLiked(true);
    } else {
      setLikes(likes - 1);
      setHasLiked(false);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments([
      ...comments,
      {
        id: Date.now(),
        author: 'Current User',
        text: newComment,
        time: 'Just now'
      }
    ]);
    setNewComment('');
  };

  const formattedDate = new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="card" style={{ marginBottom: '1.25rem' }}>
      {/* Header Info */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img
            src={avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user_name)}`}
            alt={user_name}
            style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#1e2638', border: '1px solid var(--border-color)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: '700', fontSize: '1rem', color: '#fff' }}>{user_name}</span>
              <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', color: 'var(--text-muted)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                {user_role}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>
              Submitted today at {formattedDate}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <span className={hasBlocker ? "badge" : "badge badge-submitted"} style={{
          background: hasBlocker ? 'rgba(244, 63, 94, 0.15)' : undefined,
          color: hasBlocker ? 'var(--accent-rose)' : undefined,
          borderColor: hasBlocker ? 'rgba(244, 63, 94, 0.3)' : undefined
        }}>
          {hasBlocker ? '🚨 Has Blocker' : '✓ On Track'}
        </span>
      </div>

      {/* Audio Playback if media URL is present */}
      {media_url && (
        <div style={{ marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span>🔊 Voice Note</span>
          </div>
          <audio controls src={media_url} style={{ width: '100%', height: '36px' }} />
        </div>
      )}

      {/* Structured AI Breakdown */}
      <div style={{ display: 'grid', gap: '0.65rem' }}>
        {summary.status && (
          <div className="summary-box">
            <div className="summary-label">✅ Completed</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{summary.status}</p>
          </div>
        )}

        {summary.blockers && (
          <div className={`summary-box ${hasBlocker ? 'blocker' : ''}`}>
            <div className="summary-label" style={{ color: hasBlocker ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
              {hasBlocker ? '🚨 Blocker' : '🛡️ Blockers'}
            </div>
            <p style={{ fontSize: '0.9rem', color: hasBlocker ? '#fda4af' : 'var(--text-muted)' }}>
              {summary.blockers}
            </p>
          </div>
        )}

        {summary.next_steps && (
          <div className="summary-box next">
            <div className="summary-label" style={{ color: 'var(--accent-cyan)' }}>🚀 Next Steps</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{summary.next_steps}</p>
          </div>
        )}

        {summary.decisions && summary.decisions !== 'No major architectural decisions reported today.' && (
          <div className="summary-box" style={{ borderLeftColor: 'var(--accent-amber)' }}>
            <div className="summary-label" style={{ color: 'var(--accent-amber)' }}>💡 Key Decisions</div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{summary.decisions}</p>
          </div>
        )}
      </div>

      {/* Full Transcript Expandable */}
      {transcript && (
        <details style={{ marginTop: '0.75rem', cursor: 'pointer' }}>
          <summary style={{ fontSize: '0.8rem', color: 'var(--text-muted)', userSelect: 'none' }}>
            📄 View Full Audio Transcript
          </summary>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)' }}>
            "{transcript}"
          </p>
        </details>
      )}

      {/* Footer Reactions & Comment toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleLike}
            style={{
              background: hasLiked ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              border: hasLiked ? '1px solid var(--primary)' : 'none',
              color: hasLiked ? 'var(--primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.6rem',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <span>👏</span>
            <span>{likes}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>💬</span>
            <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
          </button>
        </div>

        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          Async Verified
        </span>
      </div>

      {/* Comments Drawer */}
      {showComments && (
        <div style={{ marginTop: '1rem', background: 'rgba(10, 12, 16, 0.5)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          {comments.length > 0 ? (
            <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '0.75rem' }}>
              {comments.map((c) => (
                <div key={c.id} style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    <span style={{ fontWeight: '600', color: 'var(--primary)' }}>{c.author}</span>
                    <span>{c.time}</span>
                  </div>
                  <p style={{ marginTop: '0.2rem', color: '#fff' }}>{c.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '0.5rem' }}>No comments yet. Leave a note or offer help!</p>
          )}

          <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              className="input-field"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment or reply..."
              style={{ fontSize: '0.85rem', padding: '0.4rem 0.6rem' }}
            />
            <button type="submit" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
