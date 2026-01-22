/**
 * Normalize snake_case object keys to camelCase
 * Converts: { user_id: 1, first_name: 'John' } -> { userId: 1, firstName: 'John' }
 */
export function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Recursively convert object keys from snake_case to camelCase
 */
export function normalizeKeys(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => normalizeKeys(item));
  }

  if (typeof obj !== 'object') {
    return obj;
  }

  const normalized = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = snakeToCamel(key);
    normalized[camelKey] = normalizeKeys(value);
  }
  return normalized;
}

/**
 * Normalize blog object from backend response
 * Handles common blog fields: blog_id, blog_title, blog_content, created_at, like_count, comment_count
 */
export function normalizeBlog(blog) {
  if (!blog) return blog;
  return normalizeKeys(blog);
}

/**
 * Normalize comment object from backend response
 * Handles common comment fields: comment_id, comment_content, user_id, first_name, last_name, created_at
 */
export function normalizeComment(comment) {
  if (!comment) return comment;
  return normalizeKeys(comment);
}

/**
 * Normalize array of blogs
 */
export function normalizeBlogs(blogs) {
  if (!Array.isArray(blogs)) return blogs;
  return blogs.map(blog => normalizeBlog(blog));
}

/**
 * Normalize array of comments
 */
export function normalizeComments(comments) {
  if (!Array.isArray(comments)) return comments;
  return comments.map(comment => normalizeComment(comment));
}
