import { useState, useEffect } from 'react';
import { apiRequest } from '../services/apiClient';

// Blog data fetching hook
// Replaces: blogs.js data fetching functions

export function useBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest('/blogs', 'GET');
      setBlogs(res.blogs || []);
    } catch (err) {
      setError(err.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const createBlog = async (blog_title, blog_content) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest('/blogs', 'POST', { blog_title, blog_content }, true);
      await fetchBlogs(); // Refresh list
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to create blog';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const likeBlog = async (blogId) => {
    try {
      await apiRequest(`/blogs/${blogId}/like`, 'POST', null, true);
      await fetchBlogs(); // Refresh to update like count
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to like blog' };
    }
  };

  return {
    blogs,
    loading,
    error,
    createBlog,
    likeBlog,
    refetch: fetchBlogs,
  };
}

export function useBlog(blogId) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest(`/blogs/${blogId}`, 'GET');
        setBlog(res.blog);
      } catch (err) {
        setError(err.message || 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const likeBlog = async () => {
    if (!blogId) return;
    try {
      await apiRequest(`/blogs/${blogId}/like`, 'POST', null, true);
      // Refresh blog to update like count
      const res = await apiRequest(`/blogs/${blogId}`, 'GET');
      setBlog(res.blog);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to like blog' };
    }
  };

  return {
    blog,
    loading,
    error,
    likeBlog,
  };
}
