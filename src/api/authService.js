import axios from 'axios';
import { ENDPOINTS } from './endpoints';

const TOKEN_KEY = 'wc2026_jwt_token';

const rawClient = axios.create({
  baseURL: '/api',
});

/**
 * Registra un usuario nuevo o hace login si ya existe.
 * Guarda el JWT token en localStorage.
 */
async function registerAndLogin() {
  const email = import.meta.env.VITE_WC_API_EMAIL;
  const password = import.meta.env.VITE_WC_API_PASSWORD;

  try {
    // Intentar login primero
    const loginRes = await rawClient.post(ENDPOINTS.AUTH_LOGIN, { email, password });
    const token = loginRes.data.token;
    localStorage.setItem(TOKEN_KEY, token);
    return token;
  } catch (loginErr) {
    // Si falla (usuario no existe), registrar
    try {
      const registerRes = await rawClient.post(ENDPOINTS.AUTH_REGISTER, {
        name: 'FixtureApp',
        email,
        password,
      });
      const token = registerRes.data.token;
      localStorage.setItem(TOKEN_KEY, token);
      return token;
    } catch (registerErr) {
      console.error('Auth failed (register):', registerErr);
      throw registerErr;
    }
  }
}

/**
 * Obtiene el token actual de localStorage o fuerza un login.
 */
async function getToken() {
  let token = localStorage.getItem(TOKEN_KEY);
  if (token) return token;
  return registerAndLogin();
}

export { getToken, registerAndLogin };
