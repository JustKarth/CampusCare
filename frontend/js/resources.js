function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function loadResources() {
  // Require student login (GET /api/resources is auth-only)
  const token = requireAuth("index.html");
  if (!token) return;

  const container = document.getElementById("resources");
  if (!container) return;

  try {
    const res = await apiRequest("/resources", "GET", null, true);
    const resources = res.resources || [];

    if (!resources.length) {
      container.innerHTML = "<p>No resources available.</p>";
      return;
    }

    container.innerHTML = resources
      .map(r => `
        <article class="resource-card">
          <h4>${escapeHtml(r.resource_title)}</h4>
          ${r.resource_description ? `<p>${escapeHtml(r.resource_description)}</p>` : ""}
          <a href="${escapeHtml(r.resource_link)}" target="_blank" rel="noopener noreferrer">
            Open resource
          </a>
        </article>
      `)
      .join("");
  } catch (e) {
    if (e?.status === 401) {
      logout("index.html");
      return;
    }
    container.innerHTML = `<p>Failed to load resources: ${escapeHtml(e.message)}</p>`;
  }
}

// Auto-load when script runs
loadResources();
