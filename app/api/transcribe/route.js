import { NextResponse } from 'next/server';
import { transcribeAudio, summarizeStandup } from '../../../lib/ai';

export async function POST(req) {
  try {
    const body = await req.json();
    let transcript = '';

    if (body.audioBase64) {
      const buffer = Buffer.from(body.audioBase64, 'base64');
      transcript = await transcribeAudio(buffer, body.mimeType || 'audio/webm');
    } else if (body.text) {
      transcript = body.text;
    } else {
      return NextResponse.json({ success: false, error: 'No audio or text input provided' }, { status: 400 });
    }

    const summary = await summarizeStandup(transcript);

    return NextResponse.json({
      success: true,
      transcript,
      summary
    });
  } catch (error) {
    console.error('Transcribe API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
