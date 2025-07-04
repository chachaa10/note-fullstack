const NoteModel = require('../models/note');
const UserModel = require('../models/user');
const bcrypt = require('bcrypt');

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
];

const nonExistingId = async () => {
  const note = new NoteModel({ content: 'willremovethissoon' });
  await note.save();
  await note.deleteOne();

  return note._id.toString();
};

const notesInDb = async () => {
  const notes = await NoteModel.find({});
  return notes.map((note) => note.toJSON());
};

const usersInDb = async () => {
  const users = await UserModel.find({});
  return users.map((user) => user.toJSON());
};

const hashedPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb,
  hashedPassword,
};
