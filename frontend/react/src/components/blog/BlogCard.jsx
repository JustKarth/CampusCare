import { Link } from 'react-router-dom';
import { escapeHtml } from '../../utils/escapeHtml';

// Blog Card component
// Replaces: blogs.js HTML template for blog list items

<<<<<<< HEAD
export function BlogCard({ blog, onLike }) {
  const snippet = String(blog.blog_content || '').slice(0, 140);
  const hasMore = blog.blog_content?.length > 140;

  return (
    <div className="bg-white rounded-xl p-5 shadow-md mb-5 hover:shadow-lg transition-shadow fade-in">
      <h5 className="text-lg font-semibold mb-2 text-gray-800">{escapeHtml(blog.blog_title)}</h5>
=======
export function BlogCard({ blog, onLike, isLiked = false, isLiking = false }) {
  const snippet = String(blog.blogContent || '').slice(0, 140);
  const hasMore = blog.blogContent?.length > 140;

  return (
    <div className="bg-white rounded-xl p-5 shadow-md mb-5 hover:shadow-lg transition-all duration-200 fade-in">
      <h5 className="text-lg font-semibold mb-2 text-gray-800">{escapeHtml(blog.blogTitle)}</h5>
>>>>>>> main
      <p className="text-gray-600 text-sm mb-4">
        {escapeHtml(snippet)}
        {hasMore && '...'}
      </p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm pt-3 border-t">
        <div className="flex items-center gap-4">
          <button
<<<<<<< HEAD
            onClick={() => onLike(blog.blog_id)}
            className="text-pink-600 font-semibold hover:text-pink-700 transition-colors"
          >
            ❤️ {blog.like_count || 0}
          </button>
          <span className="text-gray-500">{blog.comment_count || 0} comments</span>
        </div>
        <Link
          to={`/blogs/${blog.blog_id}`}
=======
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
          <span className="text-gray-500">{blog.commentCount || 0} comments</span>
        </div>
        <Link
          to={`/blogs/${blog.blogId}`}
>>>>>>> main
          className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
}
