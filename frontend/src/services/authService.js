import api from './api';

export const loginUser = (email, password) => api.post('/auth/login', { email, password });

export const registerUser = (name, email, password, role) =>
  api.post('/auth/register', { name, email, password, role });

export const getMe = () => api.get('/auth/me');

export const updateProfile = (data) => api.put('/auth/update-profile', data);

export const changePassword = (currentPassword, newPassword) =>
  api.put('/auth/change-password', { currentPassword, newPassword });

