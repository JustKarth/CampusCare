// HTML escaping utility
// Used in: blogs.js, comments.js, resources.js, localGuide.js

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Safe content display function that preserves quotes and formatting
export function safeContent(str) {
  if (!str) return '';
  
  // Only escape dangerous HTML tags, preserve quotes and basic formatting
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Function to render content with proper line breaks and quotes preserved
export function renderContent(str) {
  if (!str) return '';
  
  // Escape dangerous HTML but preserve quotes
  const escaped = String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Convert line breaks to <br> for proper display
  return escaped.replace(/\n/g, '<br>');
}
