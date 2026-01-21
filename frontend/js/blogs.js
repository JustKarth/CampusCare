function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function loadBlogs() {
  const container =
    document.getElementById("blogList") ||
    document.getElementById("blogs");

  if (!container) return;

  try {
    const res = await apiRequest("/blogs", "GET");
    const blogs = res.blogs || [];

    if (!blogs.length) {
      container.innerHTML = "<p>No blogs yet.</p>";
      return;
    }

    container.innerHTML = blogs
      .map(blog => {
        const snippet = String(blog.blog_content || "").slice(0, 140);
        return `
          <div class="blog-card">
            <h5>${escapeHtml(blog.blog_title)}</h5>
            <p>${escapeHtml(snippet)}${blog.blog_content?.length > 140 ? "..." : ""}</p>
            <div class="blog-footer">
              <button class="like-btn" onclick="likeBlog(${blog.blog_id})">❤️ ${blog.like_count || 0}</button>
              <span>${blog.comment_count || 0} comments</span>
              <a href="blog-view.html?id=${blog.blog_id}">Read more</a>
            </div>
          </div>
        `;
      })
      .join("");
  } catch (e) {
    container.innerHTML = `<p>Failed to load blogs: ${escapeHtml(e.message)}</p>`;
  }
}

async function likeBlog(id) {
  try {
    await apiRequest(`/blogs/${id}/like`, "POST", null, true);
    await loadBlogs();
  } catch (e) {
    alert(e?.message || "Failed to like blog.");
  }
}

async function createBlogFromForm(formEl, titleEl, contentEl) {
  try {
    const blog_title = titleEl?.value?.trim();
    const blog_content = contentEl?.value?.trim();

    await apiRequest("/blogs", "POST", { blog_title, blog_content }, true);

    if (titleEl) titleEl.value = "";
    if (contentEl) contentEl.value = "";

    alert("Blog created.");
    await loadBlogs();
  } catch (e) {
    alert(e?.message || "Failed to create blog.");
  }
}

// blog.html (button-based create)
document.getElementById("postBlog")?.addEventListener("click", async () => {
  const titleEl = document.getElementById("blogTitle");
  const contentEl = document.getElementById("blogContent");
  await createBlogFromForm(null, titleEl, contentEl);
});

// create-blog.html (form-based create)
document.getElementById("blogForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const titleEl = document.getElementById("title");
  const contentEl = document.getElementById("content");
  await createBlogFromForm(e.target, titleEl, contentEl);
});

async function loadBlogView() {
  const blogId = getQueryParam("id");
  const host = document.getElementById("blogPost");
  if (!blogId || !host) return;

  try {
    const res = await apiRequest(`/blogs/${blogId}`, "GET");
    const b = res.blog || {};
    host.innerHTML = `
      <h3>${escapeHtml(b.blog_title)}</h3>
      <p>${escapeHtml(b.blog_content)}</p>
      <div class="blog-footer">
        <button class="like-btn" onclick="likeBlog(${b.blog_id})">❤️ ${b.like_count || 0}</button>
      </div>
    `;
  } catch (e) {
    host.innerHTML = `<p>Failed to load blog: ${escapeHtml(e.message)}</p>`;
  }
}

loadBlogs();
loadBlogView();
