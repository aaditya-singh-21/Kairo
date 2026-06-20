# Kairo

Kairo is an AI-powered, full-stack website builder that allows users to instantly generate, preview, and iterate on React applications. Describe the website or component you want to build, and Kairo will write the code and render a live preview in real-time.

![Kairo Preview](https://img.shields.io/badge/Status-Beta-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **AI Code Generation**: Leverages Google Gemini (with Groq fallback) to generate complete, single-file React applications based on natural language prompts.
- **Real-Time Streaming**: Uses Server-Sent Events (SSE) to stream the code directly to the browser, providing instant feedback as the AI "types".
- **Live Preview Environment**: A sandboxed iframe runs Babel standalone on the client-side, transpiling and rendering the React code instantly without a build step.
- **Bring Your Own Key (BYOK)**: Users can supply their own Google Gemini API key to bypass the credit system and unlock unlimited generations.
- **Iteration & Version History**: Keep iterating on a project. Kairo saves a version history so you can see how your project evolved over time.
- **Authentication**: Secure JWT-based authentication system for saving projects and tracking credits.

## 🏗️ Tech Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** for styling
- **Framer Motion** for smooth micro-animations
- **Monaco Editor** for a rich, IDE-like code viewing experience
- **Babel Standalone** for in-browser JSX transpilation

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose** for data persistence
- **Google Gen AI SDK** and **Groq SDK** for interacting with LLMs
- **TypeScript**

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/aaditya-singh-21/Kairo.git
cd Kairo
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
GROQ_API_KEY=your_groq_api_key
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```

## 💡 Usage

1. **Sign Up / Sign In**: Create an account to get started with initial generation credits.
2. **Create a Project**: Type a prompt describing the app you want to build (e.g., "Build a markdown note-taking app with a dark mode toggle").
3. **Watch it Build**: Kairo will stream the generated code and render the result in the Preview tab.
4. **Iterate**: Use the input box at the bottom of the Editor to ask for changes or new features.
5. **BYOK**: Run out of credits? Click the `🔑 Add API Key` button in the top right corner to save your own Google Gemini API key securely in your browser and continue generating for free.

## 📄 License

This project is licensed under the MIT License.
