import { ImageResponse } from 'next/og';
import { BRAND_NAME, DOMAIN_NAME, PRODUCT_NAME, PRODUCT_TAGLINE } from '@/lib/constants';

export const alt = `${BRAND_NAME} — ${PRODUCT_NAME}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

function Tile({ opacity }: { opacity: number }) {
  return <div style={{ width: 34, height: 34, borderRadius: 9, background: 'white', opacity }} />;
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: '#080C14',
          backgroundImage:
            'radial-gradient(circle at 85% 10%, rgba(249,115,22,0.35), transparent 45%), radial-gradient(circle at 10% 100%, rgba(168,85,247,0.25), transparent 45%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              background: 'linear-gradient(135deg, #fb923c, #f97316 50%, #ea580c)',
              display: 'flex',
              flexWrap: 'wrap',
              alignContent: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: 10,
            }}
          >
            <Tile opacity={1} />
            <Tile opacity={0.55} />
            <Tile opacity={0.55} />
            <Tile opacity={1} />
          </div>
          <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: -1 }}>{BRAND_NAME}</div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>{PRODUCT_NAME}</div>
          <div style={{ fontSize: 32, color: '#a1a1aa', lineHeight: 1.3, maxWidth: 980 }}>{PRODUCT_TAGLINE}</div>
        </div>

        {/* Footer row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 26 }}>
          <div style={{ display: 'flex', color: '#fb923c', fontWeight: 700 }}>{DOMAIN_NAME.toLowerCase()}</div>
          <div style={{ display: 'flex', color: '#71717a' }}>Next.js 14 · TypeScript · Tailwind CSS</div>
        </div>
      </div>
    ),
    size
  );
}
