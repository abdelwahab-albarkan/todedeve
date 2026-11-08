import React from 'react';
import { Mail } from 'lucide-react';
import { FAQ_LIST, CONTACT_EMAIL } from '@/lib/constants';
import { Accordion } from '@/components/Accordion';

export function Faq() {
  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-16">
        {/* Section Header */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <span className="eyebrow">Frequently Asked Questions</span>
            <h2 className="section-title lg:text-4xl">Questions before you buy</h2>
            <p className="section-lead">
              Everything you need to know about licensing, deliveries, source code updates, and client work.
            </p>
            <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/[0.07] dark:bg-zinc-900/60">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">Still have a question?</p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">We typically reply within 24 hours on business days.</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-secondary btn-sm mt-4">
                <Mail className="h-4 w-4 text-orange-500" />
                Email support
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <Accordion items={FAQ_LIST} defaultOpenId={FAQ_LIST[0]?.id} />
        </div>
      </div>
    </section>
  );
}
