/**
 * main.js
 * Wires room-nav buttons and nav links to doTransition()
 * Active nav highlight based on current room / scroll position
 * Guards: only runs when #room-stage exists (index.html)
 */

const stageEl = document.getElementById('room-stage');

if (stageEl) {

// ── ROOM NAV BUTTONS ───────────────────────────────
document.querySelectorAll('.room-nav[data-to]').forEach(btn => {
  btn.addEventListener('click', () => {
    doTransition(
      btn.dataset.to,
      btn.dataset.video,
      btn.dataset.reverse === 'true'
    );
  });
});

// ── NAV LINKS (data-room = direct room switch) ──────
document.querySelectorAll('[data-room]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId    = link.dataset.room;
    const targetPanel = document.getElementById(targetId);
    if (!targetPanel) return;

    const currentPanel = document.querySelector('.room-panel.is-active');
    if (currentPanel === targetPanel) {
      stageEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // If scrolled below stage, snap back first
    if (stageEl.getBoundingClientRect().bottom < 0) {
      stageEl.scrollIntoView({ behavior: 'instant' });
    }

    currentPanel.classList.remove('is-active');
    const stageBg = document.getElementById('stage-bg');
    if (targetPanel.dataset.bg) stageBg.src = targetPanel.dataset.bg;
    targetPanel.classList.add('is-active');
  });
});

// ── ACTIVE NAV HIGHLIGHT ────────────────────────────
function updateNavActive() {
  const navLinks    = document.querySelectorAll('.site-nav nav a');
  const stageBottom = stageEl.getBoundingClientRect().bottom;
  const inStage     = stageBottom > window.innerHeight * 0.5;

  navLinks.forEach(l => l.classList.remove('is-active'));

  if (inStage) {
    const activePanel = document.querySelector('.room-panel.is-active');
    navLinks.forEach(link => {
      if (link.dataset.room === activePanel?.id) link.classList.add('is-active');
    });
  } else {
    // "archive" has no #archive nav link — its menu item ("Obras") points
    // to complete-archive.html instead, so it needs its own href to match.
    const navHrefOverrides = { archive: 'complete-archive.html' };
    const sections = ['about', 'recognition', 'research', 'publications', 'archive', 'contact'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= 100 && rect.bottom > 100) {
        const href = navHrefOverrides[id] || `#${id}`;
        navLinks.forEach(l => {
          if (l.getAttribute('href') === href) l.classList.add('is-active');
        });
      }
    });
  }
}

window.addEventListener('scroll', updateNavActive, { passive: true });
updateNavActive();

// Re-run on room transition
const roomObserver = new MutationObserver(updateNavActive);
roomObserver.observe(stageEl, { subtree: true, attributeFilter: ['class'] });

} // end if (stageEl)
