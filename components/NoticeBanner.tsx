import type { Notice } from '@/lib/types';

/**
 * The site-wide announcement. Admissions publishes it in WordPress
 * (a post in the Notice category), and the newest one shows here.
 */
export default function NoticeBanner({ notice }: { notice: Notice }) {
  return (
    <section aria-label="Announcement" className="bg-brand-red text-white">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <p>
          <strong className="font-bold">{notice.title}</strong>
          {notice.body ? <span className="ml-2">{notice.body}</span> : null}
        </p>
      </div>
    </section>
  );
}
