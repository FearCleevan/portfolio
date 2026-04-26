import { education } from '../data/index.js';

export function useEducation() {
  return {
    education,
    loading: false,
    error: null,
  };
}
