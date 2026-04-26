import { skills } from '../data/index.js';

export function useSkills() {
  return {
    skills,
    loading: false,
    error: null,
  };
}
