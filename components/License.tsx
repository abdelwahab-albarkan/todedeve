'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Smartphone,
  Infinity as InfinityIcon,
  Ban,
  CreditCard,
  RotateCcw,
  ChevronDown,
  FileText,
  Mail,
  ExternalLink,
} from 'lucide-react';
import { PRODUCT_NAME, CONTACT_EMAIL } from '@/lib/constants';

export function License() {
  const [showFullLicense, setShowFullLicense] = useState(false);

  const plainTerms = [
    {
      title: 'Seats',
      icon: Users,
      description:
        'Each package covers 1–4 named developers who work with the source. A seat can be reassigned when someone permanently leaves the project or company.',
    },
    {
      title: 'Apps',
      icon: Smartphone,
      description:
        "Unlimited end products — your own or clients', commercial or not. Ship the kit compiled inside them.",
    },
    {
      title: 'Forever',
      icon: InfinityIcon,
      description:
        'Every version you receive stays licensed to you permanently. The update period only limits which future versions you get.',
    },
    {
      title: 'Not allowed',
      icon: Ban,
      badge: 'Restricted',
      description:
        'Reselling, sharing or redistributing the kit; publishing its source publicly or on pub.dev; building a competing UI kit, template or library from it.',
    },
    {
      title: 'Payment',
      icon: CreditCard,
      description: 'One-time. No subscription, no renewal, no recurring charges.',
    },
    {
      title: 'Refunds',
      icon: RotateCcw,
      description:
        'A fully refunded or charged-back purchase ends the license for that purchase.',
    },
  ];

  return (
    <section id="license" className="relative py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* =================================================================== */}
        {/* 1. Header                                                           */}
        {/* =================================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="eyebrow mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>License · v1.0</span>
          </div>

          <h2 className="section-title !mt-0">
            The license, in plain terms first.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            This summary is for convenience. The full license below — identical to{' '}
            <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              LICENSE.md
            </code>{' '}
            in the download — is what applies, together with the certificate for your package.
          </p>
        </div>

        {/* =================================================================== */}
        {/* 2. Plain Terms 6-Card Grid                                          */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {plainTerms.map((term) => {
            const Icon = term.icon;
            const isNotAllowed = term.title === 'Not allowed';

            return (
              <div
                key={term.title}
                className={`p-6 sm:p-7 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isNotAllowed
                    ? 'border-red-200 dark:border-red-900/40 bg-red-50/20 dark:bg-red-950/10 hover:border-red-300 dark:hover:border-red-800/60'
                    : 'border-zinc-200 dark:border-white/[0.07] bg-white dark:bg-zinc-900/40 hover:border-orange-500/50 dark:hover:border-orange-500/50 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isNotAllowed
                          ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-orange-500 dark:text-orange-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {term.badge && (
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400">
                        {term.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                    {term.title}
                  </h3>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {term.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* =================================================================== */}
        {/* 3. Toggle for Full Legal Document                                   */}
        {/* =================================================================== */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-zinc-200 dark:border-white/[0.07] bg-zinc-50/50 dark:bg-zinc-950/60 overflow-hidden shadow-sm">
            
            <button
              type="button"
              onClick={() => setShowFullLicense(!showFullLicense)}
              className="w-full p-6 flex items-center justify-between gap-4 text-left font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 hover:text-orange-500 dark:hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-orange-500" />
                <div>
                  <span>View Full Commercial License (10 Sections)</span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal mt-0.5">
                    Exact agreement text included in your downloaded source ZIP
                  </p>
                </div>
              </div>

              <div
                className={`w-8 h-8 rounded-full bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center transition-transform duration-200 ${
                  showFullLicense ? 'rotate-180 bg-orange-500 text-white' : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <ChevronDown className="w-4 h-4" />
              </div>
            </button>

            {/* Collapsible Complete Legal Text */}
            {showFullLicense && (
              <div className="px-6 pb-8 pt-4 border-t border-zinc-200 dark:border-white/[0.07] font-sans text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-6">
                
                {/* Legal Header */}
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/[0.07]">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                    {PRODUCT_NAME} — Commercial License
                  </h4>
                  <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1">
                    Version 1.0 · Applies to Developer UI Kit Pro 1.0.0 and later versions you are entitled to.
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                    This license is an agreement between you (the &ldquo;Licensee&rdquo;) and the seller of Developer UI Kit Pro on Gumroad (the &ldquo;Seller&rdquo;). Your purchase includes a License Certificate that states your package: the number of Developer Seats and the length of your Update Period. The certificate is part of this license.
                  </p>
                </div>

                {/* 1. Definitions */}
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-2">
                    1. Definitions
                  </h5>
                  <ul className="space-y-1.5 pl-4 list-disc list-outside">
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200 font-mono text-xs">Kit</strong> — the source code, documentation, example application and images delivered with your purchase, and any updates you receive under section 5.
                    </li>
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200 font-mono text-xs">Developer Seat</strong> — one named individual permitted to access and work with the Kit&apos;s source code.
                    </li>
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200 font-mono text-xs">End Product</strong> — an application, website or software product you build in which the Kit is incorporated as part of a larger work.
                    </li>
                    <li>
                      <strong className="text-zinc-800 dark:text-zinc-200 font-mono text-xs">Update Period</strong> — the period stated on your certificate (3, 6 or 12 months) starting on your purchase date.
                    </li>
                  </ul>
                </div>

                {/* 2. What you may do */}
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-2 text-emerald-600 dark:text-emerald-400">
                    2. What you may do
                  </h5>
                  <ul className="space-y-1.5 pl-4 list-disc list-outside">
                    <li>Allow up to the number of Developer Seats on your certificate to use the Kit. Seats may belong to one organisation or one freelancer; a seat may be reassigned when a developer permanently leaves the project or company.</li>
                    <li>Use the Kit in an unlimited number of End Products, for yourself or for clients, commercial or non-commercial.</li>
                    <li>Modify the Kit in any way.</li>
                    <li>Distribute the Kit in compiled form as part of your End Products. Client projects may include the Kit&apos;s source inside the client&apos;s private source repository, provided the client does not reuse the Kit outside that End Product unless they purchase their own license.</li>
                    <li>Keep using every version you received permanently. The license does not expire when the Update Period ends.</li>
                  </ul>
                </div>

                {/* 3. What you may not do */}
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-2 text-red-600 dark:text-red-400">
                    3. What you may not do
                  </h5>
                  <ul className="space-y-1.5 pl-4 list-disc list-outside">
                    <li>Allow more developers than your Developer Seats to work with the Kit&apos;s source code.</li>
                    <li>Resell, sublicense, share or redistribute the Kit, or any substantial part of it, as source code or as a stand-alone product — including as a UI kit, template, theme, component library, starter or code generator that competes with the Kit, whether paid or free.</li>
                    <li>Publish the Kit&apos;s source code in a public repository, on pub.dev or on any publicly accessible location.</li>
                    <li>Remove this license from copies of the source code you keep.</li>
                  </ul>
                </div>

                {/* 4. Seats and upgrades */}
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1.5">
                    4. Seats and upgrades
                  </h5>
                  <p>
                    Need more seats or a longer Update Period? Buy the matching package; email the Seller at{' '}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-orange-500 underline font-medium hover:text-orange-400"
                    >
                      {CONTACT_EMAIL}
                    </a>{' '}
                    if you want the price of your earlier purchase considered. The Seller is not obliged to offer upgrade pricing.
                  </p>
                </div>

                {/* 5. Updates */}
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1.5">
                    5. Updates
                  </h5>
                  <p>
                    During the Update Period you are eligible to receive new versions of the Kit that the Seller releases. See docs/UPDATES.md for how updates are delivered. The Update Period is a window of eligibility; it is not a promise that a particular number of updates, features or release dates will happen. After the Update Period ends you keep all versions you received but are not entitled to later versions.
                  </p>
                </div>

                {/* 6. Third-party material */}
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1.5">
                    6. Third-party material
                  </h5>
                  <p>
                    The Kit is built on standard Next.js, React, and Tailwind CSS with TypeScript. Icons used in the Kit are referenced from Lucide React (ISC License). The Kit ships no restricted third-party runtime dependencies; all included preview screenshots are renders of the Kit itself. Names, companies, and figures in sample data are fictional.
                  </p>
                </div>

                {/* 7. No warranty */}
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1.5">
                    7. No warranty
                  </h5>
                  <p>
                    The Kit is provided &ldquo;as is&rdquo;, without warranty of any kind, express or implied, including fitness for a particular purpose and non-infringement. You are responsible for testing the Kit in your End Products.
                  </p>
                </div>

                {/* 8. Limitation of liability */}
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1.5">
                    8. Limitation of liability
                  </h5>
                  <p>
                    To the maximum extent permitted by law, the Seller&apos;s total liability arising from the Kit is limited to the amount you paid for it. The Seller is not liable for indirect, incidental or consequential damages.
                  </p>
                </div>

                {/* 9. Termination */}
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1.5">
                    9. Termination
                  </h5>
                  <p>
                    This license terminates automatically if you materially breach it and do not cure the breach within 14 days of notice. On termination you must stop using the Kit in new work; End Products already distributed before termination may continue to be distributed.
                  </p>
                </div>

                {/* 10. Refunds and consumer rights */}
                <div>
                  <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1.5">
                    10. Refunds and consumer rights
                  </h5>
                  <p>
                    Refunds are handled under the refund policy shown on the Gumroad product page at the time of purchase and by Gumroad, which sells the Kit as merchant of record and may issue refunds under its own policies. If a purchase is fully refunded, or reversed through a chargeback that is not overturned, the license for that purchase ends and copies of the Kit must be deleted. Nothing in this license limits rights you have under applicable consumer law.
                  </p>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
