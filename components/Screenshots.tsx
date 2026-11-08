import React from 'react';
import Link from 'next/link';
import { ExternalLink, Sparkles, ArrowRight, ArrowUpRight } from 'lucide-react';
import { SCREENSHOTS_LIST } from '@/lib/constants';
import { cn, optimizedImage } from '@/lib/utils';

export function Screenshots() {
  return (
    <section
      id="showcase"
      className="relative border-y border-zinc-200/70 bg-zinc-50/70 py-20 sm:py-28 dark:border-white/[0.05] dark:bg-[#0A0F1A]"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5" />
            10 Production-Ready Screens
          </span>
          <h2 className="section-title">Designed for high-performance developer teams</h2>
          <p className="section-lead">
            Explore all 10 responsive screens crafted with our signature dark navy background, vibrant orange brand identity, and
            neon accent design system.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SCREENSHOTS_LIST.map((item, i) => {
            const img = optimizedImage(item.imageSrc);
            const featured = i === 0;
            const [num, ...rest] = item.title.split('. ');
            const title = rest.length ? rest.join('. ') : item.title;
            return (
              <Link
                key={item.id}
                href={item.route}
                className={cn(
                  'card-glow group flex flex-col overflow-hidden p-2.5 hover:-translate-y-1 hover:shadow-xl',
                  featured && 'md:col-span-2 lg:col-span-3 lg:flex-row lg:items-center lg:gap-4',
                  i === SCREENSHOTS_LIST.length - 1 && 'md:col-span-2 lg:col-span-1'
                )}
              >
                <div
                  className={cn(
                    'relative aspect-[16/9] overflow-hidden rounded-xl border border-zinc-200/80 bg-[#0D1424] dark:border-white/[0.06]',
                    featured && 'lg:w-2/3 lg:shrink-0'
                  )}
                >
                  <img
                    src={img.src}
                    srcSet={img.srcSet}
                    sizes={featured ? '(min-width: 1024px) 760px, 100vw' : '(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw'}
                    width={1600}
                    height={900}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                      Open Live Interactive Screen
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>

                <div className={cn('flex flex-1 flex-col px-2.5 pb-2 pt-4', featured && 'lg:p-6')}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {rest.length > 0 && (
                        <span className="font-mono text-[11px] font-semibold text-orange-500">
                          {num.padStart(2, '0')}
                        </span>
                      )}
                      <h3
                        className={cn(
                          'font-bold text-zinc-900 transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400',
                          featured ? 'text-xl lg:text-2xl' : 'text-base'
                        )}
                      >
                        {title}
                      </h3>
                    </div>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-zinc-200 text-zinc-500 transition-all group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-white dark:border-white/10">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <p className={cn('mt-2 leading-relaxed text-zinc-600 dark:text-zinc-400', featured ? 'text-base' : 'text-sm')}>
                    {item.caption}
                  </p>
                  {featured && (
                    <span className="btn btn-primary btn-md mt-6 hidden self-start lg:inline-flex">
                      Explore Demo
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Global Live Demo CTA */}
        <div className="mt-14 text-center">
          <Link href="/dashboard" className="btn btn-primary btn-lg group w-full sm:w-auto">
            <span>Launch Complete Dashboard Demo</span>
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
