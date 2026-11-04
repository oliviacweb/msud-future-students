import type { Metadata } from 'next';
import ProgramFinder from '@/components/ProgramFinder';
import { getSiteContent } from '@/lib/wordpressService';

export const metadata: Metadata = {
  title: 'Find your program',
};

export default async function ProgramsPage() {
  const { programs, areas } = await getSiteContent();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-navy">Find your program</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink">
        Choose an area of study to narrow the list. Every program page shows what you will learn
        and where it can take you.
      </p>
      <ProgramFinder programs={programs} areas={areas} />
    </div>
  );
}
