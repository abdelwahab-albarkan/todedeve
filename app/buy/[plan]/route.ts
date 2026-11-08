import { NextResponse } from 'next/server';
import { PRICING_MATRIX, planSlug } from '@/lib/constants';

/**
 * Shareable payment links on our own domain:
 *   todedev.com/buy/3-months-1-account  ->  Gumroad checkout for that package
 * Unknown slugs fall back to the pricing section.
 */
const CHECKOUT_BY_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(PRICING_MATRIX).flatMap(([period, byAccounts]) =>
    Object.entries(byAccounts).map(([accounts, pkg]) => [
      planSlug(Number(period), Number(accounts)),
      pkg.checkoutUrl,
    ])
  )
);

export function GET(request: Request, { params }: { params: { plan: string } }) {
  const checkoutUrl = CHECKOUT_BY_SLUG[params.plan];
  return NextResponse.redirect(checkoutUrl ?? new URL('/#pricing', request.url), 307);
}
