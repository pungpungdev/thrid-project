import api from '../api/axios';

export const getSubjects = () => api.get('/api/subjects');
export const getSubject = (id) => api.get(`/api/subjects/${id}`);
export const createSubject = (data) => api.post('/api/subjects', data);
export const updateSubject = (id, data) => api.put(`/api/subjects/${id}`, data);
export const deleteSubject = (id) => api.delete(`/api/subjects/${id}`);