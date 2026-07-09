/**
 * Central configuration for the API base URL.
 * Automatically uses the same hostname as the frontend, enabling access 
 * from localhost as well as network IP addresses sin depender de una IP fija.
 */
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:3000`;
  }
  return 'http://localhost:3000';
};

export const API_BASE_URL = getBaseUrl();
