import { useState, useMemo, useEffect } from 'react';
import { BACKEND_URL } from '../../config/api';

/**
 * CollegeLogo Component
 * Scalable component to display college logos across the app.
 * Resolves logos dynamically from backend/public/colleges or frontend/public/colleges
 * with multi-extension and initial/icon fallback.
 */
export function CollegeLogo({
  collegeId,
  collegeName = '',
  emailDomain = '',
  size = 'sm',
  className = '',
  showFallbackText = false,
}) {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Compute potential slugs for the college
  const slugs = useMemo(() => {
    const list = [];

    // 1. Slug from emailDomain (e.g. "student@mnnit.ac.in" or "mnnit.ac.in" -> "mnnit")
    if (emailDomain) {
      const clean = emailDomain.split('@').pop().trim().toLowerCase();
      const prefix = clean.split('.')[0];
      if (prefix && !list.includes(prefix)) list.push(prefix);
      if (clean && !list.includes(clean)) list.push(clean);
    }

    // 2. Slug from collegeName (e.g. "Motilal Nehru National Institute of Technology Allahabad" or "MNNIT")
    if (collegeName) {
      const nameLower = collegeName.toLowerCase();
      if (nameLower.includes('mnnit') && !list.includes('mnnit')) list.push('mnnit');
      if (nameLower.includes('iit') || nameLower.includes('nit')) {
        const words = collegeName.split(/\s+/);
        const acronym = words.map(w => w[0]).join('').toLowerCase();
        if (acronym && !list.includes(acronym)) list.push(acronym);
      }
    }

    // 3. College ID (e.g. 1)
    if (collegeId) {
      const idStr = String(collegeId);
      if (!list.includes(idStr)) list.push(idStr);
    }

    // Default fallback
    if (!list.includes('mnnit')) list.push('mnnit');
    return list;
  }, [collegeId, collegeName, emailDomain]);

  // Build candidate URL list across extensions and paths
  const candidateUrls = useMemo(() => {
    const urls = [];
    const extensions = ['png', 'jpg', 'jpeg', 'svg', 'webp'];

    slugs.forEach(slug => {
      extensions.forEach(ext => {
        // Backend static path
        urls.push(`${BACKEND_URL}/colleges/${slug}.${ext}`);
        // Frontend public path
        urls.push(`/colleges/${slug}.${ext}`);
      });
    });

    return urls;
  }, [slugs]);

  // Reset candidates on college change
  useEffect(() => {
    setCandidateIndex(0);
    setHasLoaded(false);
  }, [collegeId, collegeName, emailDomain]);

  const currentUrl = candidateIndex < candidateUrls.length ? candidateUrls[candidateIndex] : null;

  const handleImageError = () => {
    setCandidateIndex(prev => prev + 1);
  };

  const handleImageLoad = () => {
    setHasLoaded(true);
  };

  // Size styling map
  const sizeClasses = {
    xs: 'w-4 h-4 text-[10px]',
    sm: 'w-6 h-6 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const dim = sizeClasses[size] || sizeClasses.sm;

  // Compute initials for fallback
  const initials = useMemo(() => {
    if (!collegeName) return '🏛️';
    const match = collegeName.match(/\b([A-Za-z])/g);
    return match ? match.slice(0, 3).join('').toUpperCase() : '🎓';
  }, [collegeName]);

  const hasCustomBg = className.includes('bg-');
  const hasCustomRounded = className.includes('rounded-');

  return (
    <div
      className={`inline-flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm transition-all ${dim} ${
        hasCustomBg ? '' : hasLoaded ? 'bg-white' : 'bg-white/20 backdrop-blur-sm'
      } ${hasCustomRounded ? '' : 'rounded-lg'} ${
        className.includes('border') ? '' : 'border border-white/20'
      } ${className}`}
      title={collegeName || 'College Logo'}
    >
      {currentUrl ? (
        <img
          key={currentUrl}
          src={currentUrl}
          alt={collegeName ? `${collegeName} logo` : 'College logo'}
          className={`w-full h-full object-contain p-1 transition-opacity duration-200 ${hasLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        <span className="font-bold select-none text-white/90 leading-none">
          {showFallbackText ? initials : '🎓'}
        </span>
      )}
    </div>
  );
}

