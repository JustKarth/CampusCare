import { useState } from 'react';
import { useComments } from '../../hooks/useComments';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SuccessMessage } from '../common/SuccessMessage';
import { validateCommentForm } from '../../utils/validation';
import { VALIDATION } from '../../utils/constants';

// Comment Form component
// Replaces: blog-view.html comment form + comments.js submit handler

export function CommentForm({ blogId }) {
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { createComment, loading } = useComments(blogId);

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateCommentForm(content.trim());
    if (!validation.isValid) {
      setError(Object.values(validation.errors)[0]);
      return;
    }

    setError('');
    const result = await createComment(content.trim());
    if (result.success) {
      setContent('');
      setSuccess('Comment posted successfully!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <SuccessMessage message={success} onDismiss={() => setSuccess('')} className="mb-4" />
      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Write a comment..."
        required
        rows={4}
        disabled={loading}
        maxLength={VALIDATION.COMMENT_MAX_LENGTH}
        className={`input-field resize-y mb-4 ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : ''
        }`}
      />
      <p className="text-text-secondary text-xs mb-4">{content.length}/{VALIDATION.COMMENT_MAX_LENGTH} characters</p>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" className="text-white" />
            <span>Posting...</span>
          </>
        ) : (
          'Post Comment'
        )}
      </button>
    </form>
  );
}
