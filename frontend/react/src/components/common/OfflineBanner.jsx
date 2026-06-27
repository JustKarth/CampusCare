import { useOffline } from '../../hooks/useOffline';

// Offline banner component
export function OfflineBanner() {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div className="bg-yellow-500/20 border-b border-yellow-500/30 text-yellow-400 px-4 py-2 text-center text-sm font-semibold backdrop-blur-glass">
      ⚠️ You are currently offline. Some features may not be available.
    </div>
  );
}
