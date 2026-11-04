import Link from 'next/link';

const FACTS = [
  { figure: '57%', label: 'of undergraduates are the first in their family to go to college' },
  { figure: '104', label: 'undergraduate majors, 28 of them fully online' },
  { figure: '#1', label: 'in Colorado for social mobility' },
];

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-heading" className="bg-sky">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="font-semibold uppercase tracking-wide text-brand-red">Future students</p>
          <h1
            id="hero-heading"
            className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-navy sm:text-6xl"
          >
            A degree that fits your life.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ink">
            Classes on campus and online, in the heart of downtown Denver, with a program for
            wherever you are headed.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/programs"
              className="inline-block rounded-md bg-brand-red px-6 py-3 text-lg font-bold text-white hover:bg-navy"
            >
              Find your program
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="facts-heading" className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 id="facts-heading" className="text-2xl font-bold text-navy">
            Built for Colorado&apos;s changemakers
          </h2>
          <ul className="mt-8 grid gap-8 sm:grid-cols-3">
            {FACTS.map((fact) => (
              <li key={fact.label}>
                <p className="text-5xl font-extrabold text-navy">{fact.figure}</p>
                <p className="mt-2 text-muted">{fact.label}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted">Source: MSU Denver Fast Facts, 2025 to 2026.</p>
        </div>
      </section>

      <section aria-labelledby="summit-heading" className="bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 id="summit-heading" className="text-2xl font-bold text-navy">
            Summit House opens fall 2027
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-ink">
            MSU Denver&apos;s first university-owned residence hall, with more than 550 beds,
            dining, retail and a career center.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/summit-house"
              className="font-semibold text-navy underline underline-offset-4 hover:text-brand-red"
            >
              Learn about Summit House
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
