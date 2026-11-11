import { NextResponse } from 'next/server';
import { PRICING_MATRIX, DIGITAL_SYSTEM_PLANS, planSlug } from '@/lib/constants';

/**
 * Shareable payment links on our own domain:
 *   todedev.com/buy/3-months-1-account  ->  Gumroad checkout for that package
 *   todedev.com/buy/12-months-digital-system -> Gumroad checkout for digital system
 * Unknown slugs fall back to the pricing section.
 */
const CHECKOUT_BY_SLUG: Record<string, string> = {
  ...Object.fromEntries(
    Object.entries(PRICING_MATRIX).flatMap(([period, byAccounts]) =>
      Object.entries(byAccounts).map(([accounts, pkg]) => [
        planSlug(Number(period), Number(accounts)),
        pkg.checkoutUrl,
      ])
    )
  ),
  ...Object.fromEntries(
    DIGITAL_SYSTEM_PLANS.map((p) => [p.slug, p.checkoutUrl])
  ),
};

export function GET(request: Request, { params }: { params: { plan: string } }) {
  const checkoutUrl = CHECKOUT_BY_SLUG[params.plan];
  return NextResponse.redirect(checkoutUrl ?? new URL('/#pricing', request.url), 307);
}
