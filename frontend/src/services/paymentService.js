import api from './api';

export const getPayments = (params) => api.get('/payments', { params });

export const getPaymentById = (id) => api.get(`/payments/${id}`);

export const recordPayment = (data) => api.post('/payments', data);

export const deletePayment = (id) => api.delete(`/payments/${id}`);

