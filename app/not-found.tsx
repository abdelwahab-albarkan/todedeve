import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] overflow-hidden items-center py-20 sm:py-28">
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-72 w-[40rem] max-w-[120vw] -translate-x-1/2 rounded-full bg-orange-500/15 blur-[110px]"
        aria-hidden="true"
      />
      <div className="mx-auto w-full max-w-2xl px-4 text-center sm:px-6">
        <span className="eyebrow mb-4">Error 404</span>
        <h1 className="section-title">This page doesn&apos;t exist.</h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
          The link may be broken or the page may have moved. Head back home or pick your package.
        </p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link href="/" className="btn btn-secondary btn-lg">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <a href="/#pricing" className="btn btn-primary btn-lg group">
            View pricing
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
