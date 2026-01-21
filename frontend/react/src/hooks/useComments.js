import { useState, useEffect } from 'react';
import { apiRequest } from '../services/apiClient';

// Comments data fetching hook
// Replaces: comments.js data fetching functions

export function useComments(blogId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    if (!blogId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest(`/blogs/${blogId}/comments`, 'GET');
      setComments(res.comments || []);
    } catch (err) {
      setError(err.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogId]);

  const createComment = async (comment_content) => {
    if (!blogId) return { success: false, error: 'Blog ID required' };
    setLoading(true);
    setError(null);
    try {
      await apiRequest(`/blogs/${blogId}/comments`, 'POST', { comment_content }, true);
      await fetchComments(); // Refresh comments
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to post comment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    comments,
    loading,
    error,
    createComment,
    refetch: fetchComments,
  };
}
