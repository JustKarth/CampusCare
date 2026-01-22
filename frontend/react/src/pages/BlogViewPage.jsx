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
<<<<<<< HEAD
  const { blog, loading: blogLoading, error: blogError, likeBlog } = useBlog(id);
  const { comments, loading: commentsLoading, error: commentsError } = useComments(id);
=======
  const { blog, loading: blogLoading, error: blogError, likeBlog, hasLiked, loadingLikeStatus } = useBlog(id);
  const { comments, loading: commentsLoading, error: commentsError, deleteComment, deletingComments } = useComments(id);
>>>>>>> main

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
<<<<<<< HEAD
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">{escapeHtml(blog.blog_title)}</h3>
            <p className="text-gray-700 whitespace-pre-wrap mb-4 text-sm md:text-base leading-relaxed">
              {escapeHtml(blog.blog_content)}
=======
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">{escapeHtml(blog.blogTitle)}</h3>
            <p className="text-gray-700 whitespace-pre-wrap mb-4 text-sm md:text-base leading-relaxed">
              {escapeHtml(blog.blogContent)}
>>>>>>> main
            </p>
            <div className="flex items-center gap-4 pt-4 border-t">
              <button
                onClick={likeBlog}
<<<<<<< HEAD
                className="text-pink-600 font-semibold hover:text-pink-700 transition-colors"
              >
                ❤️ {blog.like_count || 0}
=======
                disabled={loadingLikeStatus}
                className={`font-semibold transition-all duration-200 transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  hasLiked 
                    ? 'text-red-600 hover:text-red-700' 
                    : 'text-pink-600 hover:text-pink-700'
                }`}
                title={hasLiked ? 'Unlike' : 'Like'}
                aria-label={hasLiked ? 'Unlike this blog' : 'Like this blog'}
              >
                {loadingLikeStatus ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    <span>{blog.likeCount || 0}</span>
                  </span>
                ) : (
                  <>
                    <span className="inline-block transition-transform duration-200 hover:rotate-12">
                      {hasLiked ? '❤️' : '🤍'}
                    </span>
                    <span className="ml-1">{blog.likeCount || 0}</span>
                  </>
                )}
>>>>>>> main
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
<<<<<<< HEAD
                <CommentCard key={comment.comment_id || index} comment={comment} />
=======
                <CommentCard 
                  key={comment.commentId || index} 
                  comment={comment} 
                  onDelete={deleteComment}
                  isDeleting={deletingComments?.has(comment.commentId) || false}
                />
>>>>>>> main
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
