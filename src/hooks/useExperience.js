import { experience } from '../data/index.js';

export function useExperience() {
  return {
    experience,
    loading: false,
    error: null,
  };
}
