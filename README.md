# IntervU Frontend

An AI-powered interview practice platform that provides realistic, customizable interview experiences with real-time feedback. Built with Next.js 15 and featuring voice-enabled AI interviews powered by OpenAI and ElevenLabs.

## Features

- **AI Interview Simulation**: Realistic behavioral and technical interview practice with AI-powered questioning
- **Voice Integration**: Natural conversation flow with text-to-speech and speech-to-text capabilities
- **Resume Parsing**: Automatic PDF resume parsing for personalized question generation
- **Topic Selection**: Choose from multiple interview categories (behavioral, technical, leadership, etc.)
- **Real-time Feedback**: Instant AI analysis with detailed scoring and improvement suggestions
- **Code Editor**: Monaco-powered code editor for technical interview questions
- **Responsive Design**: Mobile-first design that adapts to all screen sizes
- **Interview Analytics**: Comprehensive results with hireability scoring and detailed breakdowns

## Prerequisites

- Node.js 20+
- Backend API running (see [IntervU Backend](https://github.com/PaulP1406/stormhacks-BE))
- OpenAI API key
- ElevenLabs API key

## Setup

1. **Install dependencies:**
   ```bash
   cd intervu
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Create .env.local file with your credentials
   OPENAI_API_KEY=your_openai_api_key_here
   ELEVEN_LABS_API_KEY=your_elevenlabs_api_key_here
   NEXT_PUBLIC_API_URL=http://localhost:8080
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Development: http://localhost:3000
   - Production build: `npm run build && npm start`

## User Flow

1. **Upload Resume**: Upload your PDF resume and paste the job description
2. **Select Topics**: Choose up to 3 interview topics to focus on
3. **Waiting Room**: Set up your camera and microphone
4. **Instructions**: Learn how the interview process works
5. **Interview**: Practice with Ryan the Raccoon AI interviewer
6. **Results**: Review detailed feedback with scoring and improvement tips

## API Routes

- `POST /api/transcribe` - Convert speech to text using OpenAI Whisper
- `POST /api/text-to-speech` - Generate voice responses with ElevenLabs

## Project Structure

```
intervu/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── upload/            # Resume upload
│   │   ├── topics/            # Topic selection
│   │   ├── waiting-room/      # Camera/mic setup
│   │   ├── instructions/      # How it works
│   │   ├── interview/         # Main interview interface
│   │   ├── results/           # Behavioral feedback
│   │   └── api/               # API routes
│   ├── components/            # Reusable components
│   │   └── Header.tsx         # Navigation header
│   ├── context/               # React context
│   │   └── InterviewContext.tsx  # Global interview state
│   └── lib/                   # Utilities
│       └── api.ts             # API client
├── public/                    # Static assets
│   ├── logo.svg
│   ├── raccoonWave.svg
│   └── ...
└── package.json
```

## Technologies

- **Framework**: Next.js 15 with App Router and Turbopack
- **UI**: React 19 with TypeScript
- **Styling**: Tailwind CSS 4
- **Code Editor**: Monaco Editor (VS Code editor)
- **AI Services**: OpenAI (Whisper), ElevenLabs (TTS)
- **PDF Processing**: PDF.js with Canvas
- **State Management**: React Context API
- **Architecture**: Component-based architecture with centralized state

## Key Components

### Interview Context
Global state management for interview flow, storing:
- Resume text and job description
- Selected topics
- Interview transcripts
- Session data

### Voice Processing
- **Speech-to-Text**: Real-time audio transcription using OpenAI Whisper
- **Text-to-Speech**: Natural voice generation with ElevenLabs API

### Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Adaptive layouts: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- Graduated padding system for optimal spacing across devices

## Development

- **Dev Server**: `npm run dev` (with Turbopack for fast refresh)
- **Build**: `npm run build` (optimized production build)
- **Start**: `npm start` (run production build)

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

This project was created by Brandon, Eric, Mark, and Paul - Computing Science students at Simon Fraser University.

## License

Private repository - All rights reserved
