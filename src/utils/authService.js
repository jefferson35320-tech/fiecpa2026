import { jwtDecode } from "jwt-decode";
import api from "./axios";

// src/utils/authService.js
const USERS_KEY = 'smart_home_users';

const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerUser = async (nome, email, password, url_imagem) => {
  const res = await api.post("/users/cadastro",{nome, email, password, url_imagem})
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await api.post("/users/login",{email, password})
  console.log(res.data.token)
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