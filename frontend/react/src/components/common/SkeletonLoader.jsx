// Skeleton loader component for better loading UX

export function SkeletonLoader({ variant = 'default', className = '' }) {
  const variants = {
    default: 'h-4 bg-gray-200 rounded animate-pulse',
    card: 'h-32 bg-gray-200 rounded-lg animate-pulse',
    text: 'h-4 bg-gray-200 rounded animate-pulse',
    avatar: 'w-12 h-12 bg-gray-200 rounded-full animate-pulse',
    button: 'h-10 w-24 bg-gray-200 rounded animate-pulse',
  };

  return <div className={`${variants[variant]} ${className}`} aria-hidden="true" />;
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-md mb-5 animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
      <div className="flex items-center gap-4 pt-3 border-t">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-24 ml-auto" />
      </div>
    </div>
  );
}

export function ResourceCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 mb-3 shadow-md animate-pulse">
      <div className="h-5 bg-gray-200 rounded mb-2 w-2/3" />
      <div className="h-4 bg-gray-200 rounded mb-3 w-full" />
      <div className="h-10 bg-gray-200 rounded w-32" />
    </div>
  );
}

export function PlaceCardSkeleton() {
  return (
    <div className="bg-white rounded-lg p-5 mb-4 shadow-md animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-2 w-1/2" />
      <div className="h-4 bg-gray-200 rounded mb-3 w-full" />
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
      <div className="h-8 bg-gray-200 rounded w-40" />
    </div>
  );
}
