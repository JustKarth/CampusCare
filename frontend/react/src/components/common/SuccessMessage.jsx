import { useEffect, useState } from 'react';

// Success Message component (auto-dismisses after 3 seconds)

export function SuccessMessage({ message, onDismiss, className = '' }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (message && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, visible, onDismiss]);

  if (!message || !visible) return null;

  return (
    <div className={`bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm ${className}`}>
      {message}
    </div>
  );
}
