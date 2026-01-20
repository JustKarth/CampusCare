const blogId = new URLSearchParams(window.location.search).get("id");

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function loadComments() {
  const container = document.getElementById("comments");
  if (!container || !blogId) return;

  try {
    const res = await apiRequest(`/blogs/${blogId}/comments`, "GET");
    const comments = res.comments || [];
    if (!comments.length) {
      container.innerHTML = "<p>No comments yet.</p>";
      return;
    }
    container.innerHTML = comments
      .map(c => `<p>${escapeHtml(c.comment_content)}</p>`)
      .join("");
  } catch (e) {
    container.innerHTML = `<p>Failed to load comments: ${escapeHtml(e.message)}</p>`;
  }
}

document.getElementById("commentForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  if (!blogId) return;

  const commentEl = document.getElementById("comment");
  const comment_content = commentEl?.value?.trim();

  try {
    await apiRequest(`/blogs/${blogId}/comments`, "POST", { comment_content }, true);
    if (commentEl) commentEl.value = "";
    await loadComments();
  } catch (e) {
    alert(e?.message || "Failed to post comment.");
  }
});

loadComments();
