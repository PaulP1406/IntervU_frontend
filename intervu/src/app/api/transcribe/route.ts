import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    console.log('Transcribing audio file:', audioFile.name, 'Size:', audioFile.size);

    // Convert File to format Whisper accepts
    const audioBuffer = await audioFile.arrayBuffer();
    const audioBlob = new Blob([audioBuffer], { type: audioFile.type });
    
    // Create a File object for Whisper API
    const file = new File([audioBlob], 'audio.webm', { type: audioFile.type });

    // Call Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'en', // Optional: specify language
      response_format: 'json',
    });

    console.log('Transcription successful:', transcription.text.substring(0, 100) + '...');

    return NextResponse.json({
      success: true,
      transcript: transcription.text,
    });

  } catch (error: any) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { 
        error: 'Transcription failed',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Configure route to handle large files
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout
