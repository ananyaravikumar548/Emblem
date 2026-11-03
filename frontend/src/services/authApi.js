import { apiFetch } from '../services/api';

export async function logout() {
  return apiFetch('/auth/logout', { method: 'POST' });
}
