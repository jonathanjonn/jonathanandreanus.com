// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

// Production URL. Canonical and Open Graph URLs, the sitemap, and the
// robots.txt Sitemap line are only emitted while it is set.
/** @type {string | undefined} */
const site = "https://jonathanandreanus.com";

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [mdx(), ...(site ? [sitemap()] : [])],
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Newsreader",
      cssVariable: "--font-newsreader",
      weights: ["300 600"],
      // No italic: it would only serve pull quotes and costs about 60 KB.
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      fallbacks: ["Georgia", "serif"],
      // The display optical size: headlines are the only place this face is set.
      options: { experimental: { variableAxis: { opsz: ["72"] } } },
    },
    {
      provider: fontProviders.google(),
      name: "Schibsted Grotesk",
      cssVariable: "--font-schibsted",
      weights: ["400 700"],
      styles: ["normal", "italic"],
      subsets: ["latin", "latin-ext"],
      fallbacks: ["sans-serif"],
    },
  ],
  image: {
    layout: "constrained",
    responsiveStyles: true,
  },
  markdown: {
    // Token colors come from the site palette (see global.css), so code
    // follows the light/dark theme and keeps AA contrast.
    shikiConfig: { theme: "css-variables" },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
