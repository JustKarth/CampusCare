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
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <textarea
        value={content}
        onChange={handleContentChange}
        placeholder="Write a comment..."
        required
        rows={4}
        disabled={loading}
        maxLength={VALIDATION.COMMENT_MAX_LENGTH}
        className={`w-full px-4 py-2 rounded-lg border resize-y mb-4 transition-all disabled:opacity-50 ${
          error
            ? 'border-red-300 focus:ring-red-500'
            : 'border-gray-300 focus:ring-pink-500'
        } focus:outline-none focus:ring-2 focus:border-transparent`}
      />
      <p className="text-gray-500 text-xs mb-4">{content.length}/{VALIDATION.COMMENT_MAX_LENGTH} characters</p>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 gradient-auth text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
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
