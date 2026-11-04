import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSiteContent, getProgram } from '@/lib/wordpressService';

interface ProgramPageProps {
  params: Promise<{ slug: string }>;
}

/** Prerender a page for every program WordPress has at build time. */
export async function generateStaticParams() {
  const { programs } = await getSiteContent();
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = await getProgram(slug);
  return program
    ? { title: program.title, description: program.description }
    : { title: 'Program not found' };
}

export default async function ProgramPage({ params }: ProgramPageProps) {
  const { slug } = await params;
  const program = await getProgram(slug);

  if (!program) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p>
        <Link
          href="/programs"
          className="font-semibold text-navy underline underline-offset-4 hover:text-brand-red"
        >
          All programs
        </Link>
      </p>

      <p className="mt-8 inline-block rounded bg-sky px-2 py-1 text-sm font-semibold text-navy">
        {program.area}
      </p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-navy">{program.title}</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink">{program.body}</p>

      <section aria-labelledby="next-steps" className="mt-12 rounded-lg bg-surface p-6">
        <h2 id="next-steps" className="text-xl font-bold text-navy">
          Next steps
        </h2>
        <p className="mt-2 text-ink">
          Talk with an admissions counselor about how your credits transfer and what the
          program costs.
        </p>
      </section>
    </div>
  );
}
