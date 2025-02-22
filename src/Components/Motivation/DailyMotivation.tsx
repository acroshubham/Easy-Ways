import React, { useState, useEffect } from 'react';
import './Styles/DailyMotivation.css';

const images = [
  "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80"
];

const quotes = [
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  }
];

export const DailyMotivation: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(images[0]);
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('lastMotivationDate');

    if (savedDate !== today) {
      const randomImage = images[Math.floor(Math.random() * images.length)];
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      
      setCurrentImage(randomImage);
      setCurrentQuote(randomQuote);
      localStorage.setItem('lastMotivationDate', today);
    }
  }, []);

  return (
    <div className="motivation-container">
      <div className="motivation-card">
        <div 
          className="image-container"
          style={{ backgroundImage: `url(${currentImage})` }}
        >
          <div className="quote-overlay">
            <blockquote className="quote-text">
              "{currentQuote.text}"
            </blockquote>
            <cite className="quote-author">— {currentQuote.author}</cite>
          </div>
        </div>
      </div>

      <div className="motivation-grid">
        <div className="info-card">
          <h3>Today's Focus</h3>
          <p>Set your intention for the day and stay committed to your goals.</p>
        </div>
        <div className="info-card">
          <h3>Reflection</h3>
          <p>Take a moment to reflect on your progress and celebrate small wins.</p>
        </div>
        <div className="info-card">
          <h3>Next Steps</h3>
          <p>Plan your next actions to maintain momentum on your journey.</p>
        </div>
      </div>
    </div>
  );
};