'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import type { Program } from '@/lib/types';

const ALL_AREAS = 'All areas';

/** The sentence screen readers hear each time the filter changes. */
function resultsSummary(count: number, area: string): string {
  const noun = count === 1 ? 'program' : 'programs';
  if (area === ALL_AREAS) return `Showing all ${count} ${noun}`;
  return `${count} ${noun} ${count === 1 ? 'matches' : 'match'} ${area}`;
}

/**
 * Filter programs by area of study. The filters are toggle buttons that
 * report their pressed state, and a polite live region announces how many
 * programs match after every change, so screen reader users hear the result
 * without losing their place.
 */
export default function ProgramFinder({
  programs,
  areas,
}: {
  programs: Program[];
  areas: string[];
}) {
  const [area, setArea] = useState(ALL_AREAS);
  const labelId = useId();
  const visible = area === ALL_AREAS ? programs : programs.filter((p) => p.area === area);

  return (
    <div className="mt-10">
      <div role="group" aria-labelledby={labelId}>
        <p id={labelId} className="font-semibold text-navy">
          Filter by area of study
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {[ALL_AREAS, ...areas].map((option) => (
            <li key={option}>
              <button
                type="button"
                aria-pressed={area === option}
                onClick={() => setArea(option)}
                className="rounded-full border-2 border-navy bg-white px-4 py-2 font-semibold text-navy hover:bg-sky aria-pressed:bg-navy aria-pressed:text-white"
              >
                {area === option ? <span aria-hidden="true">✓ </span> : null}
                {option}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p role="status" className="mt-8 text-lg font-semibold text-ink">
        {resultsSummary(visible.length, area)}
      </p>

      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((program) => (
          <li key={program.id}>
            <article className="flex h-full flex-col rounded-lg border border-line bg-white p-6">
              <p className="self-start rounded bg-sky px-2 py-1 text-sm font-semibold text-navy">
                {program.area}
              </p>
              <h2 className="mt-4 text-xl font-bold text-navy">
                <Link
                  href={`/programs/${program.slug}`}
                  className="underline-offset-4 hover:underline"
                >
                  {program.title}
                </Link>
              </h2>
              <p className="mt-2 text-muted">{program.description}</p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
