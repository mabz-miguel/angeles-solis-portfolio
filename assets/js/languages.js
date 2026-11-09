/** Keep language links shareable and preserve the current project, gallery and anchor. */
(function () {
  'use strict';
  const links = document.querySelectorAll('[data-language]');
  function updateLanguageLinks() {
    links.forEach(link => {
      const url = new URL(link.getAttribute('href'), location.href);
      url.search = location.search;
      url.hash = location.hash;
      const activeRoom = document.querySelector('.room-panel.is-active');
      if (activeRoom) {
        const room = { 'rp-vaciados': 'vaciados', 'rp-pintura': 'pintura' }[activeRoom.id];
        if (room) url.searchParams.set('room', room);
        else url.searchParams.delete('room');
      }
      link.href = url.href;
    });
  }
  updateLanguageLinks();
  window.addEventListener('hashchange', updateLanguageLinks);
  links.forEach(link => {
    link.addEventListener('pointerdown', updateLanguageLinks);
    link.addEventListener('focus', updateLanguageLinks);
    link.addEventListener('click', updateLanguageLinks);
  });
  const stage = document.getElementById('room-stage');
  if (stage) new MutationObserver(updateLanguageLinks).observe(stage, {
    subtree: true, attributes: true, attributeFilter: ['class']
  });
})();
