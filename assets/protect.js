(function () {
  function stop(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  window.addEventListener('contextmenu', stop);
  window.addEventListener('keydown', function (e) {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && e.key.toUpperCase() === 'U')
    ) {
      stop(e);
    }
  });
})();
