import { createContext, useCallback, useContext, useRef, useState } from 'react';

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [routeLabel, setRouteLabel] = useState('');
  // counter prevents flicker when multiple callers overlap
  const counter = useRef(0);

  const startLoading = useCallback((label = '') => {
    counter.current += 1;
    setRouteLabel(label);
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    counter.current = Math.max(0, counter.current - 1);
    if (counter.current === 0) setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, routeLabel, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error('useLoading must be used inside LoadingProvider');
  return ctx;
}
