import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('=== CV Analysis Test API called ===');
    
    // Log environment check
    console.log('Environment check:', {
      hasGeminiKey: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      keyLength: process.env.GOOGLE_GENERATIVE_AI_API_KEY?.length || 0
    });

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('cv') as File;
    const jobRole = formData.get('jobRole') as string;

    console.log('Form data received:', {
      hasFile: !!file,
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
      jobRole
    });

    // Basic validation
    if (!file) {
      console.log('No file provided');
      return NextResponse.json(
        { error: 'No CV file provided' },
        { status: 400 }
      );
    }

    if (!jobRole) {
      console.log('No job role provided');
      return NextResponse.json(
        { error: 'No job role specified' },
        { status: 400 }
      );
    }

    // Return a mock successful response for testing
    const mockAnalysis = {
      overallScore: 85,
      sections: {
        contactInfo: {
          score: 90,
          found: ['email', 'phone'],
          missing: ['linkedin'],
          suggestions: ['Add LinkedIn profile URL']
        },
        summary: {
          score: 80,
          hasObjective: true,
          isRelevant: true,
          suggestions: ['Make summary more specific to the role']
        },
        experience: {
          score: 88,
          yearsOfExperience: 3,
          hasQuantifiableAchievements: true,
          relevantRoles: 2,
          suggestions: ['Add more quantifiable achievements']
        },
        skills: {
          score: 75,
          technicalSkills: ['JavaScript', 'React', 'Node.js'],
          softSkills: ['Communication', 'Teamwork'],
          missingKeySkills: ['TypeScript', 'AWS'],
          suggestions: ['Add cloud platform experience']
        },
        education: {
          score: 85,
          degrees: ['Bachelor of Computer Science'],
          isRelevant: true,
          suggestions: ['Consider adding relevant certifications']
        },
        formatting: {
          score: 90,
          isATSFriendly: true,
          issues: [],
          suggestions: ['Formatting looks good for ATS systems']
        }
      },
      keywords: {
        found: ['JavaScript', 'React', 'development'],
        missing: ['TypeScript', 'AWS', 'Docker'],
        density: 75
      },
      recommendations: {
        immediate: [
          'Add LinkedIn profile to contact section',
          'Include TypeScript in skills section'
        ],
        longTerm: [
          'Gain cloud platform experience',
          'Obtain relevant certifications'
        ],
        atsOptimization: [
          'Include more role-specific keywords',
          'Use standard section headings'
        ]
      },
      matchScore: 82
    };

    console.log('Returning mock analysis');

    return NextResponse.json({
      success: true,
      analysis: mockAnalysis,
      metadata: {
        jobRole,
        fileName: file.name,
        fileSize: file.size,
        analyzedAt: new Date().toISOString(),
        note: 'This is a test response with mock data'
      }
    });

  } catch (error) {
    console.error('=== CV Analysis Test Error ===', error);
    
    return NextResponse.json(
      { 
        error: 'Test API error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'CV Analysis Test API is working',
    timestamp: new Date().toISOString()
  });
}
