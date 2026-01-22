import { useState, useCallback } from 'react';

// Error boundary hook for functional components
export function useErrorBoundary() {
  const [error, setError] = useState(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const captureError = useCallback((error) => {
    setError(error);
    console.error('Error captured:', error);
  }, []);

  return { error, resetError, captureError };
}
