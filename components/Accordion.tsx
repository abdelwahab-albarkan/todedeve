'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItemData {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenId?: string;
  className?: string;
}

export function Accordion({ items, defaultOpenId, className }: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set(defaultOpenId ? [defaultOpenId] : [items[0]?.id || ''])
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        const headingId = `accordion-heading-${item.id}`;
        const contentId = `accordion-content-${item.id}`;

        return (
          <div
            key={item.id}
            className={cn(
              'overflow-hidden rounded-2xl border bg-white transition-all duration-300 dark:bg-zinc-900/50',
              isOpen
                ? 'border-orange-500/40 shadow-[0_10px_40px_-20px_rgba(249,115,22,0.45)]'
                : 'border-zinc-200 hover:border-zinc-300 dark:border-white/[0.07] dark:hover:border-white/[0.14]'
            )}
          >
            <h3>
              <button
                type="button"
                id={headingId}
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggle(item.id)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left text-base font-semibold text-zinc-900 transition-colors hover:text-orange-600 sm:px-6 dark:text-zinc-100 dark:hover:text-orange-400"
              >
                <span>{item.question}</span>
                <span
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-100 text-zinc-500 transition-all duration-300 dark:bg-white/[0.06] dark:text-zinc-400',
                    isOpen && 'rotate-180 bg-orange-500 text-white dark:bg-orange-500 dark:text-white'
                  )}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>
            </h3>

            <div
              id={contentId}
              role="region"
              aria-labelledby={headingId}
              className={cn(
                'grid transition-all duration-300 ease-out',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-6 text-sm leading-relaxed text-zinc-600 sm:px-6 sm:text-[15px] dark:text-zinc-400">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

