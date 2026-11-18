# Assignment 2: Guilherme Gonçalves, uc 2022214538

A personal portfolio website. It introduces who I am, the projects I have worked on, the languages I use and my latest open-source work, and gives visitors a direct way to get in touch.

- **Website:** https://guilhermeemg.github.io/PortfolioProject/
- **Repository:** https://github.com/GuilhermeeMG/PortfolioProject
- **Demo video:** [`SEEME.mp4`](SEEME.mp4)

## Sections

| Section | Content |
|---|---|
| Intro | Name, role and calls to action |
| Marquee | Two scrolling bands of skills and technologies |
| About | Current research, location and experience |
| Work | Selected projects |
| GitHub | My most recently pushed public repositories, loaded live |
| Languages | Programming languages and the stack I work with |
| Contact | Email, GitHub and LinkedIn links |

## How it meets the requirements

- **Static and dependency-free:** plain HTML, CSS and JavaScript (ES modules), with no frameworks or third-party libraries.
- **Responsive:** a desktop layout and a mobile layout (below 1024px), including a collapsible navigation menu.
- **Dynamic interaction:** mobile menu toggle, hover states on work rows, language rows, repository cards and buttons, and a sticker that changes its label on hover.
- **CSS animation:** page-load entrance animations, the infinitely scrolling marquee, scroll-driven reveal of the work rows (`animation-timeline: view()`, with an `IntersectionObserver` fallback).
- **Fetched content:**
  - The GitHub section calls the public GitHub API (`api.github.com/users/{user}/repos`), filters out forks and archived repositories, and renders the six most recently pushed.
  - The marquee words are loaded from a static JSON file in this repository, [`src/data/marquee.json`](src/data/marquee.json).

## Project structure

```
index.html            Single page
src/
  styles/             One stylesheet per component or section; tokens.css holds the design tokens
  scripts/            main.js imports one module per feature (github, marquee, nav, reveal)
  data/marquee.json   Words shown in the marquee bands
  assets/             Images, logos and icons
  server.js           Small Node static server for local development only
```

## Running locally

Requires Node.js 20 or later.

```sh
npm start
```