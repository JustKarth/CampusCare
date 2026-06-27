// Skeleton loader component for better loading UX

export function SkeletonLoader({ variant = 'default', className = '' }) {
  const variants = {
    default: 'h-4 bg-card/50 rounded animate-pulse',
    card: 'h-32 bg-card/50 rounded-card animate-pulse',
    text: 'h-4 bg-card/50 rounded animate-pulse',
    avatar: 'w-12 h-12 bg-card/50 rounded-full animate-pulse',
    button: 'h-10 w-24 bg-card/50 rounded-card animate-pulse',
  };

  return <div className={`${variants[variant]} ${className}`} aria-hidden="true" />;
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-card rounded-card-lg p-5 shadow-card mb-5 animate-pulse border border-white/5">
      <div className="h-6 bg-card/50 rounded-card mb-3 w-3/4" />
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-card/50 rounded-card w-full" />
        <div className="h-4 bg-card/50 rounded-card w-5/6" />
        <div className="h-4 bg-card/50 rounded-card w-4/6" />
      </div>
      <div className="flex items-center gap-4 pt-3 border-t border-white/5">
        <div className="h-4 bg-card/50 rounded-card w-16" />
        <div className="h-4 bg-card/50 rounded-card w-20" />
        <div className="h-4 bg-card/50 rounded-card w-24 ml-auto" />
      </div>
    </div>
  );
}

export function ResourceCardSkeleton() {
  return (
    <div className="bg-card rounded-card p-4 mb-3 shadow-card animate-pulse border border-white/5">
      <div className="h-5 bg-card/50 rounded-card mb-2 w-2/3" />
      <div className="h-4 bg-card/50 rounded-card mb-3 w-full" />
      <div className="h-10 bg-card/50 rounded-card w-32" />
    </div>
  );
}

export function PlaceCardSkeleton() {
  return (
    <div className="bg-card rounded-card p-5 mb-4 shadow-card animate-pulse border border-white/5">
      <div className="h-6 bg-card/50 rounded-card mb-2 w-1/2" />
      <div className="h-4 bg-card/50 rounded-card mb-3 w-full" />
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-card/50 rounded-card w-1/3" />
        <div className="h-3 bg-card/50 rounded-card w-2/3" />
        <div className="h-3 bg-card/50 rounded-card w-1/4" />
      </div>
      <div className="h-8 bg-card/50 rounded-card w-40" />
    </div>
  );
}
