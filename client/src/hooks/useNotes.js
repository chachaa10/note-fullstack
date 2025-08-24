import { useEffect, useState } from 'react';
import noteService from '../services/notes';

export const useNotes = (user) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const initialNotes = await noteService.getAll();
        setNotes(initialNotes);
      } catch (error) {
        // In a real app, you'd want to handle this error more gracefully
        console.error(error);
      }
    };

    if (user) {
      fetchNotes();
    } else {
      setNotes([]);
    }
  }, [user]);

  const addNote = async (noteObject) => {
    const returnedNote = await noteService.create(noteObject);
    setNotes(notes.concat(returnedNote));
  };

  const toggleImportanceOf = async (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    const returnedNote = await noteService.update(id, changedNote);
    setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
  };

  const deleteNote = async (id) => {
    await noteService.deleteNote(id);
    setNotes(notes.filter((note) => note.id !== id));
  };

  return {
    notes,
    addNote,
    toggleImportanceOf,
    deleteNote,
  };
};
