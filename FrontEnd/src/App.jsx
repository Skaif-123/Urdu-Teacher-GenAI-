import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import "./App.css";

// Import fonts
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/noto-nastaliq-urdu/400.css";
import "@fontsource/noto-sans-devanagari/400.css";
import "@fontsource/noto-sans-devanagari/500.css";

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "**Assalam-o-Alaikum!** 🌟 Main aap ka Urdu seekhne ka madadgar hun. Aap mujh se Urdu zuban ke bare mein koi bhi sawal puch sakte hain.\n\n**आप से कैसे मदद कर सकता हूं?**\n- उर्दू अक्षर सिखाना\n- शब्दावली बढ़ाना  \n- वाक्य निर्माण\n- उच्चारण में सुधार",
      sender: "bot"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-resize textarea
  const handleInputChange = useCallback((e) => {
    setInputText(e.target.value);
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }, []);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading || !isOnline) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsLoading(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      const response = await axios.post("http://localhost:3000/api/get-review", {
        code: currentInput,
      });
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.data,
        sender: "bot",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: isOnline 
          ? "**खुशफहमी के लिए माफी!** 😔 Main aap ke sawal ka jawab nahi de saka. Baraye karam dobara koshish karein."
          : "**ऑफलाइन हैं!** 📡 Internet connection check karein aur phir try karein.",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="app">
      <div className="header">
        <div className="header-content">
          <h1>🌙 Urdu Seekhiye</h1>
          <p>आपका व्यक्तिगत उर्दू शिक्षक | Aap ka Urdu tutor</p>
          <div className="status-indicator">
            <div className={`status-dot ${isOnline ? 'online' : 'offline'}`}></div>
            <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        </div>
      </div>

      <div className="chat-area">
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <div className="text">
                  {message.sender === 'bot' ? (
                    <Markdown>{message.text}</Markdown>
                  ) : (
                    message.text
                  )}
                </div>
                <div className="timestamp">
                  {message.timestamp ? message.timestamp.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) : new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message bot">
              <div className="message-content">
                <div className="text typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  सोच रहा हूं...
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <div className="input-container">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="यहाँ अपना सवाल लिखें... (Hindi/English/Urdu में)"
              className="input"
              rows="1"
              disabled={!isOnline}
            />
            <button 
              onClick={sendMessage} 
              className="send-btn"
              disabled={!inputText.trim() || isLoading}
            >
              <span>📤</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
