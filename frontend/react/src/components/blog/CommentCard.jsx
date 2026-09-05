import { escapeHtml } from '../../utils/escapeHtml';
import { useAuth } from '../../context/AuthContext';

// Comment Card component
// Replaces: comments.js HTML template for comment display

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
    <div
      className="rounded-xl p-4 mb-3 transition-colors duration-200"
      style={{
        backgroundColor: '#151c2c',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
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
                <span className="text-sm font-semibold" style={{ color: '#c4b5fd' }}>{authorName}</span>
                {isOwner && (
                  <span className="text-xs text-primary bg-primary/20 border border-primary/30 px-2 py-0.5 rounded-full">You</span>
                )}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#f0f4ff' }}>{escapeHtml(comment.commentContent)}</p>
            </div>
          </div>
          {comment.createdAt && (
            <p className="text-xs mt-2" style={{ color: '#8b9ab5' }}>
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
    </div>
  );
}
