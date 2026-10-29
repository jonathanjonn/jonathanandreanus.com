import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// `pnpm dev:fixtures` (Astro's `--mode fixtures`) swaps the real content for
// the labelled design fixtures in src/fixtures. Production builds never use it.
const fixtures = import.meta.env.MODE === "fixtures";
const root = fixtures ? "./src/fixtures" : "./src/content";

const httpUrl = z.url({ protocol: /^https?$/ });
const link = z.object({ label: z.string(), url: httpUrl });
// A file in public/ ("/resume.pdf") or an absolute http(s) URL.
const publicPathOrUrl = z.string().regex(/^(\/[^/]|https?:\/\/)/, {
  message: 'Use a path from public/ ("/file.pdf") or an http(s) URL',
});

const profile = defineCollection({
  loader: glob({
    base: root,
    pattern: "profile.md",
    // Distinct ids keep the two profiles apart in Astro's content cache.
    generateId: () => (fixtures ? "fixture-profile" : "profile"),
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string().optional(),
      intro: z.string().optional(),
      location: z.string().optional(),
      availability: z.string().optional(),
      email: z.email().optional(),
      resume: publicPathOrUrl.optional(),
      contactNote: z.string().optional(),
      socials: z.array(link).default([]),
      portrait: z.object({ src: image(), alt: z.string() }).optional(),
    }),
});

const projects = defineCollection({
  loader: glob({ base: `${root}/projects`, pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      year: z.number().int().optional(),
      role: z.string().optional(),
      tags: z.array(z.string()).default([]),
      links: z.array(link).default([]),
      cover: z.object({ src: image(), alt: z.string() }).optional(),
      media: z
        .array(
          z.discriminatedUnion("type", [
            z.object({
              type: z.literal("image"),
              src: image(),
              alt: z.string(),
              caption: z.string().optional(),
            }),
            z.object({
              type: z.literal("video"),
              src: publicPathOrUrl,
              alt: z.string(),
              caption: z.string().optional(),
              poster: image().optional(),
              // Plays muted and looped, like an animated screenshot, unless
              // the visitor prefers reduced motion.
              autoplay: z.boolean().default(false),
            }),
          ]),
        )
        .default([]),
      featured: z.boolean().default(false),
      // Lower numbers come first; unordered projects follow, newest first.
      order: z.number().optional(),
      // Drafts render in `astro dev` but are excluded from production builds.
      draft: z.boolean().default(false),
    }),
});

const experience = defineCollection({
  loader: glob({ base: `${root}/experience`, pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    role: z.string(),
    organization: z.string(),
    url: httpUrl.optional(),
    location: z.string().optional(),
    start: z.coerce.date(),
    // Omit for a current position.
    end: z.coerce.date().optional(),
  }),
});

export const collections = { profile, projects, experience };
