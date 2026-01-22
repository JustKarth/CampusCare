import { escapeHtml } from '../../utils/escapeHtml';
<<<<<<< HEAD
import { useAuth } from '../../context/AuthContext';
=======
>>>>>>> ff2694566445899c4cc2ebfdcb384bb5034979c7

// Comment Card component
// Replaces: comments.js HTML template for comment display

<<<<<<< HEAD
export function CommentCard({ comment, onDelete, isDeleting = false }) {
  const { user } = useAuth();
  // Use camelCase: comment.userId (normalized from user_id)
  const isOwner = user && comment.userId && user.userId === comment.userId;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      if (onDelete) {
        await onDelete(comment.commentId);
      }
    }
  };

  const authorName = comment.firstName && comment.lastName 
    ? `${escapeHtml(comment.firstName)} ${escapeHtml(comment.lastName)}`
    : comment.firstName 
    ? escapeHtml(comment.firstName)
    : 'Anonymous';

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-3 hover:bg-gray-100 transition-colors duration-200">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <div className="flex items-start gap-2 mb-2">
            {comment.avatarUrl && (
              <img 
                src={comment.avatarUrl} 
                alt={authorName}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-700">{authorName}</span>
                {isOwner && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">You</span>
                )}
              </div>
              <p className="text-gray-800 text-sm leading-relaxed">{escapeHtml(comment.commentContent)}</p>
            </div>
          </div>
          {comment.createdAt && (
            <p className="text-xs text-gray-500 mt-2">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          )}
        </div>
        {isOwner && onDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-sm font-semibold transition-all duration-200 px-2 py-1 rounded transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex-shrink-0"
            title="Delete comment"
            aria-label="Delete comment"
          >
            {isDeleting ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : (
              '🗑️'
            )}
          </button>
        )}
      </div>
=======
export function CommentCard({ comment }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-3">
      <p className="text-gray-800">{escapeHtml(comment.comment_content)}</p>
      {comment.created_at && (
        <p className="text-xs text-gray-500 mt-2">
          {new Date(comment.created_at).toLocaleString()}
        </p>
      )}
>>>>>>> ff2694566445899c4cc2ebfdcb384bb5034979c7
    </div>
  );
}
