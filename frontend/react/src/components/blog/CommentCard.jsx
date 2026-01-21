import { escapeHtml } from '../../utils/escapeHtml';

// Comment Card component
// Replaces: comments.js HTML template for comment display

export function CommentCard({ comment }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-3">
      <p className="text-gray-800">{escapeHtml(comment.comment_content)}</p>
      {comment.created_at && (
        <p className="text-xs text-gray-500 mt-2">
          {new Date(comment.created_at).toLocaleString()}
        </p>
      )}
    </div>
  );
}
