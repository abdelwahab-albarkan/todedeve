'use client';

import * as React from 'react';

export interface Series {
  key: string;
  label: string;
  color: string;
  values: number[];
  format?: (v: number) => string;
  /** Plot against its own scale (e.g. order count next to revenue). */
  ownScale?: boolean;
}

function niceMax(v: number) {
  if (v <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * pow;
}

/** Smooth path through points (Catmull-Rom → Bézier). */
function smooth(pts: [number, number][], floor = Infinity) {
  if (pts.length < 2) return pts.length ? `M${pts[0][0]},${pts[0][1]}` : '';
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = Math.min(floor, p1[1] + (p2[1] - p0[1]) / 6);
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = Math.min(floor, p2[1] - (p3[1] - p1[1]) / 6);
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

export function AreaChart({ labels, series, height = 260, yFormat = (v) => String(v), dots = true }: { labels: string[]; series: Series[]; height?: number; yFormat?: (v: number) => string; dots?: boolean }) {
  const id = React.useId().replace(/:/g, '');
  const [hover, setHover] = React.useState<number | null>(null);
  const wrap = React.useRef<HTMLDivElement>(null);
  const W = 720;
  const H = height;
  const pad = { l: 56, r: 14, t: 16, b: 30 };
  const n = labels.length;
  const main = series.filter((s) => !s.ownScale);
  const max = niceMax(Math.max(1, ...main.flatMap((s) => s.values)));
  const x = (i: number) => pad.l + (n <= 1 ? 0 : (i * (W - pad.l - pad.r)) / (n - 1));
  const yFor = (s: Series) => {
    const m = s.ownScale ? niceMax(Math.max(1, ...s.values)) * 1.8 : max;
    return (v: number) => pad.t + (1 - v / m) * (H - pad.t - pad.b);
  };
  const ticks = [0, 0.2, 0.4, 0.6, 0.8, 1].map((f) => f * max);
  const labelEvery = Math.max(1, Math.ceil(n / 8));

  const onMove = (e: React.PointerEvent) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r || n === 0) return;
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (n - 1));
    setHover(Math.max(0, Math.min(n - 1, i)));
  };

  return (
    <div ref={wrap} className="relative w-full select-none" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Chart of ${series.map((s) => s.label).join(' and ')}`}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`${id}-${s.key}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.55" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
          <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={yFor(main[0] ?? series[0])(t)} y2={yFor(main[0] ?? series[0])(t)} stroke="rgba(255,255,255,0.07)" />
            <text x={pad.l - 10} y={yFor(main[0] ?? series[0])(t) + 4} textAnchor="end" fontSize="12" fill="#a3a3a3">
              {yFormat(t)}
            </text>
          </g>
        ))}
        {labels.map((l, i) =>
          (i % labelEvery === 0 && n - 1 - i >= labelEvery / 2) || i === n - 1 ? (
            <text key={i} x={x(i)} y={H - 8} textAnchor="middle" fontSize="12" fill="#a3a3a3">
              {l}
            </text>
          ) : null
        )}
        {series.map((s) => {
          const y = yFor(s);
          const pts = s.values.map((v, i) => [x(i), y(v)] as [number, number]);
          const line = smooth(pts, H - pad.b);
          const area = `${line} L${x(n - 1)},${H - pad.b} L${x(0)},${H - pad.b} Z`;
          return (
            <g key={s.key}>
              <path d={area} fill={`url(#${id}-${s.key})`} />
              <path d={line} fill="none" stroke={s.color} strokeWidth="3" filter={`url(#${id}-glow)`} strokeLinecap="round" />
              {dots && pts.map(([px, py], i) => (i % labelEvery === 0 || i === n - 1 ? <circle key={i} cx={px} cy={py} r="4" fill={s.color} stroke="#13131B" strokeWidth="2" /> : null))}
            </g>
          );
        })}
        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} stroke="rgba(255,255,255,0.25)" />
            {series.map((s) => (
              <circle key={s.key} cx={x(hover)} cy={yFor(s)(s.values[hover] ?? 0)} r="6" fill="#fff" stroke={s.color} strokeWidth="3" />
            ))}
          </g>
        )}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-[150px] -translate-x-1/2 rounded-xl border border-white/10 bg-[#1A1A24]/95 px-3 py-2 text-xs shadow-xl backdrop-blur"
          style={{ left: `${Math.min(85, Math.max(15, (x(hover) / W) * 100))}%` }}
        >
          <div className="mb-1 font-semibold text-white">{labels[hover]}</div>
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-2 text-neutral-300">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              {s.label}: <span className="font-semibold text-white">{(s.format ?? String)(s.values[hover] ?? 0)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Donut({ segments, center, sub, size = 200, thickness = 30 }: { segments: { label: string; value: number; color: string }[]; center: string; sub: string; size?: number; thickness?: number }) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full max-w-[220px]" role="img" aria-label={`${sub}: ${segments.map((s) => `${s.label} ${((s.value / total) * 100).toFixed(1)}%`).join(', ')}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={thickness} />
      {segments.map((s) => {
        const len = (s.value / total) * c;
        const el = (
          <circle
            key={s.label}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${Math.max(0, len - 2)} ${c}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ filter: `drop-shadow(0 0 6px ${s.color}66)` }}
          />
        );
        offset += len;
        return el;
      })}
      <text x="50%" y="47%" textAnchor="middle" fontSize={size / 7} fontWeight="800" fill="#fff">
        {center}
      </text>
      <text x="50%" y="62%" textAnchor="middle" fontSize={size / 12} fill="#d4d4d4">
        {sub}
      </text>
    </svg>
  );
}

export function Legend({ items, total }: { items: { label: string; value: number; color: string }[]; total: number }) {
  return (
    <ul className="w-full space-y-3">
      {items.map((s) => (
        <li key={s.label} className="flex items-center justify-between gap-3 text-sm">
          <span className="flex items-center gap-2.5 text-neutral-200">
            <span className="h-3 w-3 rounded-full" style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }} />
            {s.label}
          </span>
          <span className="font-semibold text-white">{total ? ((s.value / total) * 100).toFixed(1) : '0.0'}%</span>
        </li>
      ))}
    </ul>
  );
}
