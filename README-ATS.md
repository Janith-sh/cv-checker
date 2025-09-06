# ReadyCV - AI-Powered ATS CV Analyzer

A comprehensive CV analysis tool built with Next.js 15, TypeScript, and the Vercel AI SDK that provides detailed feedback on how well your CV performs against Applicant Tracking Systems (ATS).

## Features

### 🔍 Comprehensive CV Analysis
- **Overall ATS Score**: Get a comprehensive score out of 100 for your CV's ATS compatibility
- **Section-by-Section Analysis**: Detailed scoring for contact info, summary, experience, skills, education, and formatting
- **Job Role Matching**: Tailored analysis based on your target job role
- **Keyword Analysis**: Identify found and missing keywords relevant to your field

### 🎯 Smart Recommendations
- **Immediate Actions**: Quick fixes to boost your CV score right away
- **ATS Optimization**: Specific recommendations to improve ATS compatibility
- **Long-term Goals**: Career development suggestions for sustained growth

### 📊 Detailed Reporting
- **Visual Dashboard**: Interactive charts and progress bars showing your CV performance
- **Downloadable Reports**: Export your analysis results as JSON for future reference
- **Historical Tracking**: Compare multiple CV versions (via sessionStorage)

### 🔒 Secure & Private
- **User Authentication**: Secure login system with JWT tokens
- **Session Management**: Secure handling of user sessions and data
- **Privacy-First**: CV content is processed securely and not stored permanently

## Technology Stack

- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS
- **AI Processing**: Vercel AI SDK with Google Gemini
- **PDF Processing**: pdf-parse for text extraction
- **Authentication**: JWT with bcryptjs
- **Database**: MongoDB with Mongoose
- **Validation**: Zod for schema validation

## Quick Start

### Prerequisites
- Node.js 18+ installed
- Google Gemini API key
- MongoDB database (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cv-checker.git
   cd cv-checker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
   MONGODB_URI=your_mongodb_uri_here
   JWT_SECRET=your_secure_jwt_secret_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## How It Works

### 1. Upload Process
- Users upload PDF CVs (up to 10MB)
- Select target job role from predefined list or specify custom role
- Files are validated and processed securely

### 2. AI Analysis
The system uses Google Gemini to analyze CVs across multiple dimensions:

- **Contact Information**: Checks for essential contact details
- **Professional Summary**: Evaluates relevance and quality
- **Work Experience**: Analyzes experience relevance and quantifiable achievements
- **Skills Assessment**: Identifies technical and soft skills, suggests missing ones
- **Education Review**: Evaluates educational background relevance
- **Formatting Check**: Ensures ATS-friendly formatting

### 3. Scoring Algorithm
Each section receives a score from 0-100 based on:
- Completeness of information
- Relevance to target job role
- ATS compatibility factors
- Industry best practices

### 4. Results Dashboard
Users receive:
- **Overall Score**: Comprehensive ATS compatibility rating
- **Section Breakdown**: Detailed analysis of each CV section
- **Keyword Analysis**: Found vs. missing keywords for the role
- **Actionable Recommendations**: Prioritized suggestions for improvement

## API Endpoints

### `/api/analyze-cv` (POST)
Analyzes uploaded CV files using AI.

**Request:**
- `cv`: PDF file (multipart/form-data)
- `jobRole`: Target job role string

**Response:**
```json
{
  "success": true,
  "analysis": {
    "overallScore": 85,
    "sections": {
      "contactInfo": { "score": 90, "found": ["email", "phone"], "missing": ["linkedin"], "suggestions": [...] },
      "summary": { "score": 80, "hasObjective": true, "isRelevant": true, "suggestions": [...] },
      // ... other sections
    },
    "keywords": {
      "found": ["React", "JavaScript", "Node.js"],
      "missing": ["TypeScript", "AWS", "Docker"],
      "density": 75
    },
    "recommendations": {
      "immediate": ["Add LinkedIn profile", "Include more technical keywords"],
      "longTerm": ["Obtain cloud certifications", "Build portfolio projects"],
      "atsOptimization": ["Use standard section headings", "Improve keyword density"]
    },
    "matchScore": 82
  },
  "metadata": {
    "jobRole": "Software Engineer",
    "fileName": "resume.pdf",
    "fileSize": 245760,
    "analyzedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

## Authentication System

The application includes a complete authentication system:

- **Registration**: Create new user accounts with email/password
- **Login**: Secure login with JWT tokens
- **Session Management**: Automatic token validation and refresh
- **Protected Routes**: Dashboard and upload pages require authentication
- **Logout**: Secure session cleanup

## Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
Ensure your deployment platform supports:
- Node.js 18+
- Environment variables
- File upload handling
- MongoDB connection

## Customization

### Adding New Job Roles
Edit the `jobRoles` array in `/src/app/upload/page.tsx`:

```typescript
const jobRoles = [
  'Software Engineer',
  'Data Scientist',
  // Add your new roles here
  'Your Custom Role'
];
```

### Modifying Analysis Criteria
Update the AI prompt in `/src/app/api/analyze-cv/route.ts` to adjust analysis focus.

### Styling
The application uses Tailwind CSS. Customize the design by modifying classes or extending the Tailwind configuration.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Troubleshooting

### Common Issues

1. **PDF Text Extraction Fails**
   - Ensure PDF contains selectable text (not just images)
   - Try re-saving the PDF from your word processor

2. **Gemini API Errors**
   - Check your API key is valid and has sufficient credits
   - Verify the key is correctly set in environment variables

3. **Upload Fails**
   - Check file size is under 10MB
   - Ensure file is a valid PDF format

4. **Authentication Issues**
   - Clear browser cookies and try again
   - Check MongoDB connection is working

### Getting Help

- Create an issue on GitHub for bugs
- Check the discussions section for questions
- Review the API documentation for integration help

## Roadmap

- [ ] Support for more file formats (DOCX, TXT)
- [ ] Integration with more AI providers (Anthropic, Google AI)
- [ ] Historical analysis tracking
- [ ] Team/organization features
- [ ] API for third-party integrations
- [ ] Mobile app version
