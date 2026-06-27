// Error Message component

export function ErrorMessage({ message, className = '' }) {
  if (!message) return null;

  return (
    <div className={`bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-card text-sm whitespace-pre-line ${className}`}>
      {message}
    </div>
  );
}
