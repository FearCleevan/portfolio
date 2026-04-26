import { certifications } from '../data/index.js';

export function useCertifications() {
  return {
    certifications,
    loading: false,
    error: null,
  };
}
