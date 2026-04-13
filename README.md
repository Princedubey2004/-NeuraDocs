# NeuraDocs 🚀
### Collaborative AI-Powered Document Editor

NeuraDocs is a production-ready, real-time collaborative document editor inspired by Notion and Google Docs. It features a robust backend for synchronization and an intelligent frontend with integrated AI capabilities.

## ✨ Features
- **Real-time Collaboration**: Multi-user editing with Socket.IO.
- **AI Assistant**: Summarize, rewrite, and fix grammar using OpenAI GPT-3.5.
- **Notion-Style UI**: Minimalist design with a focus on deep work and aesthetics.
- **Secure Auth**: JWT-based authentication with protected workspaces.
- **Presence System**: Live user avatars and typing indicators.
- **Version History**: Save and restore document snapshots.

## 🏗️ Project Structure
- **/server**: Node.js, Express, MongoDB, Socket.IO.
- **/client**: React, Tailwind CSS v4, Zustand, Lucide.

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/neura-docs.git
cd neura-docs
```

### 2. Setup Backend
```bash
cd server
npm install
# Create .env from .env.example and add your keys
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```

## 🔐 Environment Variables (.env)
- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET`: Secret key for token signing.
- `OPENAI_API_KEY`: Your OpenAI API key.

## 🎨 UI & Design
- **Colors**: Minimalist grayscale (Black, White, Slate).
- **Icons**: Lucide React.
- **Editor**: React Quill (Customized).

---
**Author**: Prince Dubey 🧑‍💻
