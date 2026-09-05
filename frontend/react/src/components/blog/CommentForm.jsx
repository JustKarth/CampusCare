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
        rows={3}
        disabled={loading}
        maxLength={VALIDATION.COMMENT_MAX_LENGTH}
        className={`w-full px-4 py-2.5 rounded-xl border resize-y mb-3 transition-all disabled:opacity-50 text-sm outline-none ${
          error
            ? 'border-red-400 focus:ring-red-400'
            : 'border-white/15 focus:ring-primary focus:border-transparent'
        } focus:ring-2`}
        style={{
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
        }}
      />
      <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>{content.length}/{VALIDATION.COMMENT_MAX_LENGTH} characters</p>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 text-white rounded-xl font-semibold shadow-md shadow-sky-500/20 hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
        style={{ background: 'linear-gradient(135deg, #38BDF8 0%, #8B5CF6 100%)' }}
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
