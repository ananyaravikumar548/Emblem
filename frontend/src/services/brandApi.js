import { apiFetch } from '../services/api';

export async function fetchBrands() {
  return apiFetch('/brand');
}

export async function fetchBrandById(id) {
  return apiFetch(`/brand/${id}`);
}

export async function generateBrandAssets(id) {
  return apiFetch(`/brand/${id}/generate`, { method: 'POST' });
}

export async function fetchConsistency(id) {
  return apiFetch(`/brand/${id}/consistency`);
}

export async function deleteBrand(id) {
  return apiFetch(`/brand/${id}`, { method: 'DELETE' });
}
