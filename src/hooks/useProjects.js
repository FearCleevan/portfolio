import { projects } from '../data/index.js';

export function useProjects() {
  return {
    projects,
    loading: false,
    error: null,
  };
}
