import api from "./axios";

// src/utils/authService.js


export const registerDevice = async (tipo, porta, userId) => {
  const res = await api.post("/devices/",{tipo, porta, userId})
  return res.data;
};

export const getDevices = async () => {
  const res = await api.get("/devices/")
  console.log(res.data.dispositivos)
  return res.data.dispositivos;
};

export const updateDevice = async (device, id) => {
  const res = await api.put("/devices/"+id,{tipo: device.tipo, porta: device.porta, valor: device.valor})
  return res.data;
};

export const deleteDevice = async (id) => {
  const res = await api.delete("/devices/"+id)
  return res.data;
};

export const logoutUser = () => {
  sessionStorage.removeItem('currentUser');
};

export const getCurrentUser = () => {
  const user = sessionStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};