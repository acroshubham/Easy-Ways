import React from 'react';
import './Styles/EmergencyButton.css';
interface EmergencyButtonProps {
  onClick: () => void;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({ onClick }) => {
  return (
    <button 
      className="emergency-button" 
      onClick={onClick}
      aria-label="Emergency Support"
    >
      <span className="emergency-dot"></span>
    </button>
  );
};
