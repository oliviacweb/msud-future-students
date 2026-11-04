import { cacheLife, cacheTag } from 'next/cache';
import { decodeEntities, stripHtml } from './text';
import type { SiteContent, Notice, Program, WPPost } from './types';

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL || 'https://developer.wordpress.org/news/wp-json/wp/v2';

/** Posts in this category become the site-wide announcement banner. */
const NOTICE_CATEGORY = 'notice';

/** Categories that never count as a program's area of study. */
const NON_AREA_CATEGORIES = new Set([NOTICE_CATEGORY, 'uncategorized']);

// ==================== Transform ====================

/** Category names for a post, read from the terms WordPress embeds. */
function categoryNames(wpPost: WPPost): string[] {
  const terms = wpPost._embedded?.['wp:term']?.flat() ?? [];
  return terms
    .filter((term) => term.taxonomy === 'category')
    .map((term) => decodeEntities(term.name));
}

/** True when the post is an announcement rather than a program. */
function isNotice(wpPost: WPPost): boolean {
  return categoryNames(wpPost).some((name) => name.toLowerCase() === NOTICE_CATEGORY);
}

function toProgram(wpPost: WPPost): Program {
  const area =
    categoryNames(wpPost).find((name) => !NON_AREA_CATEGORIES.has(name.toLowerCase())) ??
    'General';
  const body = stripHtml(wpPost.content.rendered);

  return {
    id: wpPost.id,
    slug: wpPost.slug,
    title: stripHtml(wpPost.title.rendered),
    area,
    description: stripHtml(wpPost.excerpt.rendered) || body,
    body,
  };
}

function toNotice(wpPost: WPPost): Notice {
  return {
    id: wpPost.id,
    title: stripHtml(wpPost.title.rendered),
    body: stripHtml(wpPost.content.rendered),
  };
}

// ==================== Surrogate keys ====================

/**
 * Surrogate keys for a post: post-{id}, post-{slug}, post-list and term-{id}.
 * The WordPress mu-plugin sends the same keys when a post changes, so both
 * sides target the same cache entries.
 */
function surrogateKeys(wpPost: WPPost): string[] {
  const keys = [`post-${wpPost.id}`, `post-${wpPost.slug}`, 'post-list'];
  wpPost.categories?.forEach((id) => keys.push(`term-${id}`));
  wpPost.tags?.forEach((id) => keys.push(`term-${id}`));
  return keys;
}

// ==================== Fetch ====================

/** Fetch every published post, newest first. */
async function fetchPublishedPosts(): Promise<WPPost[]> {
  const url = `${WORDPRESS_API_URL}/posts?_embed&per_page=100&status=publish&orderby=date&order=desc`;

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { tags: ['post-list'] },
  });

  if (!response.ok) {
    throw new Error(`WordPress returned ${response.status} for ${url}`);
  }

  return response.json();
}

// ==================== Cached content ('use cache') ====================

/**
 * Programs, areas and the latest notice, cached until WordPress says otherwise.
 * Infinite cacheLife: the cache refreshes only when the WordPress webhook plugin
 * revalidates one of these tags. Every publish sends post-list, so any change
 * in WordPress refreshes every page that uses this.
 */
export async function getSiteContent(): Promise<SiteContent> {
  'use cache';
  cacheLife({ stale: Infinity, revalidate: Infinity, expire: Infinity });

  const posts = await fetchPublishedPosts();
  cacheTag(...new Set(['post-list', ...posts.flatMap(surrogateKeys)]));

  const programs = posts
    .filter((post) => !isNotice(post))
    .map(toProgram)
    .sort((a, b) => a.title.localeCompare(b.title));
  const areas = [...new Set(programs.map((program) => program.area))].sort();
  const latestNotice = posts.find(isNotice);

  return {
    programs,
    areas,
    notice: latestNotice ? toNotice(latestNotice) : null,
  };
}

/** One program by slug, or null when WordPress has no published program with it. */
export async function getProgram(slug: string): Promise<Program | null> {
  const { programs } = await getSiteContent();
  return programs.find((program) => program.slug === slug) ?? null;
}
