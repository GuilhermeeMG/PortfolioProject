const DATA_URL = 'src/data/marquee.json';

// Each half of the track repeats the list this many times so it is wider
// than the (rotated, oversized) band; the track holds two halves so that
// translating by -50% loops seamlessly.
const REPEATS_PER_HALF = 2;

const createItems = (word) => {
  const label = document.createElement('span');
  label.className = 'band-item';
  label.textContent = word;

  const star = document.createElement('span');
  star.className = 'band-item band-star';
  star.textContent = '✦';

  return [label, star];
};

export const initMarquee = async () => {
  const tracks = document.querySelectorAll('.band-track[data-band]');
  if (!tracks.length) return;

  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Marquee data responded ${response.status}`);
    const bands = await response.json();

    tracks.forEach((track) => {
      const words = bands[track.dataset.band] ?? [];
      const half = Array.from({ length: REPEATS_PER_HALF }, () => words).flat();
      track.replaceChildren(...[...half, ...half].flatMap(createItems));
    });
  } catch (error) {
    console.error(error);
  }
};
