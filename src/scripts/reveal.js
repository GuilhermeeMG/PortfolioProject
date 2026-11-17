// Fallback for browsers without CSS scroll-driven animations
// (animation-timeline: view()). Work rows fade up as they enter the
// viewport, staggered 60ms within each batch.
const STAGGER_MS = 60;

export const initReveal = () => {
  if (CSS.supports('animation-timeline: view()')) return;

  const rows = document.querySelectorAll('.work-row');
  if (!rows.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries
      .filter((entry) => entry.isIntersecting)
      .forEach((entry, index) => {
        entry.target.style.setProperty('--reveal-delay', `${index * STAGGER_MS}ms`);
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
  }, { threshold: 0.15 });

  rows.forEach((row) => {
    row.classList.add('reveal-pending');
    observer.observe(row);
  });
};
