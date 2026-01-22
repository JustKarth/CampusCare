import { useState, useEffect } from 'react';
import { apiRequest } from '../services/apiClient';
<<<<<<< HEAD
=======
import { getToken } from '../services/authStorage';
import { normalizeBlog, normalizeBlogs } from '../utils/normalize';
>>>>>>> main

// Blog data fetching hook
// Replaces: blogs.js data fetching functions

export function useBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
<<<<<<< HEAD

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest('/blogs', 'GET');
      setBlogs(res.blogs || []);
=======
  const [likedBlogs, setLikedBlogs] = useState(new Set()); // Track which blogs are liked
  const [likingBlogs, setLikingBlogs] = useState(new Set()); // Track which blogs are currently being liked/unliked
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchBlogs = async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      // Pass token for optional auth to get personalized data (like status)
      const token = getToken();
      const url = `/blogs?page=${page}&limit=${limit}`;
      const res = await apiRequest(url, 'GET', null, token ? true : null);
      // Normalize blog data from snake_case to camelCase
      setBlogs(normalizeBlogs(res.blogs || []));
      
      // Update pagination info if provided by backend
      if (res.pagination) {
        setPagination({
          page: res.pagination.page || page,
          limit: res.pagination.limit || limit,
          total: res.pagination.total || res.blogs?.length || 0,
          totalPages: Math.ceil((res.pagination.total || res.blogs?.length || 0) / (res.pagination.limit || limit))
        });
      }
      
      // Fetch like status for each blog if user is authenticated
      // Note: This could be optimized if backend provides bulk like-status endpoint
      if (token && blogs.length > 0) {
        // Fetch like statuses in parallel
        // Note: blogs is already normalized, so use blogId (camelCase)
        const likeStatusPromises = blogs.map(async (blog) => {
          try {
            const statusRes = await apiRequest(`/blogs/${blog.blogId}/like-status`, 'GET', null, true);
            return { blogId: blog.blogId, hasLiked: statusRes.hasLiked || false };
          } catch {
            // If like-status endpoint fails, assume not liked
            return { blogId: blog.blogId, hasLiked: false };
          }
        });
        
        const statuses = await Promise.all(likeStatusPromises);
        const likedSet = new Set(statuses.filter(s => s.hasLiked).map(s => s.blogId));
        setLikedBlogs(likedSet);
      } else {
        setLikedBlogs(new Set());
      }
