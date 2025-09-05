# ReadyCV - AI-Powered CV Checker

A modern web application for analyzing CVs against ATS systems with AI-powered feedback and optimization suggestions.

## Features

- 🔐 User authentication with JWT
- 📄 CV upload and analysis
- 🎯 Job role targeting
- 📊 ATS compatibility scoring
- 💡 AI-powered optimization suggestions
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cv-checker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**

   **Option A: Local MongoDB**
   ```bash
   # Install MongoDB locally (Windows)
   # Download and install from: https://www.mongodb.com/try/download/community

   # Start MongoDB service
   mongod
   ```

   **Option B: MongoDB Atlas (Cloud)**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a cluster and get connection string

4. **Environment Variables**

   Create `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/cv-checker
   # For MongoDB Atlas, use:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cv-checker

   # JWT Secret (generate a random string for production)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # NextAuth Secret (optional)
   NEXTAUTH_SECRET=your-nextauth-secret-key

   # App URL
   NEXTAUTH_URL=http://localhost:3000
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── auth/         # Authentication endpoints
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── upload/           # CV upload page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── lib/                  # Utility functions
│   ├── mongodb.ts        # Database connection
│   └── auth.ts          # Authentication helpers
├── models/               # MongoDB models
│   └── User.ts          # User schema
└── middleware.ts         # Route protection
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Make sure to update the JWT secret and MongoDB URI for production deployment.

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- Ensure MongoDB connection string is updated
- Set all required environment variables
- Configure build settings for Next.js

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
