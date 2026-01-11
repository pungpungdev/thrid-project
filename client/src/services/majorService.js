import api from '../api/axios';

export const getMajors = () => api.get('/api/majors');
export const getMajorsByFacultyId = (facultyId) => api.get(`/api/majors?facultyId=${facultyId}`);
export const getMajor = (id) => api.get(`/api/majors/${id}`);
export const createMajor = (data) => api.post('/api/majors', data);
export const updateMajor = (id, data) => api.put(`/api/majors/${id}`, data);
export const deleteMajor = (id) => api.delete(`/api/majors/${id}`);