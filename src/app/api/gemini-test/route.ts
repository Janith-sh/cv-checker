import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Gemini Chat Test API Called ===');
    
    // Check if Google API key exists
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'Google Gemini API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'No message provided' },
        { status: 400 }
      );
    }

    console.log('User message:', message);
    console.log('API Key prefix:', process.env.GOOGLE_GENERATIVE_AI_API_KEY.substring(0, 10) + '...');

    // Try with Gemini 1.5 Flash (fastest and most cost-effective)
    console.log('Calling Google Gemini with gemini-1.5-flash...');
    
    const result = await generateText({
      model: google('gemini-1.5-flash'),
      prompt: `You are a helpful assistant. Respond briefly to: ${message}`,
    });

    console.log('Gemini response received:', result.text);

    return NextResponse.json({
      success: true,
      response: result.text,
      model: 'gemini-1.5-flash',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('=== Gemini Chat Test Error ===', error);
    
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });

      // Check for specific Gemini errors
      if (error.message.includes('PERMISSION_DENIED') || error.message.includes('API key')) {
        return NextResponse.json(
          { 
            error: 'Invalid Google Gemini API key',
            details: error.message,
            suggestion: 'Check your API key at https://aistudio.google.com/app/apikey'
          },
          { status: 401 }
        );
      }

      if (error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('quota')) {
        return NextResponse.json(
          { 
            error: 'Google Gemini quota exceeded',
            details: error.message,
            suggestion: 'Check your usage at https://aistudio.google.com/'
          },
          { status: 429 }
        );
      }

      if (error.message.includes('INVALID_ARGUMENT')) {
        return NextResponse.json(
          { 
            error: 'Invalid request to Gemini',
            details: error.message,
            suggestion: 'Check the model name and request format'
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { 
          error: 'Google Gemini API error',
          details: error.message,
          type: error.name
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Gemini Chat Test API is ready',
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    apiKeyPrefix: process.env.GOOGLE_GENERATIVE_AI_API_KEY?.substring(0, 10) + '...' || 'not set'
  });
}
