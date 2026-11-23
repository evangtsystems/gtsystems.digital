'use client';
/**
 * Next.js / React: η ενότητα «Λύσεις» — Τροχιά.
 *   1. img/            → public/images/solutions/
 *   2. orbit.css, orbit.js, Orbit.tsx στον ίδιο φάκελο (π.χ. components/orbit/)
 *   3. import './orbit.css' (εδώ ή στο layout) και στη θέση της ενότητας: <Orbit />
 *
 * Το orbit.js φορτώνεται μόνο στον browser (dynamic import), άρα δεν επηρεάζει το SSR.
 */
import { useEffect, useRef } from 'react';

declare global {
  interface Window { GTSOrbit?: { mount: (el: HTMLElement, opts?: Record<string, unknown>) => () => void } }
}

export default function Orbit({ img = '/images/solutions/' }: { img?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    let destroy: (() => void) | undefined;
    let cancelled = false;
    // @ts-ignore: απλό JS module χωρίς types
    import('./orbit.js').then(() => {
      if (!cancelled && ref.current && window.GTSOrbit) destroy = window.GTSOrbit.mount(ref.current, { img });
    });
    return () => { cancelled = true; destroy?.(); };
  }, [img]);
  return <section ref={ref} className="go" id="luseis" aria-label="Λύσεις" />;
}
