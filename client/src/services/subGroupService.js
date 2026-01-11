import api from '../api/axios';

export const getSubGroups = () => api.get('/api/sub-groups');