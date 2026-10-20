// Scenario list and panels on How it works pages: click, arrow keys and #c01 deep links.
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.scen-btn'));
  function select(id, focus, push) {
    var found = false;
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-id') === id;
      if (on) found = true;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      if (on && focus) t.focus();
      if (on) t.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
    if (found && push) { try { history.replaceState(null, '', '#' + id); } catch (e) {} }
    if (found && push && window.matchMedia('(max-width: 860px)').matches) {
      document.getElementById(id).scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    return found;
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t.getAttribute('data-id'), false, true); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = null;
      if (k === 'ArrowDown' || k === 'ArrowRight') n = (i + 1) % tabs.length;
      else if (k === 'ArrowUp' || k === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      else if (k === 'Home') n = 0;
      else if (k === 'End') n = tabs.length - 1;
      if (n !== null) { e.preventDefault(); select(tabs[n].getAttribute('data-id'), true, true); }
    });
  });
  var h = (location.hash || '').replace('#', '');
  if (h) select(h, false, false);
  window.addEventListener('hashchange', function () { select(location.hash.replace('#', ''), false, false); });
})();