>>>>>>> main
    } catch (err) {
      setError(err.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
<<<<<<< HEAD
    fetchBlogs();
=======
    fetchBlogs(pagination.page, pagination.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
>>>>>>> main
  }, []);

  const createBlog = async (blog_title, blog_content) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest('/blogs', 'POST', { blog_title, blog_content }, true);
<<<<<<< HEAD
      await fetchBlogs(); // Refresh list
=======
      await fetchBlogs(pagination.page, pagination.limit); // Refresh list with current page
>>>>>>> main
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to create blog';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const likeBlog = async (blogId) => {
    try {
      await apiRequest(`/blogs/${blogId}/like`, 'POST', null, true);
      await fetchBlogs(); // Refresh to update like count
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to like blog' };
=======
  const toggleLike = async (blogId) => {
    const isLiked = likedBlogs.has(blogId);
    
    // Set loading state for this specific blog
    setLikingBlogs(prev => new Set(prev).add(blogId));
    
    try {
      if (isLiked) {
        // Unlike the blog
        await apiRequest(`/blogs/${blogId}/like`, 'DELETE', null, true);
        // Optimistically update UI
        setLikedBlogs(prev => {
          const newSet = new Set(prev);
          newSet.delete(blogId);
          return newSet;
        });
        // Update like count in blogs array (using camelCase)
        setBlogs(prev => prev.map(blog => 
          blog.blogId === blogId 
            ? { ...blog, likeCount: Math.max(0, (blog.likeCount || 0) - 1) }
            : blog
        ));
      } else {
        // Like the blog
        await apiRequest(`/blogs/${blogId}/like`, 'POST', null, true);
        // Optimistically update UI
        setLikedBlogs(prev => new Set(prev).add(blogId));
        // Update like count in blogs array (using camelCase)
        setBlogs(prev => prev.map(blog => 
          blog.blogId === blogId 
            ? { ...blog, likeCount: (blog.likeCount || 0) + 1 }
            : blog
        ));
      }
      
      return { success: true };
    } catch (err) {
      // On error, refresh to get accurate state
      await fetchBlogs(pagination.page, pagination.limit);
      return { success: false, error: err.message || 'Failed to toggle like' };
    } finally {
      // Clear loading state
      setLikingBlogs(prev => {
        const newSet = new Set(prev);
        newSet.delete(blogId);
        return newSet;
      });
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchBlogs(page, pagination.limit);
>>>>>>> main
    }
  };

  return {
    blogs,
    loading,
    error,
    createBlog,
<<<<<<< HEAD
    likeBlog,
    refetch: fetchBlogs,
=======
    likeBlog: toggleLike,
    likedBlogs,
    likingBlogs,
    pagination,
    goToPage,
    refetch: () => fetchBlogs(pagination.page, pagination.limit),
>>>>>>> main
  };
}

export function useBlog(blogId) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
<<<<<<< HEAD
=======
  const [hasLiked, setHasLiked] = useState(false);
  const [loadingLikeStatus, setLoadingLikeStatus] = useState(false);
>>>>>>> main

  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
<<<<<<< HEAD
        const res = await apiRequest(`/blogs/${blogId}`, 'GET');
        setBlog(res.blog);
=======
        // Pass token for optional auth to get personalized data
        const token = getToken();
        const res = await apiRequest(`/blogs/${blogId}`, 'GET', null, token ? true : null);
        // Normalize blog data from snake_case to camelCase
        setBlog(normalizeBlog(res.blog));
        
        // Fetch like status if user is authenticated
        if (token) {
          try {
            const statusRes = await apiRequest(`/blogs/${blogId}/like-status`, 'GET', null, true);
            setHasLiked(statusRes.hasLiked || false);
          } catch {
            setHasLiked(false);
          }
        } else {
          setHasLiked(false);
        }
>>>>>>> main
      } catch (err) {
        setError(err.message || 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

<<<<<<< HEAD
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
=======
  const toggleLike = async () => {
    if (!blogId) return;
    
    setLoadingLikeStatus(true);
    try {
      const wasLiked = hasLiked;
      
      if (wasLiked) {
        // Unlike the blog
        await apiRequest(`/blogs/${blogId}/like`, 'DELETE', null, true);
        setHasLiked(false);
        // Optimistically update like count (using camelCase)
        setBlog(prev => prev ? { ...prev, likeCount: Math.max(0, (prev.likeCount || 0) - 1) } : null);
      } else {
        // Like the blog
        await apiRequest(`/blogs/${blogId}/like`, 'POST', null, true);
        setHasLiked(true);
        // Optimistically update like count (using camelCase)
        setBlog(prev => prev ? { ...prev, likeCount: (prev.likeCount || 0) + 1 } : null);
      }
      
      return { success: true };
    } catch (err) {
      // On error, refresh to get accurate state
      const token = getToken();
      const res = await apiRequest(`/blogs/${blogId}`, 'GET', null, token ? true : null);
      setBlog(normalizeBlog(res.blog));
      if (token) {
        try {
          const statusRes = await apiRequest(`/blogs/${blogId}/like-status`, 'GET', null, true);
          setHasLiked(statusRes.hasLiked || false);
        } catch {
          setHasLiked(false);
        }
      }
      return { success: false, error: err.message || 'Failed to toggle like' };
    } finally {
      setLoadingLikeStatus(false);
>>>>>>> main
    }
  };

  return {
    blog,
    loading,
    error,
<<<<<<< HEAD
    likeBlog,
=======
    likeBlog: toggleLike,
    hasLiked,
    loadingLikeStatus,
>>>>>>> main
  };
}
