import { blogPosts } from '../data/index.js';

export function useBlogPosts() {
  return {
    blogPosts,
    loading: false,
    error: null,
  };
}
