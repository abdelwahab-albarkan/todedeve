'use client';

import React, { useState } from 'react';

// -----------------------------------------------------------------------------
// 1. Interactive Area / Line Chart
// -----------------------------------------------------------------------------

interface DataPoint {
  label: string;
  value: number;
  displayValue?: string;
}

interface AreaChartProps {
  data?: DataPoint[];
  height?: number;
  lineColor?: string;
  gradientId?: string;
  yMin?: number;
  yMax?: number;
  yAxisLabels?: string[];
  unit?: string;
}

const DEFAULT_WEEKLY_DATA: DataPoint[] = [
  { label: 'Mon', value: 28, displayValue: '28%' },
  { label: 'Tue', value: 50, displayValue: '50%' },
  { label: 'Wed', value: 45, displayValue: '45%' },
  { label: 'Thu', value: 68, displayValue: '68%' },
  { label: 'Fri', value: 80, displayValue: '80%' },
  { label: 'Sat', value: 72, displayValue: '72%' },
  { label: 'Sun', value: 95, displayValue: '95%' },
];

export function AreaChart({
  data = DEFAULT_WEEKLY_DATA,
  height = 200,
  lineColor = '#F97316',
  gradientId = 'orangeGradient',
  yMin = 0,
  yMax = 100,
  yAxisLabels = ['100%', '80%', '60%', '40%', '20%', '0%'],
  unit = '%',
}: AreaChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 600;
  const paddingX = 40;
  const paddingY = 20;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Calculate coordinates
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartWidth;
    const normalizedY = (d.value - yMin) / (yMax - yMin);
    const y = paddingY + (1 - normalizedY) * chartHeight;
    return { x, y, ...d };
  });

  // Build SVG path with cubic bezier smoothing
  const buildSmoothPath = () => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const linePath = buildSmoothPath();
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="w-full select-none overflow-x-auto no-scrollbar">
      <div className="flex gap-3 min-w-[420px] sm:min-w-0">
        {/* Y-Axis scale */}
        <div className="flex flex-col justify-between text-[11px] font-mono text-zinc-500 py-1 shrink-0 w-8 text-right">
          {yAxisLabels.map((lbl, idx) => (
            <span key={idx}>{lbl}</span>
          ))}
        </div>

        {/* SVG Container */}
        <div className="relative flex-1">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto overflow-visible"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity="0.45" />
                <stop offset="70%" stopColor={lineColor} stopOpacity="0.08" />
                <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
              </linearGradient>
              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Grid horizontal dashed guidelines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const y = paddingY + pct * chartHeight;
              return (
                <line
                  key={idx}
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#1E293B"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              );
            })}

            {/* Filled Area */}
            <path d={areaPath} fill={`url(#${gradientId})`} />

            {/* Stroke Line */}
            <path
              d={linePath}
              fill="none"
              stroke={lineColor}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#neonGlow)"
            />

            {/* Interactive Data Point Dots */}
            {points.map((p, idx) => (
              <g key={idx} className="cursor-pointer">
                {/* Invisible larger hover hit area */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="14"
                  fill="transparent"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
                
                {/* Visible dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hoveredIdx === idx ? '6' : '4.5'}
                  fill="#ffffff"
                  stroke={lineColor}
                  strokeWidth="3"
                  className="transition-all duration-150"
                />

                {/* Hover Tooltip Card in SVG */}
                {hoveredIdx === idx && (
                  <g transform={`translate(${p.x}, ${p.y - 32})`}>
                    <rect
                      x="-30"
                      y="-16"
                      width="60"
                      height="24"
                      rx="6"
                      fill="#0D1424"
                      stroke={lineColor}
                      strokeWidth="1.5"
                    />
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                      alignmentBaseline="middle"
                    >
                      {p.displayValue || `${p.value}${unit}`}
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>

          {/* X-Axis Labels */}
          <div className="flex justify-between text-[11px] font-mono text-zinc-400 mt-2 px-6">
            {data.map((d, idx) => (
              <span
                key={idx}
                className={hoveredIdx === idx ? 'text-amber-400 font-bold' : ''}
              >
                {d.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// 2. Interactive SVG Donut Chart with Legend
// -----------------------------------------------------------------------------

export interface DonutSegment {
  label: string;
  count: number;
  percentage: number;
  color: string; // hex or tailwind
}

interface DonutChartProps {
  totalLabel: string;
  totalSublabel: string;
  segments: DonutSegment[];
  size?: number;
}

export function DonutChart({
  totalLabel,
  totalSublabel,
  segments,
  size = 180,
}: DonutChartProps) {
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 w-full">
      
      {/* SVG Ring with Center Counter */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#151F32"
            strokeWidth={strokeWidth}
          />

          {/* Colored Segments */}
          {segments.map((seg, idx) => {
            const strokeDasharray = `${(seg.percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -currentOffset;
            currentOffset += (seg.percentage / 100) * circumference;

            return (
              <circle
                key={idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth - 2}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 hover:opacity-90"
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-extrabold text-white font-sans leading-none">
            {totalLabel}
          </span>
          <span className="text-xs text-zinc-400 font-medium mt-1">
            {totalSublabel}
          </span>
        </div>
      </div>

      {/* Legend Column */}
      <div className="flex-1 min-w-[170px] space-y-2.5">
        {segments.map((seg, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-md shrink-0 shadow-sm"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-zinc-300 font-medium truncate">{seg.label}</span>
            </div>

            <div className="flex items-center gap-3 font-mono">
              <span className="text-white font-bold">{seg.count}</span>
              <span className="text-zinc-500 w-8 text-right">{seg.percentage}%</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// -----------------------------------------------------------------------------
// 3. Team Productivity Vertical Bar Chart
// -----------------------------------------------------------------------------

export interface MemberProductivity {
  name: string;
  avatar: string;
  percentage: number;
  color: string;
}

interface ProductivityBarChartProps {
  data: MemberProductivity[];
}

export function ProductivityBarChart({ data }: ProductivityBarChartProps) {
  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-1.5 sm:gap-3 h-48 pt-6 pb-2 px-2 border-b border-[#1E293B]">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
            {/* Hover tooltip percentage */}
            <span className="text-[11px] font-mono font-bold text-white mb-2 transition-transform group-hover:scale-110">
              {item.percentage}%
            </span>

            {/* Colored Column with gradient and rounded top */}
            <div className="w-full max-w-[42px] bg-[#141C32] rounded-t-xl overflow-hidden h-full flex items-end">
              <div
                className="w-full rounded-t-xl transition-all duration-500 shadow-md"
                style={{
                  height: `${item.percentage}%`,
                  background: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Member Names & Avatars below */}
      <div className="flex justify-between items-center gap-1.5 sm:gap-3 mt-3 px-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 min-w-0 flex flex-col items-center text-center">
            <img
              src={item.avatar}
              alt={item.name}
              className="w-7 h-7 rounded-full object-cover border border-zinc-700 mb-1"
            />
            <span className="text-xs font-medium text-zinc-300 truncate w-full max-w-14">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

