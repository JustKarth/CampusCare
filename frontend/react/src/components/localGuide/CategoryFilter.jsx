// Category Filter component
// Replaces: local-guide.html category select + localGuide.js loadCategories()

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <select
        id="categorySelect"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.category_name} value={cat.category_name}>
            {cat.category_name.charAt(0).toUpperCase() + cat.category_name.slice(1)}
          </option>
        ))}
      </select>
      <button
        onClick={() => onCategoryChange(selectedCategory)}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
    </div>
  );
}
