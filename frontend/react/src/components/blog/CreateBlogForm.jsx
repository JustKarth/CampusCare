import { useState } from 'react';
import { useBlogs } from '../../hooks/useBlogs';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SuccessMessage } from '../common/SuccessMessage';
import { validateBlogForm } from '../../utils/validation';

// Create Blog Form component
// Replaces: blog.html create section + blogs.js create handler

export function CreateBlogForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const { createBlog, loading } = useBlogs();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.title;
        return newErrors;
      });
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    if (errors.content) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.content;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateBlogForm(title.trim(), content.trim());
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const result = await createBlog(title.trim(), content.trim());
    if (result.success) {
      setTitle('');
      setContent('');
      setSuccess('Blog created successfully!');
    }
  };

  return (
    <div className="card mb-6">
      <h4 className="text-lg font-semibold mb-4 text-text-primary">Create New Blog</h4>
      <SuccessMessage message={success} onDismiss={() => setSuccess('')} className="mb-4" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Blog title"
            required
            disabled={loading}
            maxLength={128}
            className={`input-field ${
              errors.title
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : ''
            }`}
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title}</p>
          )}
          <p className="text-text-secondary text-xs mt-1">{title.length}/128 characters</p>
        </div>
        <div>
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Write your blog..."
            required
            rows={6}
            disabled={loading}
            className={`input-field resize-y ${
              errors.content
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : ''
            }`}
          />
          {errors.content && (
            <p className="text-red-400 text-sm mt-1">{errors.content}</p>
          )}
        </div>
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
            'Post Blog'
          )}
        </button>
      </form>
    </div>
  );
}
