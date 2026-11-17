export const initNav = () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    links.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  links.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
};
