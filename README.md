# 🎓 Urdu Learner - AI-Powered Urdu Learning Chatbot

A modern, interactive Urdu learning application powered by Google's Gemini AI. Learn Urdu through engaging conversations with an AI tutor.

![language AI](<FrontEnd/urdu app.gif>)

## 🌟 Features

- **AI-Powered Tutor**: Chat with Ustadji, your Urdu learning companion
- **Roman English Support**: Learn pronunciation with transliterated Urdu
- **Dark Theme**: Modern, easy-on-eyes interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Chat**: Instant AI responses for continuous learning

## 🛠️ Tech Stack

**Frontend:** React 19.1.1, Vite, Axios, React Markdown
**Backend:** Node.js, Express.js, Google Gemini AI

## 🚀 Quick Start

1. **Clone and Install**
```bash
   git clone <repository-url>
   cd UrduLearner
```

2. **Backend Setup**
```bash
cd BackEnd
npm install
   # Create .env file with G_API_KEY=your_gemini_api_key
npm start
```

3. **Frontend Setup**
```bash
   cd FrontEnd
npm install
   npm run dev
   ```

4. **Access:** http://localhost:5173

## 🎓 How to Use

1. Choose your learning level (Beginner to Advanced)
2. Select a topic (Conversations, Script, Songs, Food, etc.)
3. Start chatting and learn Urdu interactively!

## 📁 Project Structure

```
UrduLearner/
├── FrontEnd/          # React frontend
├── BackEnd/           # Node.js backend with Gemini AI
└── README.md
```

## 🔧 API

**POST** `/api/get-review`
```json
{
  "code": "Your question in Urdu/English"
}
```

## 📱 Mobile Ready

Fully responsive design works on all devices.

---

**Made with ❤️ for Urdu learners worldwide**

*"Urdu seekhna kabhi itna aasan nahi tha!"*