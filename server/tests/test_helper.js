import bcrypt from 'bcrypt';
import NoteModel from '../models/note';
import UserModel from '../models/user';

export const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
];

export const nonExistingId = async () => {
  const note = new NoteModel({ content: 'willremovethissoon' });
  await note.save();
  await note.deleteOne();

  return note._id.toString();
};

export const notesInDb = async () => {
  const notes = await NoteModel.find({});
  return notes.map((note) => note.toJSON());
};

export const usersInDb = async () => {
  const users = await UserModel.find({});
  return users.map((user) => user.toJSON());
};

export const hashedPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};
