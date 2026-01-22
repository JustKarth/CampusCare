import { useState, useEffect } from 'react';
import { apiRequest } from '../services/apiClient';
<<<<<<< HEAD
import { normalizeComments, normalizeComment } from '../utils/normalize';
=======
>>>>>>> ff2694566445899c4cc2ebfdcb384bb5034979c7

// Comments data fetching hook
// Replaces: comments.js data fetching functions

export function useComments(blogId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [deletingComments, setDeletingComments] = useState(new Set()); // Track which comments are being deleted
=======
>>>>>>> ff2694566445899c4cc2ebfdcb384bb5034979c7

  const fetchComments = async () => {
    if (!blogId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest(`/blogs/${blogId}/comments`, 'GET');
<<<<<<< HEAD
      // Normalize comment data from snake_case to camelCase
      setComments(normalizeComments(res.comments || []));
=======
      setComments(res.comments || []);
>>>>>>> ff2694566445899c4cc2ebfdcb384bb5034979c7
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

<<<<<<< HEAD
  const deleteComment = async (commentId) => {
    if (!commentId) return { success: false, error: 'Comment ID required' };
    
    // Set loading state for this specific comment
    setDeletingComments(prev => new Set(prev).add(commentId));
    
    try {
      // Backend route: DELETE /api/blogs/comments/:commentId
      await apiRequest(`/blogs/comments/${commentId}`, 'DELETE', null, true);
      // Optimistically remove comment from list (using camelCase)
      setComments(prev => prev.filter(comment => comment.commentId !== commentId));
      return { success: true };
    } catch (err) {
      // On error, refresh to get accurate state
      await fetchComments();
      return { success: false, error: err.message || 'Failed to delete comment' };
    } finally {
      // Clear loading state
      setDeletingComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

=======
>>>>>>> ff2694566445899c4cc2ebfdcb384bb5034979c7
  return {
    comments,
    loading,
    error,
    createComment,
<<<<<<< HEAD
    deleteComment,
    deletingComments,
=======
>>>>>>> ff2694566445899c4cc2ebfdcb384bb5034979c7
    refetch: fetchComments,
  };
}
