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
    <div
      className="rounded-2xl p-5 md:p-6 mb-6"
      style={{
        background: '#1a2235',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)'
      }}
    >
      <h4 className="text-lg font-bold mb-4" style={{ color: '#f0f4ff' }}>Create New Blog</h4>
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
            className={`w-full px-4 py-2.5 rounded-xl border transition-all disabled:opacity-50 text-sm outline-none ${
              errors.title
                ? 'border-red-400 focus:ring-red-400'
                : 'border-white/15 focus:ring-primary focus:border-transparent'
            } focus:ring-2`}
            style={{
              backgroundColor: '#151c2c',
              color: '#f0f4ff',
            }}
          />
          {errors.title && (
            <p className="text-red-400 text-xs mt-1">{errors.title}</p>
          )}
          <p className="text-xs mt-1" style={{ color: '#8b9ab5' }}>{title.length}/128 characters</p>
        </div>
        <div>
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Write your blog..."
            required
            rows={5}
            disabled={loading}
            className={`w-full px-4 py-2.5 rounded-xl border transition-all disabled:opacity-50 text-sm outline-none ${
              errors.content
                ? 'border-red-400 focus:ring-red-400'
                : 'border-white/15 focus:ring-primary focus:border-transparent'
            } focus:ring-2 resize-y`}
            style={{
              backgroundColor: '#151c2c',
              color: '#f0f4ff',
            }}
          />
          {errors.content && (
            <p className="text-red-400 text-xs mt-1">{errors.content}</p>
          )}
        </div>
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
            'Post Blog'
          )}
        </button>
      </form>
    </div>
  );
}
