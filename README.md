# NexAI | AI SaaS Platform

A full-stack artificial intelligence SaaS application featuring a React-based frontend and an Express/Node.js backend. This platform integrations with advanced AI APIs and features robust user authentication, cloud storage, and database management.

## Project Structure

The project is structured into two main directories:

- `/client` - The frontend application (Vite + React)
- `/server` - The backend application (Node.js + Express)

## Features

### Frontend (Client)
- **Framework:** React 19 with Vite
- **Styling:** Tailwind CSS (v4)
- **Authentication:** Clerk for React (`@clerk/clerk-react`)
- **Routing:** React Router DOM
- **UI Components:** Lucide React for icons, React Hot Toast / React Toastify for notifications
- **Markdown & PDF:** React Markdown, jsPDF for content generation and export
- **Data Fetching:** Axios

### Backend (Server)
- **Framework:** Express.js 5
- **Authentication:** Clerk Express integration
- **AI Integration:** 
  - Google Gen AI (`@google/genai`)
  - OpenAI API (`openai`)
- **Database:** Neon Serverless PostgreSQL
- **Cloud Storage:** Cloudinary for image/asset management
- **File Handling:** Multer and PDF-Parse for file uploads and processing

## Prerequisites

- Node.js (v18 or higher recommended)
- API Keys for the following services:
  - Clerk (Authentication)
  - Google Gemini API / OpenAI API
  - Neon Database
  - Cloudinary

## Installation & Setup

1. **Clone the repository** (if applicable)
   ```bash
   git clone <repository-url>
   cd "AI SAAS"
   ```

2. **Setup the Server**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory with the necessary environment variables:
   ```env
   PORT=3000
   CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   GOOGLE_API_KEY=
   OPENAI_API_KEY=
   DATABASE_URL=
   CLOUDINARY_URL=
   # Add other required keys
   ```

3. **Setup the Client**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env` file in the `client` directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=
   VITE_API_URL=http://localhost:3000
   ```

## Running the Application

### Start the Backend
From the `/server` directory:
```bash
# For development (with nodemon)
npm run server

# For production
npm start
```

### Start the Frontend
From the `/client` directory:
```bash
npm run dev
```

The client will typically start on `http://localhost:5173` and the server on `http://localhost:3000`.

## Deployment

### Backend (Render)
The server is configured with a self-ping system to prevent Render's free tier from sleeping, automatically hitting the `https://nexai-lxp5.onrender.com/` endpoint every 14 minutes.

## License
ISC License
