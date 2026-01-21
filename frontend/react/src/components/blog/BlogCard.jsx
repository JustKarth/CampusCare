import { Link } from 'react-router-dom';
import { escapeHtml } from '../../utils/escapeHtml';

// Blog Card component
// Replaces: blogs.js HTML template for blog list items

export function BlogCard({ blog, onLike }) {
  const snippet = String(blog.blog_content || '').slice(0, 140);
  const hasMore = blog.blog_content?.length > 140;

  return (
    <div className="bg-white rounded-xl p-5 shadow-md mb-5 hover:shadow-lg transition-shadow fade-in">
      <h5 className="text-lg font-semibold mb-2 text-gray-800">{escapeHtml(blog.blog_title)}</h5>
      <p className="text-gray-600 text-sm mb-4">
        {escapeHtml(snippet)}
        {hasMore && '...'}
      </p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm pt-3 border-t">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike(blog.blog_id)}
            className="text-pink-600 font-semibold hover:text-pink-700 transition-colors"
          >
            ❤️ {blog.like_count || 0}
          </button>
          <span className="text-gray-500">{blog.comment_count || 0} comments</span>
        </div>
        <Link
          to={`/blogs/${blog.blog_id}`}
          className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
}
