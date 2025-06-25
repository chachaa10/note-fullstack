import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/notes';

const getAllNotes = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};













const createNotes = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const updateNotes = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

export default {
  getAllNotes,
  createNotes,
  updateNotes,
};
