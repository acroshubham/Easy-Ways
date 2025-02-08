import React from 'react';
import { JournalEntry } from '../Types/types';
import '../Styles/JournalDetail.css';

interface JournalDetailProps {
  entry: JournalEntry;
  onClose: () => void;
}

export const JournalDetail: React.FC<JournalDetailProps> = ({ entry, onClose }) => {
  return (
    <div className="journal-detail">
      <div className="journal-detail-header">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>{entry.header}</h2>
        <div className="entry-date">{entry.date}</div>
      </div>
      <div className="journal-detail-body">
        {entry.body}
      </div>
    </div>
  );
};
