import type { Metadata } from 'next';
import Link from 'next/link';
import NoticeBanner from '@/components/NoticeBanner';
import { getSiteContent } from '@/lib/wordpressService';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'MSU Denver: find your program',
    template: '%s | MSU Denver',
  },
  description: 'A demo concept of a Future Students site. Not affiliated with MSU Denver.',
  robots: { index: false, follow: false },
  // Lets the accessibility check confirm it is testing this app.
  other: {
    'x-app': 'msud-future-students',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { notice } = await getSiteContent();

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white text-ink antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>

        {notice ? <NoticeBanner notice={notice} /> : null}

        <header className="border-b border-line bg-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-navy">
              MSU Denver
            </Link>
            <nav aria-label="Main">
              <ul className="flex flex-wrap gap-x-6 gap-y-2 font-semibold text-navy">
                <li>
                  <Link href="/programs" className="underline-offset-4 hover:underline">
                    Programs
                  </Link>
                </li>
                <li>
                  <Link href="/summit-house" className="underline-offset-4 hover:underline">
                    Summit House
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main id="main" tabIndex={-1} className="flex-1">
          {children}
        </main>

        <footer className="on-dark bg-navy-dark text-white">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm sm:px-6">
            <p className="font-semibold">MSU Denver, Denver, Colorado</p>
            <p className="text-line">
              Demo concept for a Pantheon presentation. Not affiliated with MSU Denver.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
