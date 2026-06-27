// Category Filter component
// Replaces: local-guide.html category select + localGuide.js loadCategories()

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <select
        id="categorySelect"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="input-field"
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
        className="btn-primary text-sm"
      >
        Search
      </button>
    </div>
  );
}
