import { useState, useEffect } from 'react';
import { apiRequest } from '../services/apiClient';
import { getToken } from '../services/authStorage';
import { normalizeBlog, normalizeBlogs } from '../utils/normalize';

export function useBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [likedBlogs, setLikedBlogs] = useState(new Set());
  const [likingBlogs, setLikingBlogs] = useState(new Set());
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
      const token = getToken();
      const url = `/blogs?page=${page}&limit=${limit}`;
      const res = await apiRequest(url, 'GET', null, token ? true : null);
      const normalizedBlogs = normalizeBlogs(res.blogs || []);
      setBlogs(normalizedBlogs);

      if (res.pagination) {
        setPagination({
          page: res.pagination.page || page,
          limit: res.pagination.limit || limit,
          total: res.pagination.total || res.blogs?.length || 0,
          totalPages: Math.ceil((res.pagination.total || res.blogs?.length || 0) / (res.pagination.limit || limit))
        });
      }

      if (token && normalizedBlogs.length > 0) {
        const likeStatusPromises = normalizedBlogs.map(async (blog) => {
          try {
            const statusRes = await apiRequest(`/blogs/${blog.blogId}/like-status`, 'GET', null, true);
            return { blogId: blog.blogId, hasLiked: statusRes.hasLiked || false };
          } catch {
            return { blogId: blog.blogId, hasLiked: false };
          }
        });

        const statuses = await Promise.all(likeStatusPromises);
        const likedSet = new Set(statuses.filter(s => s.hasLiked).map(s => s.blogId));
        setLikedBlogs(likedSet);
      } else {
        setLikedBlogs(new Set());
      }
    } catch (err) {
      setError(err.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(pagination.page, pagination.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createBlog = async (blog_title, blog_content) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest('/blogs', 'POST', { blog_title, blog_content }, true);
      await fetchBlogs(pagination.page, pagination.limit);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Failed to create blog';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (blogId) => {
    const isLiked = likedBlogs.has(blogId);

    setLikingBlogs(prev => new Set(prev).add(blogId));

    try {
      if (isLiked) {
        await apiRequest(`/blogs/${blogId}/like`, 'DELETE', null, true);
        setLikedBlogs(prev => {
          const newSet = new Set(prev);
          newSet.delete(blogId);
          return newSet;
        });
        setBlogs(prev => prev.map(blog =>
          blog.blogId === blogId
            ? { ...blog, likeCount: Math.max(0, (blog.likeCount || 0) - 1) }
            : blog
        ));
      } else {
        await apiRequest(`/blogs/${blogId}/like`, 'POST', null, true);
        setLikedBlogs(prev => new Set(prev).add(blogId));
        setBlogs(prev => prev.map(blog =>
          blog.blogId === blogId
            ? { ...blog, likeCount: (blog.likeCount || 0) + 1 }
            : blog
        ));
      }

      return { success: true };
    } catch (err) {
      await fetchBlogs(pagination.page, pagination.limit);
      return { success: false, error: err.message || 'Failed to toggle like' };
    } finally {
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
    }
  };

  return {
    blogs,
    loading,
    error,
    createBlog,
    likeBlog: toggleLike,
    likedBlogs,
    likingBlogs,
    pagination,
    goToPage,
    refetch: () => fetchBlogs(pagination.page, pagination.limit),
  };
}

export function useBlog(blogId) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [loadingLikeStatus, setLoadingLikeStatus] = useState(false);

  useEffect(() => {
    if (!blogId) return;

    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
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
        } else {
          setHasLiked(false);
        }
      } catch (err) {
        setError(err.message || 'Failed to load blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const toggleLike = async () => {
    if (!blogId) return;

    setLoadingLikeStatus(true);
    try {
      const wasLiked = hasLiked;

      if (wasLiked) {
        await apiRequest(`/blogs/${blogId}/like`, 'DELETE', null, true);
        setHasLiked(false);
        setBlog(prev => prev ? { ...prev, likeCount: Math.max(0, (prev.likeCount || 0) - 1) } : null);
      } else {
        await apiRequest(`/blogs/${blogId}/like`, 'POST', null, true);
        setHasLiked(true);
        setBlog(prev => prev ? { ...prev, likeCount: (prev.likeCount || 0) + 1 } : null);
      }

      return { success: true };
    } catch (err) {
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
    }
  };

  return {
    blog,
    loading,
    error,
    likeBlog: toggleLike,
    hasLiked,
    loadingLikeStatus,
  };
}
