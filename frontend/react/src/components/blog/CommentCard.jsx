import { escapeHtml } from '../../utils/escapeHtml';
import { useAuth } from '../../context/AuthContext';

export function CommentCard({ comment, onDelete, isDeleting = false }) {
  const { user } = useAuth();
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
    <div className="bg-card/50 rounded-card p-4 mb-3 hover:bg-card/70 transition-colors duration-300 border border-white/5">
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
                <span className="text-sm font-semibold text-text-primary">{authorName}</span>
                {isOwner && (
                  <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">You</span>
                )}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">{escapeHtml(comment.commentContent)}</p>
            </div>
          </div>
          {comment.createdAt && (
            <p className="text-xs text-text-secondary mt-2">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          )}
        </div>
        {isOwner && onDelete && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm font-semibold transition-all duration-300 px-2 py-1 rounded-card transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex-shrink-0"
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
