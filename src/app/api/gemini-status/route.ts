import { NextResponse } from 'next/server';

export async function GET() {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json({
        error: 'No Google Gemini API key configured',
        hasKey: false
      });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    return NextResponse.json({
      status: 'Gemini API key is configured',
      hasKey: true,
      keyPrefix: apiKey.substring(0, 10) + '...',
      keyLength: apiKey.length,
      provider: 'Google Gemini',
      model: 'gemini-1.5-flash',
      timestamp: new Date().toISOString(),
      note: 'Gemini API validation requires actual API call - use Test button above'
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
