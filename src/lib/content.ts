import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;
export type Experience = CollectionEntry<"experience">;

const FEATURED_FALLBACK = 3;

export const isFixtureMode = import.meta.env.MODE === "fixtures";

/**
 * Every page of a production build reads the same content, so each
 * collection is loaded once (and an empty one is reported once). The dev
 * server reloads on every request to pick up edits.
 */
function cached<T>(load: () => Promise<T>) {
  let result: Promise<T> | undefined;
  return () => (import.meta.env.DEV ? load() : (result ??= load()));
}

export const getProfile = cached(async () => {
  const [profile] = await getCollection("profile");
  if (!profile) {
    throw new Error("Missing profile: create src/content/profile.md");
  }
  return profile;
});

export function hasBody(entry: { body?: string }) {
  return Boolean(entry.body?.trim());
}

export const getProjects = cached(async (): Promise<Project[]> => {
  const projects = await getCollection(
    "projects",
    ({ data }) => import.meta.env.DEV || !data.draft,
  );
  return projects.sort(
    (a, b) =>
      (a.data.order ?? Infinity) - (b.data.order ?? Infinity) ||
      (b.data.year ?? 0) - (a.data.year ?? 0) ||
      a.data.title.localeCompare(b.data.title),
  );
});

/** Projects marked `featured`, or the first few projects when none are. */
export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  const featured = projects.filter((project) => project.data.featured);
  return featured.length > 0 ? featured : projects.slice(0, FEATURED_FALLBACK);
}

export const getExperience = cached(async (): Promise<Experience[]> => {
  const entries = await getCollection("experience");
  // Current positions first, then by end date, then by start date.
  return entries.sort(
    (a, b) =>
      (b.data.end?.getTime() ?? Infinity) -
        (a.data.end?.getTime() ?? Infinity) ||
      b.data.start.getTime() - a.data.start.getTime(),
  );
});

/** Which optional homepage sections have content. Drives sections and nav. */
export async function getSections() {
  const [profile, projects, experience] = await Promise.all([
    getProfile(),
    getProjects(),
    getExperience(),
  ]);
  return {
    work: projects.length > 0,
    about: hasBody(profile),
    experience: experience.length > 0,
    contact: Boolean(profile.data.email) || profile.data.socials.length > 0,
  };
}

export async function getNavigation() {
  const sections = await getSections();
  return [
    sections.work && { label: "Work", href: "/projects/" },
    sections.about && { label: "About", href: "/#about" },
    sections.experience && { label: "Experience", href: "/#experience" },
    sections.contact && { label: "Contact", href: "/#contact" },
  ].filter((item) => item !== false);
}

/** A CSS-safe view-transition-name shared by a project's card and page. */
export function coverTransitionName(project: Project) {
  return `cover-${project.id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}
