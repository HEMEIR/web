export const AUTH_API_BASE = '/api';
export const FEATURE_API_BASE = '/feature-api';
export const CAMCEE_API_BASE = '/camcee-api';

export function authApi(path) {
  return `${AUTH_API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

export function featureApi(path) {
  return `${FEATURE_API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}

export function camceeApi(path) {
  return `${CAMCEE_API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}
