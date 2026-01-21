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
    <div className="bg-[#f9f9fb] rounded-xl p-5 md:p-6 mb-6 shadow-md">
      <h4 className="text-lg font-semibold mb-4">Create New Blog</h4>
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
            className={`w-full px-4 py-2 rounded-lg border transition-all disabled:opacity-50 ${
              errors.title
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-pink-500'
            } focus:outline-none focus:ring-2 focus:border-transparent`}
          />
          {errors.title && (
            <p className="text-red-600 text-sm mt-1">{errors.title}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">{title.length}/128 characters</p>
        </div>
        <div>
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Write your blog..."
            required
            rows={6}
            disabled={loading}
            className={`w-full px-4 py-2 rounded-lg border transition-all disabled:opacity-50 ${
              errors.content
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-pink-500'
            } focus:outline-none focus:ring-2 focus:border-transparent resize-y`}
          />
          {errors.content && (
            <p className="text-red-600 text-sm mt-1">{errors.content}</p>
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
