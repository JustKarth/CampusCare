import { Link } from 'react-router-dom';
import { safeContent } from '../../utils/escapeHtml';

// Blog Card component
// Replaces: blogs.js HTML template for blog list items

export function BlogCard({ blog, onLike, isLiked = false, isLiking = false }) {
  const snippet = String(blog.blogContent || '').slice(0, 140);
  const hasMore = blog.blogContent?.length > 140;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInHours < 1) {
      const diffInMins = Math.floor(diffInMs / (1000 * 60));
      return diffInMins <= 1 ? 'Just now' : `${diffInMins} minutes ago`;
    } else if (diffInHours < 24) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
      });
    }
  };

  // Get author name
  const getAuthorName = () => {
    if (blog.firstName && blog.lastName) {
      return `${blog.firstName} ${blog.lastName}`;
    } else if (blog.firstName) {
      return blog.firstName;
    } else if (blog.authorName) {
      return blog.authorName;
    } else if (blog.userName) {
      return blog.userName;
    }
    return 'Anonymous';
  };

  return (
    <div className="rounded-xl p-5 mb-4 transition-all duration-200 hover:scale-[1.005]"
      style={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.28)' }}>
      <h5
        className="text-base font-semibold mb-2"
        style={{ color: '#F8FAFC' }}
        dangerouslySetInnerHTML={{ __html: safeContent(blog.blogTitle) }}
      />

      {/* Author and timestamp */}
      <div className="flex items-center gap-3 mb-3 text-sm" style={{ color: '#94A3B8' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #38BDF8, #8B5CF6)' }}>
            {getAuthorName().charAt(0).toUpperCase()}
          </div>
          <span className="font-medium" style={{ color: '#7DD3FC' }}>{getAuthorName()}</span>
        </div>
        <span style={{ color: '#64748B' }}>•</span>
        <span>{formatDate(blog.createdAt)}</span>
      </div>

      <p
        className="text-sm mb-4"
        style={{ color: '#94A3B8', lineHeight: '1.6' }}
        dangerouslySetInnerHTML={{ __html: safeContent(snippet) + (hasMore ? '...' : '') }}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike(blog.blogId)}
            disabled={isLiking}
            className={`font-semibold transition-all duration-200 transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              isLiked
                ? 'text-rose-400 hover:text-rose-300'
                : 'text-pink-400 hover:text-pink-300'
            }`}
            title={isLiked ? 'Unlike' : 'Like'}
            aria-label={isLiked ? 'Unlike this blog' : 'Like this blog'}
          >
            {isLiking ? (
              <span className="inline-flex items-center gap-1">
                <span className="animate-spin text-sm">⏳</span>
                <span>{blog.likeCount || 0}</span>
              </span>
            ) : (
              <>
                <span className="inline-block transition-transform duration-200 hover:rotate-12">
                  {isLiked ? '❤️' : '🤍'}
                </span>
                <span className="ml-1">{blog.likeCount || 0}</span>
              </>
            )}
          </button>
          <span style={{ color: '#94A3B8' }}>{blog.commentCount || 0} comments</span>
        </div>
        <Link
          to={`/blogs/${blog.blogId}`}
          className="font-semibold transition-colors flex items-center gap-1"
          style={{ color: '#38BDF8' }}
          onMouseEnter={e => e.target.style.color = '#7DD3FC'}
          onMouseLeave={e => e.target.style.color = '#38BDF8'}
        >
          <span>Read more</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}
