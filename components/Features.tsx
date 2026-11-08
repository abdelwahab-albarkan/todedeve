import React from 'react';
import {
  Zap,
  Code2,
  Layers,
  Palette,
  ShieldCheck,
  Smartphone,
  LucideIcon,
} from 'lucide-react';
import { FEATURES_LIST, FeatureItem } from '@/lib/constants';

const ICON_MAP: Record<FeatureItem['icon'], LucideIcon> = {
  Zap,
  Code2,
  Layers,
  Palette,
  ShieldCheck,
  Smartphone,
};

const ACCENTS = [
  'from-orange-500/20 text-orange-500',
  'from-amber-500/20 text-amber-500',
  'from-purple-500/20 text-purple-500',
  'from-sky-500/20 text-sky-500',
  'from-emerald-500/20 text-emerald-500',
  'from-pink-500/20 text-pink-500',
];

export function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="eyebrow">Features &amp; Architecture</span>
          <h2 className="section-title">
            Everything you need to <span className="text-gradient">ship faster</span>
          </h2>
          <p className="section-lead">
            Stop wasting weeks wiring up repetitive frontend plumbing. Start directly with tested, polished foundation code.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {FEATURES_LIST.map((feature, i) => {
            const Icon = ICON_MAP[feature.icon] || Code2;
            return (
              <div key={feature.id} className="card-glow group p-7 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-[0_20px_50px_-20px_rgba(249,115,22,0.25)]">
                <div
                  className={`mb-6 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br to-transparent transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${ACCENTS[i % ACCENTS.length]}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
