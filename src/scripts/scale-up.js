(function () {
  if (!'IntersectionObserver' in window) {
    return;
  }
  const elements = document.querySelectorAll('.scale');

  let observer = new IntersectionObserver(
    (changes, observer) => {
      let timeout = 800;

      changes.forEach(change => {
        if (change.intersectionRatio > 0) {
          timeout += 200;
          setTimeout(() => {
            change.target.setAttribute('data-state', 'scale-up');
          }, timeout);
        }
      });
    },
    {
      root: null,
      rootMargin: '-180px',
      threshold: 0
    }
  );

  elements.forEach(element => {
    element.setAttribute('data-state', 'scale-down');

    observer.observe(element);
  });
})();