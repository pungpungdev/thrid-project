import api from '../api/axios';

export const getStudentTransfers = () => api.get('/api/student-transfers');
export const getStudentTransfer = (id) => api.get(`/api/student-transfers/${id}`);
export const createStudentTransfer = (data) => api.post('/api/student-transfers', data);
export const updateStudentTransfer = (id, data) => api.put(`/api/student-transfers/${id}`, data);
export const deleteStudentTransfer = (id) => api.delete(`/api/student-transfers/${id}`);
export const activateStudentTransfer = (id) => api.put(`/api/student-transfers/active/${id}`);
export const getInactiveStudentTransfers = () => api.get('/api/student-transfers/inactive');