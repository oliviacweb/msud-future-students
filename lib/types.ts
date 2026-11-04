/** A taxonomy term as WordPress embeds it with `?_embed`. */
export interface WPTerm {
  id: number;
  name: string;
  taxonomy: string;
}

/** The fields this site reads from the WordPress REST API posts endpoint. */
export interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  categories?: number[];
  tags?: number[];
  _embedded?: {
    'wp:term'?: WPTerm[][];
  };
}

/** A degree program, stored in WordPress as a post with its area as the category. */
export interface Program {
  id: number;
  slug: string;
  title: string;
  area: string;
  description: string;
  body: string;
}

/** A site-wide announcement, stored in WordPress as a post in the Notice category. */
export interface Notice {
  id: number;
  title: string;
  body: string;
}

/** Everything the site reads from WordPress, fetched and cached in one call. */
export interface SiteContent {
  programs: Program[];
  areas: string[];
  notice: Notice | null;
}
