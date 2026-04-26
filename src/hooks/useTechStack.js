import { techStack } from '../data/index.js';

export function useTechStack() {
  return {
    techStack,
    loading: false,
    error: null,
  };
}
