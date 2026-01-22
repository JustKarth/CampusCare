import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { useLocalGuide } from '../hooks/useLocalGuide';
import { CategoryFilter } from '../components/localGuide/CategoryFilter';
import { PlaceCard } from '../components/localGuide/PlaceCard';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { usePagination } from '../hooks/usePagination';
import { Pagination } from '../components/common/Pagination';
import { PlaceCardSkeleton } from '../components/common/SkeletonLoader';

// Local Guide Page
// Replaces: local-guide.html + localGuide.js

export function LocalGuidePage() {
  const {
    categories,
    places,
    selectedCategory,
    setSelectedCategory,
    loading,
    error,
    submitRating,
  } = useLocalGuide();

  // Pagination
  const { paginatedItems, currentPage, totalPages, goToPage } = 
    usePagination(places, 10);

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1 p-6 md:p-10 fade-in">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl mb-6">Local Guide</h2>

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <ErrorMessage message={error} className="mb-6" />

          {loading ? (
            <div className="fade-in">
              {[...Array(3)].map((_, i) => (
                <PlaceCardSkeleton key={i} />
              ))}
            </div>
          ) : places.length === 0 ? (
            <div className="card">
              <EmptyState message="No places found for this category." icon="📍" />
            </div>
          ) : (
            <>
              <div className="fade-in">
                {paginatedItems.map((place) => (
                  <PlaceCard key={place.place_id} place={place} onSubmitRating={submitRating} />
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
