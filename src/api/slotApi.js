import API from './axios';

export const getAllSlots = (status, floor, facilityName, city) => {
  let params = {};
  if (status) params.status = status;
  if (floor) params.floor = floor;
  if (facilityName) params.facilityName = facilityName;
  if (city) params.city = city;
  return API.get('/slots', { params });
};

export const getSlotById = (id) => {
  return API.get(`/slots/${id}`);
};

export const createSlot = (slotData) => {
  return API.post('/slots', slotData);
};

export const updateSlot = (id, slotData) => {
  return API.put(`/slots/${id}`, slotData);
};

export const updateSlotStatus = (id, status) => {
  return API.put(`/slots/${id}/status`, null, { params: { status } });
};

export const deleteSlot = (id) => {
  return API.delete(`/slots/${id}`);
};

