import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Assalam-o-Alaikum! Main aap ka Urdu seekhne ka madadgar hun. Aap mujh se Urdu zuban ke bare mein koi bhi sawal puch sakte hain.",
      sender: "bot"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user"
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/api/get-review", {
        code: inputText,
      });
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.data,
        sender: "bot"
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Maaf karein, main aap ke sawal ka jawab nahi de saka. Baraye karam dobara koshish karein.",
        sender: "bot"
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Urdu Seekhiye</h1>
        <p>Aap ka Urdu tutor</p>
      </div>

      <div className="chat-area">
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="text">
                {message.sender === 'bot' ? (
                  <Markdown>{message.text}</Markdown>
                ) : (
                  message.text
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message bot">
              <div className="text">Typing...</div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Urdu mein sawal puchiye..."
            className="input"
          />
          <button 
            onClick={sendMessage} 
            className="send-btn"
            disabled={!inputText.trim() || isLoading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;