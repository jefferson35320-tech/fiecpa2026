// src/utils/authService.js
const USERS_KEY = 'smart_home_users';

const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerUser = (name, email, password) => {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    throw new Error('E-mail já cadastrado');
  }
  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);
  saveUsers(users);
  return { id: newUser.id, name, email };
};

export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('E-mail ou senha inválidos');
  }
  sessionStorage.setItem('currentUser', JSON.stringify({ id: user.id, name: user.name, email: user.email }));
  return { id: user.id, name: user.name, email: user.email };
};

export const logoutUser = () => {
  sessionStorage.removeItem('currentUser');
};

export const getCurrentUser = () => {
  const user = sessionStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};