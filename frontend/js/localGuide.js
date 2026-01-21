function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

function buildPlacesEndpoint(category) {
  const user = getStoredUser();
  const base = category
    ? `/local-guide/places/${encodeURIComponent(category)}`
    : "/local-guide/places";

  // If logged in, backend can infer collegeId from token,
  // otherwise fall back to default collegeId=1.
  if (user?.collegeId) {
    return base;
  }
  return `${base}?collegeId=1`;
}

async function loadCategories() {
  const select = document.getElementById("categorySelect");
  if (!select) return;

  try {
    const res = await apiRequest("/local-guide/categories", "GET");
    const categories = res.categories || [];

    // Preserve the "All Categories" option
    const keepFirst = select.querySelector("option[value='']");
    select.innerHTML = "";
    if (keepFirst) select.appendChild(keepFirst);

    categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat.category_name;
      opt.textContent =
        cat.category_name.charAt(0).toUpperCase() +
        cat.category_name.slice(1);
      select.appendChild(opt);
    });
  } catch (e) {
    // Categories are optional for basic functionality; safe to log
    console.error("Failed to load categories:", e);
  }
}

async function loadPlaces(category = "") {
  const container = document.getElementById("places");
  if (!container) return;

  const endpoint = buildPlacesEndpoint(category);

  try {
    const res = await apiRequest(endpoint, "GET");
    const places = res.places || [];

    if (!places.length) {
      container.innerHTML = "<p>No places found.</p>";
      return;
    }

    container.innerHTML = places
      .map(p => `
        <article class="place-card">
          <h4>${escapeHtml(p.place_name)}</h4>
          ${p.place_description ? `<p>${escapeHtml(p.place_description)}</p>` : ""}
          <p><strong>Category:</strong> ${escapeHtml(p.category_name)}</p>
          ${p.address ? `<p><strong>Address:</strong> ${escapeHtml(p.address)}</p>` : ""}
          ${
            p.distance != null
              ? `<p><strong>Distance:</strong> ${escapeHtml(p.distance)} km</p>`
              : ""
          }
          ${
            p.website
              ? `<p><a href="${escapeHtml(p.website)}" target="_blank" rel="noopener noreferrer">Website</a></p>`
              : ""
          }
          ${
            p.phone
              ? `<p><strong>Phone:</strong> ${escapeHtml(p.phone)}</p>`
              : ""
          }
          <p><strong>Rating:</strong> ${
            p.average_rating != null ? Number(p.average_rating).toFixed(1) : "No ratings"
          } (${p.rating_count || 0})</p>
          <div class="rating-controls">
            <label>Rate this place:
              <select data-place-id="${p.place_id}" class="rating-select">
                <option value="">Select</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </label>
            <button type="button" onclick="submitRating(${p.place_id})">Submit</button>
          </div>
        </article>
      `)
      .join("");
  } catch (e) {
    container.innerHTML = `<p>Failed to load places: ${escapeHtml(e.message)}</p>`;
  }
}

async function submitRating(placeId) {
  // Must be a logged-in student
  const token = requireAuth("index.html");
  if (!token) {
    alert("Please login to submit a rating. (Guest browsing enabled.)");
    return;
  }

  const select = document.querySelector(
    `.rating-select[data-place-id="${placeId}"]`
  );
  const rating = select?.value ? parseInt(select.value, 10) : null;

  if (!rating || rating < 1 || rating > 5) {
    alert("Please select a rating between 1 and 5.");
    return;
  }

  try {
    await apiRequest(
      `/local-guide/places/${placeId}/rating`,
      "POST",
      { rating },
      true
    );
    alert("Rating submitted.");
    await loadPlaces(document.getElementById("categorySelect")?.value || "");
  } catch (e) {
    alert(e?.message || "Failed to submit rating.");
  }
}

function filterPlaces() {
  const category = document.getElementById("categorySelect")?.value || "";
  loadPlaces(category);
}

// Initialize page
loadCategories();
loadPlaces();
