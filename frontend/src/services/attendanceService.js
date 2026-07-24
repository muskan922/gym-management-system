import api from './api';

export const getAttendanceByDate = (date) => api.get('/attendance', { params: { date } });

export const markAttendance = (data) => api.post('/attendance', data);

export const getMemberAttendanceHistory = (memberId) => api.get(`/attendance/member/${memberId}`);

export const getAttendanceStats = () => api.get('/attendance/stats');

