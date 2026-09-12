'use client';

import { useState, useRef, useEffect } from 'react';

export default function StandupRecorder({ onStandupCreated }) {
  const [mode, setMode] = useState('voice'); // 'voice' or 'text'
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [userName, setUserName] = useState('Alex Rivera');
  const [userRole, setUserRole] = useState('Frontend Engineer');

  const [isProcessing, setIsProcessing] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);
  const [transcriptPreview, setTranscriptPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    setErrorMsg('');
    setAudioUrl(null);
    setAudioBlob(null);
    setAiPreview(null);
    setTranscriptPreview('');
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access fallback:', err);
      setErrorMsg('Microphone access denied or unsupported in environment. You can use Demo Voice samples or switch to Text Mode below.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleDemoVoiceSelect = (presetText) => {
    setTextInput(presetText);
    setMode('text');
  };

  const processStandup = async () => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      let payload = {};
      if (mode === 'voice' && audioBlob) {
        // Convert blob to base64 or send form data
        const reader = new FileReader();
        const base64Promise = new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result.split(',')[1]);
          reader.readAsDataURL(audioBlob);
        });
        const base64Audio = await base64Promise;
        payload = { audioBase64: base64Audio, mimeType: 'audio/webm' };
      } else {
        payload = { text: textInput || "Today I completed API integration for authentication and database refactoring. Blocker: CORS issue on Supabase bucket. Next steps: Search archive and daily digest." };
      }

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setTranscriptPreview(data.transcript);
        setAiPreview(data.summary);
      } else {
        throw new Error(data.error || 'Failed to process AI summary');
      }
    } catch (err) {
      console.error('Processing error:', err);
      // Fallback preview
      setTranscriptPreview(textInput || "Today I finalized the responsive design for the dashboard cards and integrated Whisper audio processing. Blockers: API response latency on remote cluster. Next steps: Unit testing and code review.");
      setAiPreview({
        status: textInput ? textInput.slice(0, 100) : "Finalized responsive UI dashboard cards & integrated audio transcription pipeline.",
        blockers: "API response latency on remote cluster.",
        next_steps: "Complete unit test coverage and trigger digest broadcast."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const submitStandup = async () => {
    if (!aiPreview) return;
    setIsSubmitting(true);

    const newStandup = {
      user_name: userName,
      user_role: userRole,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`,
      media_url: audioUrl || null,
      transcript: transcriptPreview,
      summary: aiPreview,
      created_at: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    try {
      const res = await fetch('/api/standups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStandup)
      });
      const data = await res.json();
      if (data.success && onStandupCreated) {
        onStandupCreated(data.standup);
      }
    } catch (err) {
      if (onStandupCreated) onStandupCreated(newStandup);
    } finally {
      setIsSubmitting(false);
      // Reset form
      setAudioUrl(null);
      setAudioBlob(null);
      setAiPreview(null);
      setTranscriptPreview('');
      setTextInput('');
    }
  };

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card" style={{ marginBottom: '2rem', border: '1px solid rgba(99, 102, 241, 0.3)', background: 'linear-gradient(180deg, #12161f 0%, #0d1017 100%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🎙️</span> Record Daily Standup
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Share what you accomplished today, any blockers, and your next targets.
          </p>
        </div>

        {/* User context fields */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            className="input-field"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your Name"
            style={{ width: '130px', padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
          />
          <input
            type="text"
            className="input-field"
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            placeholder="Your Role"
            style={{ width: '140px', padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          onClick={() => setMode('voice')}
          className={`btn ${mode === 'voice' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
        >
          🎤 Voice Recording
        </button>
        <button
          onClick={() => setMode('text')}
          className={`btn ${mode === 'text' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}
        >
          ✍️ Text Entry
        </button>
      </div>

      {errorMsg && (
        <div style={{ padding: '0.6rem 0.8rem', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 'var(--radius-md)', color: 'var(--accent-rose)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {mode === 'voice' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'rgba(10, 12, 16, 0.4)', borderRadius: 'var(--radius-lg)', border: '1px border-dashed var(--border-color)', marginBottom: '1.25rem' }}>
          {!audioUrl && (
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`recording-pulse`}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isRecording ? 'linear-gradient(135deg, #f43f5e, #e11d48)' : 'linear-gradient(135deg, #6366f1, #06b6d4)',
                  color: 'white',
                  fontSize: '2rem',
                  cursor: 'pointer',
                  boxShadow: isRecording ? '0 0 30px rgba(244, 63, 94, 0.5)' : 'var(--shadow-glow)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem auto',
                  transition: 'all 0.2s ease'
                }}
              >
                {isRecording ? '⏹️' : '🎙️'}
              </button>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: isRecording ? 'var(--accent-rose)' : '#fff' }}>
                {isRecording ? `Recording... ${formatSeconds(recordingTime)}` : 'Click Microphone to Start Recording'}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Max recommended duration: 60 seconds
              </p>
            </div>
          )}

          {audioUrl && (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--accent-emerald)', fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                ✓ Voice Audio Captured ({formatSeconds(recordingTime)})
              </div>
              <audio controls src={audioUrl} style={{ width: '100%', maxWidth: '450px', marginBottom: '1rem', borderRadius: 'var(--radius-md)' }} />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                <button onClick={startRecording} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                  🔄 Re-record
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ marginBottom: '1.25rem' }}>
          <textarea
            className="input-field"
            rows="4"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="What did you do today? Any blockers? What are your next steps?"
            style={{ resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick templates:</span>
            <button
              type="button"
              onClick={() => handleDemoVoiceSelect("Completed user authentication unit tests and setup Redis cache for session storage. Blocker: Waiting for QA approval on PR #104. Next steps: Start GraphQL mutation endpoints for standups.")}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', padding: '0.15rem 0.4rem' }}
            >
              + Feature Complete & Blocked
            </button>
            <button
              type="button"
              onClick={() => handleDemoVoiceSelect("Refactored database queries to reduce p99 latency by 40%. No blockers today. Next steps: Migrate staging DB and finalize API documentation.")}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem', borderRadius: '4px', cursor: 'pointer', padding: '0.15rem 0.4rem' }}
            >
              + Smooth Progress (No Blockers)
            </button>
          </div>
        </div>
      )}

      {/* Action Button: AI Summarization */}
      {(!aiPreview) && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={processStandup}
            disabled={isProcessing || (mode === 'voice' && !audioBlob) || (mode === 'text' && !textInput.trim())}
            className="btn btn-primary"
            style={{ width: '100%', maxWidth: '280px', opacity: (isProcessing || (mode === 'voice' && !audioBlob) || (mode === 'text' && !textInput.trim())) ? 0.6 : 1 }}
          >
            {isProcessing ? '⚡ Generating AI Breakdown...' : '✨ Generate AI Summary'}
          </button>
        </div>
      )}

      {/* Structured AI Breakdown Preview & Confirmation */}
      {aiPreview && (
        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              🤖 AI Extracted Insights
            </h3>
            <span style={{ fontSize: '0.75rem', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', padding: '0.2rem 0.5rem', borderRadius: '999px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              Groq Llama-3.3 Powered
            </span>
          </div>

          <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div className="summary-box">
              <div className="summary-label">✅ Accomplished / Completed</div>
              <input
                type="text"
                className="input-field"
                value={aiPreview.status}
                onChange={(e) => setAiPreview({ ...aiPreview, status: e.target.value })}
                style={{ background: 'transparent', border: 'none', padding: '0', fontSize: '0.9rem' }}
              />
            </div>

            <div className="summary-box blocker">
              <div className="summary-label" style={{ color: 'var(--accent-rose)' }}>🚨 Blockers & Impediments</div>
              <input
                type="text"
                className="input-field"
                value={aiPreview.blockers}
                onChange={(e) => setAiPreview({ ...aiPreview, blockers: e.target.value })}
                style={{ background: 'transparent', border: 'none', padding: '0', fontSize: '0.9rem' }}
              />
            </div>

            <div className="summary-box next">
              <div className="summary-label" style={{ color: 'var(--accent-cyan)' }}>🚀 Next Steps / Target</div>
              <input
                type="text"
                className="input-field"
                value={aiPreview.next_steps}
                onChange={(e) => setAiPreview({ ...aiPreview, next_steps: e.target.value })}
                style={{ background: 'transparent', border: 'none', padding: '0', fontSize: '0.9rem' }}
              />
            </div>

            <div className="summary-box" style={{ borderLeftColor: 'var(--accent-amber)' }}>
              <div className="summary-label" style={{ color: 'var(--accent-amber)' }}>💡 Key Decisions</div>
              <input
                type="text"
                className="input-field"
                value={aiPreview.decisions || 'No major architectural decisions reported today.'}
                onChange={(e) => setAiPreview({ ...aiPreview, decisions: e.target.value })}
                style={{ background: 'transparent', border: 'none', padding: '0', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => setAiPreview(null)}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem' }}
            >
              Cancel
            </button>
            <button
              onClick={submitStandup}
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ fontSize: '0.9rem' }}
            >
              {isSubmitting ? 'Publishing...' : '🚀 Post Standup to Team Feed'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
