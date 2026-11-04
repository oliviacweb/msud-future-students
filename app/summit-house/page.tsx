import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Summit House',
};

const FEATURES = [
  'More than 550 beds',
  'Dining and retail',
  'A career center',
];

export default function SummitHousePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="font-semibold uppercase tracking-wide text-brand-red">Opening fall 2027</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-navy">Summit House</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink">
        Summit House is MSU Denver&apos;s first university-owned residence hall. It opens in fall
        2027 for students who want to live where they learn.
      </p>

      <h2 className="mt-12 text-2xl font-bold text-navy">What&apos;s inside</h2>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-lg text-ink">
        {FEATURES.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      <h2 id="tours" className="mt-12 text-2xl font-bold text-navy">
        Tours
      </h2>
      <p className="mt-4 text-lg text-ink">Tour dates will be posted here as they open.</p>
    </div>
  );
}
