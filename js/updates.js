(async () => {
  const list = document.getElementById("updates-list");
  if (!list) return;

  let data;
  try {
    const res = await fetch("/data/updates.json", { cache: "no-store" });
    data = await res.json();
  } catch (e) {
    list.innerHTML = `<div class="card"><p class="card-text">Could not load updates. Check <code>/data/updates.json</code>.</p></div>`;
    return;
  }

  const updates = Array.isArray(data?.updates) ? data.updates : [];

  function escapeHtml(s) {
    return String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  if (updates.length === 0) {
    list.innerHTML = `<div class="card"><p class="card-text">No updates yet.</p></div>`;
    return;
  }

  list.innerHTML = updates.map(u => {
    const date = escapeHtml(u.date || "");
    const title = escapeHtml(u.title || "");
    const body = escapeHtml(u.body || "");
    return `
      <article class="update-card">
        <div class="update-top">
          <div class="update-title">${title}</div>
          <div class="update-date muted">${date}</div>
        </div>
        <p class="update-body">${body}</p>
      </article>
    `;
  }).join("");
})();
