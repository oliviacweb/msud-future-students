import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-navy">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-6 text-lg text-ink">
        It may have moved. Try{' '}
        <Link
          href="/programs"
          className="font-semibold text-navy underline underline-offset-4 hover:text-brand-red"
        >
          finding your program
        </Link>{' '}
        instead.
      </p>
    </div>
  );
}
