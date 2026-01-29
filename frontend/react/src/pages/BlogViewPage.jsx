import { useParams } from 'react-router-dom';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { useBlog } from '../hooks/useBlogs';
import { useComments } from '../hooks/useComments';
import { CommentCard } from '../components/blog/CommentCard';
import { CommentForm } from '../components/blog/CommentForm';
import { safeContent } from '../utils/escapeHtml';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';

// Blog View Page
// Replaces: blog-view.html + blogs.js loadBlogView() + comments.js

export function BlogViewPage() {
  const { id } = useParams();
  const { blog, loading: blogLoading, error: blogError, likeBlog, hasLiked, loadingLikeStatus } = useBlog(id);
  const { comments, loading: commentsLoading, error: commentsError, deleteComment, deletingComments } = useComments(id);

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
    if (!blog) return 'Anonymous';
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
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800" dangerouslySetInnerHTML={{ __html: safeContent(blog.blogTitle) }}></h3>
            
            {/* Author and timestamp */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {getAuthorName().charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{getAuthorName()}</div>
                  <div className="text-sm text-gray-500">{formatDate(blog.createdAt)}</div>
                </div>
              </div>
            </div>
            
            <div 
              className="text-gray-700 text-sm md:text-base leading-relaxed mb-4 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: safeContent(blog.blogContent) }}
            ></div>
            <div className="flex items-center gap-4 pt-4 border-t">
              <button
                onClick={likeBlog}
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
                <CommentCard 
                  key={comment.commentId || index} 
                  comment={comment} 
                  onDelete={deleteComment}
                  isDeleting={deletingComments?.has(comment.commentId) || false}
                />
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
