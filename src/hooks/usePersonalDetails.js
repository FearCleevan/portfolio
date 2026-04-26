import { personalDetails } from '../data/index.js';

export function usePersonalDetails() {
  return {
    personalDetails,
    loading: false,
    error: null,
  };
}
