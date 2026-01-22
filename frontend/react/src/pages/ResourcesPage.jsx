import { useState } from 'react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { useResources } from '../hooks/useResources';
import { ResourceCard } from '../components/resources/ResourceCard';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from '../components/common/Pagination';
import { ResourceCardSkeleton } from '../components/common/SkeletonLoader';
import { useDebounce } from '../hooks/useDebounce';

// Resources Page
// Replaces: resources.html + resources.js

export function ResourcesPage() {
  const { resources, loading, error } = useResources();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    if (!debouncedSearch.trim()) return true;
    const searchLower = debouncedSearch.toLowerCase();
    const title = (resource.resource_title || '').toLowerCase();
    const desc = (resource.resource_description || '').toLowerCase();
    return title.includes(searchLower) || desc.includes(searchLower);
  });

  // Pagination
  const { paginatedItems, currentPage, totalPages, goToPage } = 
    usePagination(filteredResources, 10);

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 p-6 md:p-10 fade-in">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl mb-6">Academic Resources</h2>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search resources..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <ErrorMessage message={error} className="mb-6" />

          {loading ? (
            <div className="fade-in">
              {[...Array(3)].map((_, i) => (
                <ResourceCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="card">
              <EmptyState 
                message={resources.length === 0 
                  ? "No resources available at the moment." 
                  : `No resources found matching "${debouncedSearch}"`} 
                icon={resources.length === 0 ? "📚" : "🔍"} 
              />
            </div>
          ) : (
            <>
              <div className="fade-in">
                {paginatedItems.map((resource) => (
                  <ResourceCard key={resource.resource_id} resource={resource} />
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
