# porto

Personal software engineering portfolio, built with Astro as a static site.

## Requirements

- Node.js 24 LTS, 24.16.0 or newer (`.nvmrc`, `engines.node`)
- pnpm 11.28.9, pinned in `packageManager`. Corepack and standalone pnpm both
  switch to it automatically. pnpm 12 is not used because Corepack cannot run
  it.

## Development

```sh
fnm use        # or: nvm use
pnpm install
pnpm dev       # http://localhost:4321
```

| Script              | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `pnpm dev`          | Dev server with your real content                    |
| `pnpm dev:fixtures` | Dev server with the labelled design fixtures instead |
| `pnpm build`        | Production build into `dist/`                        |
| `pnpm preview`      | Serve the production build locally                   |
| `pnpm check`        | Astro and TypeScript diagnostics (`astro check`)     |
| `pnpm lint`         | ESLint                                               |
| `pnpm format`       | Format all files with Prettier                       |
| `pnpm format:check` | Verify formatting without writing                    |

CI (`.github/workflows/ci.yml`) runs `check`, `lint`, `format:check` and
`build` on pushes to `main` and on pull requests.

## Where your content goes

All content lives in `src/content/`, separate from the components. Every
section except the hero is optional: when its content is missing, the section,
its navigation link and its number disappear.

| Content                                 | File                                           |
| --------------------------------------- | ---------------------------------------------- |
| Name, role, intro, contact, socials     | `src/content/profile.md` (frontmatter)         |
| About text                              | `src/content/profile.md` (Markdown body)       |
| Projects and case studies               | `src/content/projects/<id>.mdx`, one per file  |
| Experience                              | `src/content/experience/<id>.md`, one per role |
| Project images                          | Next to the project file, referenced as `./`   |
| Project videos, résumé PDF, other files | `public/`, referenced as `/file.ext`           |

The schemas in `src/content.config.ts` validate every field, so a typo fails
the build with a message naming the file and field. `src/fixtures/` holds a
complete example of every file below.

### Profile: `src/content/profile.md`

| Field          | Shown in                                        |
| -------------- | ----------------------------------------------- |
| `name`         | Header, hero, footer, page titles. Required.    |
| `role`         | Under your name in the hero, and the home title |
| `intro`        | Hero introduction and the homepage description  |
| `location`     | Small line above your name                      |
| `availability` | Same line, e.g. what you are open to            |
| `email`        | Hero link and the large address in Contact      |
| `resume`       | Hero link; a file in `public/` or a URL         |
| `contactNote`  | Sentence above your email in Contact            |
| `socials`      | List of `label` and `url`; Contact and footer   |
| `portrait`     | `src` (image next to the file) and `alt`; About |

Write the About text as Markdown below the closing `---`. Its first paragraph
is set as a large serif lead.

### Projects: `src/content/projects/<id>.mdx`

The file name becomes the URL (`/projects/<id>/`). The MDX body is the case
study.

```mdx
---
title: Project name
summary: One or two sentences for cards, the index and the page description.
year: 2026
role: What you did on it
tags: [TypeScript, Postgres]
links:
  - label: Source
    url: https://github.com/you/project
cover:
  src: ./project-cover.jpg
  alt: Describe what the image shows
media:
  - type: image
    src: ./screen-1.png
    alt: Describe the screenshot
    caption: Optional caption
  - type: video
    src: /media/project-demo.mp4
    alt: Describe the clip
    poster: ./demo-poster.png
    autoplay: true
featured: true
order: 1
draft: false
---

Case study written in MDX.
```

Only `title` and `summary` are required.

- `featured` projects appear on the homepage. With none marked, the first
  three are shown.
- `order` sorts projects, lowest first. Unordered projects follow, newest
  `year` first.
- `media` images open in a full-screen viewer. A video with `autoplay` plays
  muted and looped while visible, unless the visitor prefers reduced motion.
- `draft: true` shows the project in `pnpm dev` only.

### Experience: `src/content/experience/<id>.md`

```md
---
role: Job title
organization: Company
url: https://company.example
location: City, Country
start: 2022-03
end: 2024-06 # leave out for a current role
---

Optional details in Markdown.
```

Entries sort automatically: current roles first, then by date.

## Design fixtures

`pnpm dev:fixtures` swaps your content for the samples in `src/fixtures/`:
short and long titles, projects with and without covers, every Markdown
element, a gallery with video. Use it to check the design while
`src/content/` is still empty. A label on every page marks the content as
sample. Production builds never read `src/fixtures/`.

## Design system

- Color tokens, type scale and long-form text styles: `src/styles/global.css`
- Typefaces (Newsreader for headlines, Schibsted Grotesk for text): `fonts`
  in `astro.config.mjs`, self-hosted at build time
- Light and dark themes follow the system setting; the header toggle
  overrides it and remembers the choice.

Interface labels such as "Selected work" or "Résumé" are in the components in
`src/components/`.

## Production domain

`site` in `astro.config.mjs` is `https://jonathanandreanus.com`. That single
value turns on canonical and `og:url` tags, social preview images, the sitemap
(`sitemap-index.xml`) and the `Sitemap:` line in `/robots.txt`. A project's
preview is its cover; every other page uses the name card in
`src/assets/og-default.png`.

## Deployment

Cloudflare Pages builds and deploys every push to `main`, with these settings:

- Build command: `pnpm build`
- Build output directory: `dist`
- Environment variable `PNPM_VERSION=11.28.9`, because the build image defaults
  to pnpm 10. Node.js comes from `.nvmrc`.

The build is fully static, so no Cloudflare adapter is needed.
