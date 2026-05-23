import api from "./axios";

// src/utils/authService.js


export const registerDevice = async (tipo, porta, userId) => {
  const res = await api.post("/devices/",{tipo, porta, userId})
  return res.data;
};

export const getDevices = async () => {
  const res = await api.get("/devices/")
  console.log(res.data.dispostivos)
  const token = res.data.token;
  return token;
};

export const logoutUser = () => {
  sessionStorage.removeItem('currentUser');
};

export const getCurrentUser = () => {
  const user = sessionStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};