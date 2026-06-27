import { Link } from 'react-router-dom';
import { escapeHtml } from '../../utils/escapeHtml';

export function BlogCard({ blog, onLike, isLiked = false, isLiking = false }) {
  const snippet = String(blog.blogContent || '').slice(0, 140);
  const hasMore = blog.blogContent?.length > 140;

  return (
    <div className="bg-card rounded-card-lg p-5 shadow-card mb-5 hover:shadow-card-hover transition-all duration-300 fade-in border border-white/5">
      <h5 className="text-lg font-semibold mb-2 text-text-primary">{escapeHtml(blog.blogTitle)}</h5>
      <p className="text-text-secondary text-sm mb-4">
        {escapeHtml(snippet)}
        {hasMore && '...'}
      </p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm pt-3 border-t">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike(blog.blogId)}
            disabled={isLiking}
            className={`font-semibold transition-all duration-200 transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              isLiked 
                ? 'text-red-600 hover:text-red-700' 
                : 'text-pink-600 hover:text-pink-700'
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
          <span className="text-text-secondary">{blog.commentCount || 0} comments</span>
        </div>
        <Link
          to={`/blogs/${blog.blogId}`}
          className="text-primary hover:text-primary-light font-semibold transition-colors"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
}
