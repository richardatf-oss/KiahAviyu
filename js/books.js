(async () => {
  const grid = document.getElementById("books-grid");
  const pills = Array.from(document.querySelectorAll(".pill"));

  if (!grid) return;

  let data;
  try {
    const res = await fetch("/data/books.json", { cache: "no-store" });
    data = await res.json();
  } catch (e) {
    grid.innerHTML = `<div class="card"><p class="card-text">Could not load the catalog. Check <code>/data/books.json</code>.</p></div>`;
    return;
  }

  const books = Array.isArray(data?.books) ? data.books : [];

  function coverHtml(book) {
    // If cover URL provided, show image; otherwise show a restrained placeholder.
    if (book.cover && typeof book.cover === "string" && book.cover.trim().length > 0) {
      return `<img class="book-cover-img" src="${book.cover}" alt="Cover of ${escapeHtml(book.title || "book")}" loading="lazy">`;
    }
    return `<div class="book-cover-placeholder" aria-hidden="true"></div>`;
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function render(filter) {
    const filtered = (filter === "all")
      ? books
      : books.filter(b => (b.category || "") === filter);

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="card"><p class="card-text">No books in this category yet.</p></div>`;
      return;
    }

    grid.innerHTML = filtered.map(b => {
      const title = escapeHtml(b.title || "");
      const blurb = escapeHtml(b.blurb || "");
      const series = escapeHtml(b.series || "");
      const category = escapeHtml(b.category || "");
      const url = escapeHtml(b.amazon_url || "#");
      const format = escapeHtml(b.format_label || "Amazon");

      return `
        <article class="book-card">
          <div class="book-cover">
            ${coverHtml(b)}
          </div>
          <div class="book-meta">
            <div class="book-tags">
              <span class="tag">${category || "Book"}</span>
              ${series ? `<span class="tag subtle">${series}</span>` : ``}
            </div>
            <h2 class="book-title">${title}</h2>
            <p class="book-blurb">${blurb}</p>
            <div class="book-actions">
              <a class="btn small primary" href="${url}" target="_blank" rel="noopener">Amazon</a>
              <span class="muted book-format">${format}</span>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  function setActivePill(el) {
    pills.forEach(p => p.classList.remove("active"));
    el.classList.add("active");
  }

  pills.forEach(p => {
    p.addEventListener("click", () => {
      const f = p.getAttribute("data-filter") || "all";
      setActivePill(p);
      render(f);
    });
  });

  render("all");
})();
