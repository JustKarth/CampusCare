import { useState, useEffect } from 'react';
import { apiRequest } from '../services/apiClient';
import { normalizeComments } from '../utils/normalize';

export function useComments(blogId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingComments, setDeletingComments] = useState(new Set());

  const fetchComments = async () => {
    if (!blogId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest(`/blogs/${blogId}/comments`, 'GET');
      setComments(normalizeComments(res.comments || []));
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
      await fetchComments();
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to post comment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    if (!commentId) return { success: false, error: 'Comment ID required' };

    setDeletingComments(prev => new Set(prev).add(commentId));

    try {
      await apiRequest(`/blogs/comments/${commentId}`, 'DELETE', null, true);
      setComments(prev => prev.filter(comment => comment.commentId !== commentId));
      return { success: true };
    } catch (err) {
      await fetchComments();
      return { success: false, error: err.message || 'Failed to delete comment' };
    } finally {
      setDeletingComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  return {
    comments,
    loading,
    error,
    createComment,
    deleteComment,
    deletingComments,
    refetch: fetchComments,
  };
}
