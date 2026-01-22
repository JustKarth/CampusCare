import { useOffline } from '../../hooks/useOffline';

// Offline banner component
export function OfflineBanner() {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div className="bg-yellow-500 text-white px-4 py-2 text-center text-sm font-semibold">
      ⚠️ You are currently offline. Some features may not be available.
    </div>
  );
}
