import API from './axios';

export const createReservation = (reservationData) => {
  return API.post('/reservations', reservationData);
};

export const getUserReservations = (userId) => {
  return API.get(`/reservations/user/${userId}`);
};

export const getAllReservations = () => {
  return API.get('/reservations');
};

export const getReservationById = (id) => {
  return API.get(`/reservations/${id}`);
};

export const cancelReservation = (id) => {
  return API.put(`/reservations/${id}/cancel`);
};

export const updateReservationStatus = (id, status) => {
  return API.put(`/reservations/${id}/status`, null, { params: { status } });
};
