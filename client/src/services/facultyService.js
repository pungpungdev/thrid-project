import api from '../api/axios';

export const getFaculties = () => api.get('/api/faculties');
export const getFaculty = (id) => api.get(`/api/faculties/${id}`);
export const createFaculty = (data) => api.post('/api/faculties', data);
export const updateFaculty = (id, data) => api.put(`/api/faculties/${id}`, data);
export const deleteFaculty = (id) => api.delete(`/api/faculties/${id}`);