/**
 * publications.js — loads assets/data/publications.json and renders the
 * Publications bibliography list. verifiedSource is used only to decide
 * internal data-quality (never rendered) — every entry is shown as a
 * valid publication regardless of whether a cover image was matched.
 */

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function buildMeta(pub) {
  const parts = [];
  if (pub.year) parts.push(pub.year);
  let mediaPart = pub.media || '';
  if (pub.issue && pub.issue !== String(pub.year)) mediaPart += (mediaPart ? ', ' : '') + pub.issue;
  if (mediaPart) parts.push(mediaPart);
  return parts.join(' · ');
}

function buildSub(pub) {
  return [pub.pages, pub.publisher].filter(Boolean).join(' · ');
}

function renderPublications(pubs) {
  const list = document.getElementById('publications-list');
  if (!list) return;

  const html = pubs.map((pub) => {
    const hasCover = !!pub.coverImage;
    const meta = buildMeta(pub);
    const sub = buildSub(pub);
    const visual = hasCover
      ? `<div class="pub-entry__cover"><img src="${escapeHtml((document.documentElement.lang === 'en' ? '../' : '') + pub.coverImage)}" alt="" loading="lazy" width="76" height="101"></div>`
      : `<div class="pub-entry__mark" aria-hidden="true"></div>`;

    return `
      <article class="pub-entry">
        ${visual}
        <div class="pub-entry__body">
          ${meta ? `<p class="pub-entry__meta">${escapeHtml(meta)}</p>` : ''}
          <h3 class="pub-entry__title"${pub.titleTranslation ? ' lang="es"' : ''}>${escapeHtml(pub.title)}</h3>
          ${pub.titleTranslation ? `<p class="pub-entry__translation">${escapeHtml(pub.titleTranslation)}</p>` : ''}
          ${sub ? `<p class="pub-entry__sub">${escapeHtml(sub)}</p>` : ''}
        </div>
      </article>`;
  }).join('');

  list.innerHTML = html;

  // Publications loads asynchronously and is much taller than its
  // placeholder, so it pushes every section below it (Archive CTA,
  // Contact) further down the page. If the browser already performed
  // its native #hash scroll before this fetch resolved, that scroll
  // now lands on the wrong section — re-apply it once the real height
  // is in place.
  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  }
}

fetch(document.documentElement.lang === 'en' ? '../assets/data/publications.en.json' : 'assets/data/publications.json')
  .then((res) => {
    if (!res.ok) throw new Error('publications.json not found');
    return res.json();
  })
  .then(renderPublications)
  .catch((err) => {
    console.warn('Publications list unavailable:', err);
  });
