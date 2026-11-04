/**
 * Sample WordPress content for the accessibility check.
 *
 * A tiny stand-in for the WordPress REST API with the same programs and notice
 * as the real msud-cms site, so a pull request can be built and checked inside
 * GitHub Actions without reaching any outside site.
 *
 * Usage: node a11y/sample-wordpress.mjs   (serves http://127.0.0.1:8787/wp-json/wp/v2)
 */
import http from 'node:http';

const PORT = Number(process.env.SAMPLE_WORDPRESS_PORT || 8787);

const CATEGORY_IDS = {
  Health: 2,
  Technology: 3,
  Business: 4,
  Aviation: 5,
  'Social Sciences': 6,
  Science: 7,
  'Arts and Media': 8,
  Notice: 9,
};

const PROGRAMS = [
  ['Nursing', 'Health', 'See how clinical training fits around work and family.'],
  ['Aviation and Aerospace Science', 'Aviation', 'Explore careers across the aviation industry.'],
  ['Computer Science', 'Technology', 'Build software skills for Colorado employers.'],
  ['Cybersecurity', 'Technology', 'Learn to protect systems and networks.'],
  ['Hospitality Management', 'Business', 'Prepare for careers in hotels, events and tourism.'],
  ['Accounting', 'Business', 'Learn the numbers behind every organization.'],
  ['Marketing', 'Business', 'Learn to reach and grow an audience.'],
  ['Criminal Justice and Criminology', 'Social Sciences', 'Study how justice systems work and how to improve them.'],
  ['Psychology', 'Social Sciences', 'Understand how people think, feel and behave.'],
  ['Social Work', 'Social Sciences', 'Prepare to support individuals and communities.'],
  ['Biology', 'Science', 'From cells to ecosystems, with hands-on labs.'],
  ['Journalism and Media Production', 'Arts and Media', 'Report, produce and publish stories.'],
];

/** URL slug for a title, the way WordPress makes one. */
function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/** A post shaped like the REST API's response with _embed. */
function samplePost(id, title, category, text, minutesAgo) {
  return {
    id,
    slug: slugify(title),
    date: new Date(Date.now() - minutesAgo * 60_000).toISOString(),
    title: { rendered: title },
    content: { rendered: `<p>${text}</p>\n` },
    excerpt: { rendered: `<p>${text}</p>\n` },
    categories: [CATEGORY_IDS[category]],
    tags: [],
    _embedded: {
      'wp:term': [[{ id: CATEGORY_IDS[category], name: category, taxonomy: 'category' }], []],
    },
  };
}

const posts = [
  samplePost(200, 'Spring 2027 applications are open', 'Notice', 'Apply early to see every aid option.', 1),
  ...PROGRAMS.map(([title, category, text], index) =>
    samplePost(100 + index, title, category, text, 100 + index),
  ),
];

http
  .createServer((request, response) => {
    const url = new URL(request.url, `http://127.0.0.1:${PORT}`);
    if (!url.pathname.startsWith('/wp-json/wp/v2/posts')) {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.end('[]');
      return;
    }

    const slug = url.searchParams.get('slug');
    const body = slug ? posts.filter((post) => post.slug === slug) : posts;
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(body));
  })
  .listen(PORT, '127.0.0.1', () => {
    console.log(`Sample WordPress content at http://127.0.0.1:${PORT}/wp-json/wp/v2`);
  });
