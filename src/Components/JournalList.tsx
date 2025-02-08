import React from 'react';
import { JournalEntry } from '../Types/types';
import '../Styles/JournalList.css';

interface JournalListProps {
  entries: JournalEntry[];
  onEntryClick: (entry: JournalEntry) => void;
  onDeleteEntry: (id: string) => void;
}

export const JournalList: React.FC<JournalListProps> = ({ 
  entries, 
  onEntryClick, 
  onDeleteEntry 
}) => {
  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement>, 
    id: string
  ) => {
    e.stopPropagation(); // Prevent triggering onClick of parent div
    if (window.confirm('Are you sure you want to delete this entry?')) {
      onDeleteEntry(id);
    }
  };

  return (
    <div className="journal-list">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="journal-list-item"
          onClick={() => onEntryClick(entry)}
        >
          <div className="journal-list-item-content">
            <h3>{entry.header}</h3>
            <div className="journal-list-item-date">{entry.date}</div>
            <p>{entry.body.substring(0, 100)}...</p>
          </div>
          <button 
            className="delete-button"
            onClick={(e) => handleDelete(e, entry.id)}
            aria-label="Delete entry"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
