import React, { useState, useEffect } from 'react';
import { JournalEntry as JournalEntryType } from '../Types/types';
import { saveJournalEntry, getJournalEntries, deleteJournalEntry } from '../Utils/Storage';
import { JournalList } from './JournalList';
import { JournalDetail } from './JournalDetail';
import '../Styles/JournalEntry.css';

export const JournalEntry: React.FC = () => {
  const [date, setDate] = useState('');
  const [header, setHeader] = useState('');
  const [body, setBody] = useState('');
  const [entries, setEntries] = useState<JournalEntryType[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntryType | null>(null);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const savedEntries = getJournalEntries();
    setEntries(savedEntries.sort((a, b) => b.createdAt - a.createdAt));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = saveJournalEntry({ date, header, body });
    setEntries([newEntry, ...entries]);
    setDate('');
    setHeader('');
    setBody('');
    
    // Show save confirmation
    setSaveMessage('Entry saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleDeleteEntry = (id: string) => {
    const updatedEntries = deleteJournalEntry(id);
    setEntries(updatedEntries.sort((a, b) => b.createdAt - a.createdAt));
    setSaveMessage('Entry deleted successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
    
    // Close detail view if the deleted entry was being viewed
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
    }
  };

  return (
    <div className="journal-container">
      <form className="journal-entry" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="header">Header</label>
          <input
            type="text"
            id="header"
            value={header}
            onChange={(e) => setHeader(e.target.value)}
            placeholder="Enter a title for your entry"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="body">Body</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your thoughts..."
            required
          />
        </div>
        <button type="submit" className="submit-button">Save Entry</button>
        {saveMessage && <div className="save-message">{saveMessage}</div>}
      </form>
      
      <JournalList 
        entries={entries} 
        onEntryClick={setSelectedEntry}
        onDeleteEntry={handleDeleteEntry}
      />

      {selectedEntry && (
        <JournalDetail
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </div>
  );
};