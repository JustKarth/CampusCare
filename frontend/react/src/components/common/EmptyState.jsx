// Empty State component

export function EmptyState({ message, icon = '📭', className = '' }) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
}
