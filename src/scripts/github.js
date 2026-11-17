const USERNAME = 'GuilhermeeMG';
const REPO_LIMIT = 6;
const MAX_TOPICS = 3;
const API = 'https://api.github.com';

const TIME_UNITS = [
  ['y', 365 * 24 * 60 * 60],
  ['mo', 30 * 24 * 60 * 60],
  ['w', 7 * 24 * 60 * 60],
  ['d', 24 * 60 * 60],
  ['h', 60 * 60],
  ['m', 60],
];

const fetchJson = async (path) => {
  const response = await fetch(`${API}${path}`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!response.ok) throw new Error(`GitHub API responded ${response.status}`);
  return response.json();
};

const timeAgo = (date) => {
  const seconds = (Date.now() - new Date(date).getTime()) / 1000;
  for (const [unit, size] of TIME_UNITS) {
    if (seconds >= size) return `${Math.floor(seconds / size)}${unit} ago`;
  }
  return 'just now';
};

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

const SKELETON_REPO = {
  html_url: null,
  owner: { login: 'owner' },
  visibility: 'public',
  name: 'project-name',
  description: 'Repository description placeholder that fills two lines of the card.',
  topics: ['topic-one', 'topic-two'],
  language: 'Language',
  pushed_at: null,
};

const repoCardHtml = (repo, { loading = false } = {}) => {
  const topics = (repo.topics ?? []).slice(0, MAX_TOPICS);
  const pushedAt = repo.pushed_at ? new Date(repo.pushed_at) : null;

  return `
    <li${loading ? ' aria-hidden="true"' : ''}>
      <a class="repo-card${loading ? ' is-loading' : ''}"${repo.html_url ? ` href="${escapeHtml(repo.html_url)}"` : ''}>
        <div class="repo-card-top">
          <p class="label repo-card-owner">${escapeHtml(repo.owner.login)} / ${escapeHtml(repo.visibility ?? 'public')}</p>
          <span class="repo-card-arrow" aria-hidden="true">
            <img src="src/assets/icon-arrow-up-right.svg" alt="" width="18" height="18">
          </span>
        </div>
        <div class="repo-card-content">
          <h3 class="repo-card-name">${escapeHtml(repo.name)}</h3>
          <p class="repo-card-description">${escapeHtml(repo.description ?? 'No description yet.')}</p>
          ${topics.length ? `
          <ul class="repo-card-topics">
            ${topics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join('')}
          </ul>` : ''}
        </div>
        <div class="repo-card-meta">
          ${repo.language ? `<p class="repo-card-language">${escapeHtml(repo.language)}</p>` : ''}
          <p class="label repo-card-updated"${pushedAt ? ` title="${pushedAt.toLocaleDateString()}"` : ''}>
            Updated ${pushedAt ? timeAgo(pushedAt) : '0d ago'}
          </p>
        </div>
      </a>
    </li>`;
};

const renderSkeletons = (grid) => {
  grid.setAttribute('aria-busy', 'true');
  grid.innerHTML = repoCardHtml(SKELETON_REPO, { loading: true }).repeat(REPO_LIMIT);
};

export const initGitHub = async () => {
  const section = document.querySelector('#github');
  if (!section) return;

  const grid = section.querySelector('.repo-grid');
  const count = section.querySelector('.github-count');

  renderSkeletons(grid);

  try {
    const [user, repos] = await Promise.all([
      fetchJson(`/users/${USERNAME}`),
      fetchJson(`/users/${USERNAME}/repos?type=owner&sort=pushed&per_page=100`),
    ]);

    const latest = repos.filter((repo) => !repo.fork && !repo.archived).slice(0, REPO_LIMIT);

    grid.innerHTML = latest.map((repo) => repoCardHtml(repo)).join('');
    count.textContent = `Showing ${latest.length} of ${user.public_repos} public repositories`;
  } catch (error) {
    console.error(error);
    grid.replaceChildren();
    count.textContent = 'Couldn’t load repositories right now';
  } finally {
    grid.removeAttribute('aria-busy');
  }
};
