import { useState, useMemo } from 'react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { CreateBlogForm } from '../components/blog/CreateBlogForm';
import { BlogCard } from '../components/blog/BlogCard';
import { useBlogs } from '../hooks/useBlogs';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import { escapeHtml } from '../utils/escapeHtml';
import { SEO } from '../components/common/SEO';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from '../components/common/Pagination';
import { BlogCardSkeleton } from '../components/common/SkeletonLoader';

// Blogs Page
// Replaces: blog.html + blogs.js

export function BlogsPage() {
  const { blogs, loading, error, likeBlog, likedBlogs, likingBlogs, pagination, goToPage: goToBlogPage } = useBlogs();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Filter blogs based on search term (client-side filtering for search)
  const filteredBlogs = useMemo(() => {
    if (!debouncedSearch.trim()) return blogs;
    
    const searchLower = debouncedSearch.toLowerCase();
    return blogs.filter((blog) => {
      const title = escapeHtml(blog.blogTitle || '').toLowerCase();
      const content = escapeHtml(blog.blogContent || '').toLowerCase();
      return title.includes(searchLower) || content.includes(searchLower);
    });
  }, [blogs, debouncedSearch]);

  // Use server-side pagination if no search, otherwise use client-side pagination for search results
  const useServerPagination = !debouncedSearch.trim();
  const { paginatedItems, currentPage, totalPages, goToPage } = useServerPagination
    ? { 
        paginatedItems: blogs, 
        currentPage: pagination.page, 
        totalPages: pagination.totalPages, 
        goToPage: goToBlogPage 
      }
    : usePagination(filteredBlogs, 10);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Campus Blog" 
        description="Read and share blogs with your campus community"
        keywords="blog, campus, community, posts, articles"
      />
      <TopNav />
      <main className="flex-1 p-6 md:p-10 fade-in">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl md:text-2xl mb-6">Campus Blog</h3>
          
          <CreateBlogForm />

          <ErrorMessage message={error} className="mb-6" />

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blogs..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          {loading ? (
            <div className="fade-in">
              {[...Array(3)].map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="card">
              <EmptyState 
                message={blogs.length === 0 
                  ? "No blogs yet. Be the first to share!" 
                  : `No blogs found matching "${debouncedSearch}"`} 
                icon={blogs.length === 0 ? "📝" : "🔍"} 
              />
            </div>
          ) : (
            <>
              <div className="fade-in">
                {paginatedItems.map((blog) => (
                  <BlogCard 
                    key={blog.blogId} 
                    blog={blog} 
                    onLike={likeBlog}
                    isLiked={likedBlogs?.has(blog.blogId) || false}
                    isLiking={likingBlogs?.has(blog.blogId) || false}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
