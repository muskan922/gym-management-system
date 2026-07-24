import api from './api';

export const getTrainers = () => api.get('/trainers');

export const getTrainerById = (id) => api.get(`/trainers/${id}`);

export const createTrainer = (data) => api.post('/trainers', data);

export const updateTrainer = (id, data) => api.put(`/trainers/${id}`, data);

export const deleteTrainer = (id) => api.delete(`/trainers/${id}`);

