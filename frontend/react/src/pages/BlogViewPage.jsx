import { useParams } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { useBlog } from '../hooks/useBlogs';
import { useComments } from '../hooks/useComments';
import { CommentCard } from '../components/blog/CommentCard';
import { CommentForm } from '../components/blog/CommentForm';
import { escapeHtml } from '../utils/escapeHtml';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';

// Blog View Page
// Replaces: blog-view.html + blogs.js loadBlogView() + comments.js

export function BlogViewPage() {
  const { id } = useParams();
  const { blog, loading: blogLoading, error: blogError, likeBlog } = useBlog(id);
  const { comments, loading: commentsLoading, error: commentsError } = useComments(id);

  if (blogLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <div className="card flex items-center justify-center min-h-[200px]">
              <LoadingSpinner size="lg" className="text-blue-600" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (blogError || !blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-4xl mx-auto">
            <ErrorMessage message={blogError || 'Blog not found'} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 p-6 md:p-10 fade-in">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl mb-6">Blog</h2>
          
          <div className="card mb-6 fade-in">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">{escapeHtml(blog.blog_title)}</h3>
            <p className="text-gray-700 whitespace-pre-wrap mb-4 text-sm md:text-base leading-relaxed">
              {escapeHtml(blog.blog_content)}
            </p>
            <div className="flex items-center gap-4 pt-4 border-t">
              <button
                onClick={likeBlog}
                className="text-pink-600 font-semibold hover:text-pink-700 transition-colors"
              >
                ❤️ {blog.like_count || 0}
              </button>
            </div>
          </div>

          <hr className="my-6" />

          <h3 className="text-lg md:text-xl mb-4">Comments</h3>

          <ErrorMessage message={commentsError} className="mb-4" />

          {commentsLoading ? (
            <div className="card flex items-center justify-center min-h-[100px] mb-6">
              <LoadingSpinner size="md" className="text-blue-600" />
            </div>
          ) : comments.length === 0 ? (
            <div className="card mb-6">
              <EmptyState message="No comments yet. Be the first to comment!" icon="💬" />
            </div>
          ) : (
            <div className="card mb-6 fade-in">
              {comments.map((comment, index) => (
                <CommentCard key={comment.comment_id || index} comment={comment} />
              ))}
            </div>
          )}

          <CommentForm blogId={id} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
