import React from 'react';
import '../Styles/Emergency.css'
const quotes = [
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "Every storm runs out of rain.",
    author: "Maya Angelou"
  },
  {
    text: "Pause, breathe, repair your universe, proceed.",
    author: "Anonymous"
  },
  {
    text: "You are stronger than you know, braver than you believe.",
    author: "Robin Sharma"
  },
  {
    text: "The darkest hour has only sixty minutes.",
    author: "Morris Mandel"
  },
  {
    text: "Rock bottom became the solid foundation on which I rebuilt my life.",
    author: "J.K. Rowling"
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein"
  },
  {
    text: "The man who moves a mountain begins by carrying away small stones.",
    author: "Confucius"
  },
  {
    text: "Your present circumstances don't determine where you can go; they merely determine where you start.",
    author: "Nido Qubein"
  }
];

const images = [
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1440&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1440&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1440&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1440&q=80",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1440&q=80"
];

const emergencyTips = {
  physical: {
    title: "Physical Methods",
    tips: [
      "Take deep breaths - inhale for 4 seconds, hold for 4, exhale for 4",
      "Do 20 jumping jacks or push-ups",
      "Go for a walk outside in nature",
      "Stretch your entire body for 5 minutes",
      "Take a cold shower or splash cold water on your face"
    ]
  },
  spiritual: {
    title: "Spiritual Methods",
    tips: [
      "Meditate for 5 minutes in silence",
      "Practice gratitude - list 3 things you're thankful for",
      "Connect with your breath through mindful breathing",
      "Visualize a peaceful place in detail",
      "Repeat a calming mantra or prayer"
    ]
  },
  mental: {
    title: "Mental Methods",
    tips: [
      "Count backwards from 100 by 7s",
      "Name 5 things you can see, 4 touch, 3 hear, 2 smell, 1 taste",
      "Write down your current thoughts without judgment",
      "Focus on a simple task like organizing your desk",
      "Listen to calming music or nature sounds"
    ]
  }
};

interface EmergencyProps {
  onClose: () => void;
}

export const Emergency: React.FC<EmergencyProps> = ({ onClose }) => {
  const [currentQuote, setCurrentQuote] = React.useState(quotes[0]);
  const [currentImage, setCurrentImage] = React.useState(images[0]);

  React.useEffect(() => {
    const quoteIndex = Math.floor(Math.random() * quotes.length);
    const imageIndex = Math.floor(Math.random() * images.length);
    setCurrentQuote(quotes[quoteIndex]);
    setCurrentImage(images[imageIndex]);
  }, []);

  return (
    <div className="emergency-page">
      <button className="close-emergency" onClick={onClose}>×</button>
      <div className="emergency">
        <div className="emergency-content" style={{ backgroundImage: `url(${currentImage})` }}>
          <div className="quote-container">
            <blockquote>
              <p>{currentQuote.text}</p>
              <footer>— {currentQuote.author}</footer>
            </blockquote>
          </div>
          <div className="emergency-tips">
            <h2>Emergency Wellness Toolkit</h2>
            {Object.values(emergencyTips).map((section, index) => (
              <div key={index} className="tip-section">
                <h3>{section.title}</h3>
                <ul>
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex}>{tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Emergency;