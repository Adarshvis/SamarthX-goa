import React from 'react'

// Custom SVG recreation of the 3D-style school campus illustration.
// Ported as-is from the reference frontend.
export default function SchoolIllustration() {
  return (
    <svg viewBox="0 0 640 480" className="w-full h-auto select-none" role="img" aria-label="Higher Education campus illustration">
      {/* Platform */}
      <ellipse cx="320" cy="370" rx="290" ry="95" fill="#dbeafe" />
      <ellipse cx="320" cy="362" rx="272" ry="86" fill="#e8f1fc" />
      <ellipse cx="320" cy="356" rx="250" ry="78" fill="#f1f7fd" />

      {/* Pathway */}
      <path d="M290 300 L350 300 L390 430 L250 430 Z" fill="#dde8f5" />
      <path d="M300 300 L340 300 L370 430 L270 430 Z" fill="#eaf2fb" />

      {/* Left wing */}
      <rect x="105" y="215" width="140" height="105" rx="6" fill="#ffffff" stroke="#dbe6f3" strokeWidth="2" />
      <rect x="105" y="205" width="140" height="16" rx="5" fill="#eef4fb" stroke="#dbe6f3" strokeWidth="1.5" />
      <rect x="122" y="240" width="26" height="32" rx="3" fill="#9ec5f5" />
      <rect x="158" y="240" width="26" height="32" rx="3" fill="#9ec5f5" />
      <rect x="194" y="240" width="26" height="32" rx="3" fill="#9ec5f5" />
      <rect x="122" y="284" width="26" height="24" rx="3" fill="#c3dbf7" />
      <rect x="158" y="284" width="26" height="24" rx="3" fill="#c3dbf7" />
      <rect x="194" y="284" width="26" height="24" rx="3" fill="#c3dbf7" />

      {/* Right wing */}
      <rect x="395" y="215" width="140" height="105" rx="6" fill="#ffffff" stroke="#dbe6f3" strokeWidth="2" />
      <rect x="395" y="205" width="140" height="16" rx="5" fill="#eef4fb" stroke="#dbe6f3" strokeWidth="1.5" />
      <rect x="412" y="240" width="26" height="32" rx="3" fill="#9ec5f5" />
      <rect x="448" y="240" width="26" height="32" rx="3" fill="#9ec5f5" />
      <rect x="484" y="240" width="26" height="32" rx="3" fill="#9ec5f5" />
      <rect x="412" y="284" width="26" height="24" rx="3" fill="#c3dbf7" />
      <rect x="448" y="284" width="26" height="24" rx="3" fill="#c3dbf7" />
      <rect x="484" y="284" width="26" height="24" rx="3" fill="#c3dbf7" />

      {/* Main building */}
      <rect x="228" y="150" width="184" height="180" rx="6" fill="#ffffff" stroke="#d5e2f2" strokeWidth="2" />
      <rect x="218" y="138" width="204" height="20" rx="6" fill="#eaf1fa" stroke="#d5e2f2" strokeWidth="1.5" />
      <path d="M256 138 L320 96 L384 138 Z" fill="#f4f8fd" stroke="#d5e2f2" strokeWidth="2" />
      <circle cx="320" cy="124" r="8" fill="#dbeafe" stroke="#b7d2f2" strokeWidth="1.5" />

      {/* Flag */}
      <line x1="320" y1="96" x2="320" y2="48" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      <rect x="320" y="48" width="42" height="9" fill="#f97316" />
      <rect x="320" y="57" width="42" height="9" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.5" />
      <rect x="320" y="66" width="42" height="9" fill="#16a34a" />
      <circle cx="341" cy="61.5" r="3" fill="none" stroke="#1e3a8a" strokeWidth="1" />

      {/* Windows main */}
      <rect x="246" y="172" width="30" height="36" rx="3" fill="#9ec5f5" />
      <rect x="305" y="172" width="30" height="36" rx="3" fill="#9ec5f5" />
      <rect x="364" y="172" width="30" height="36" rx="3" fill="#9ec5f5" />

      {/* Banner */}
      <rect x="244" y="222" width="152" height="22" rx="5" fill="#2563eb" />
      <text x="320" y="237" textAnchor="middle" fill="#ffffff" fontSize="11.5" fontWeight="700" letterSpacing="1.5" fontFamily="Inter, sans-serif">HIGHER EDUCATION</text>

      {/* Entrance columns + door */}
      <rect x="262" y="256" width="10" height="74" fill="#e9f0fa" stroke="#d5e2f2" strokeWidth="1" />
      <rect x="368" y="256" width="10" height="74" fill="#e9f0fa" stroke="#d5e2f2" strokeWidth="1" />
      <rect x="296" y="262" width="48" height="68" rx="4" fill="#3b82f6" />
      <rect x="304" y="270" width="32" height="26" rx="3" fill="#93c5fd" />
      <line x1="320" y1="262" x2="320" y2="330" stroke="#2563eb" strokeWidth="2" />

      {/* Steps */}
      <rect x="272" y="330" width="96" height="8" rx="3" fill="#e3ecf8" />
      <rect x="262" y="338" width="116" height="8" rx="3" fill="#d9e6f6" />

      {/* Trees */}
      {[{ x: 92, y: 330, s: 1.1 }, { x: 168, y: 352, s: 0.85 }, { x: 552, y: 330, s: 1.1 }, { x: 476, y: 352, s: 0.85 }, { x: 232, y: 368, s: 0.7 }, { x: 412, y: 368, s: 0.7 }].map((t, i) => (
        <g key={i} transform={`translate(${t.x} ${t.y}) scale(${t.s})`}>
          <rect x="-3" y="6" width="6" height="18" rx="2" fill="#b08968" />
          <circle cx="0" cy="-6" r="18" fill="#86c99a" />
          <circle cx="-11" cy="2" r="12" fill="#9ad3ab" />
          <circle cx="11" cy="2" r="12" fill="#77bd8d" />
        </g>
      ))}

      {/* Students (simple figures) */}
      {[{ x: 258, y: 398 }, { x: 296, y: 412 }, { x: 344, y: 412 }, { x: 382, y: 398 }, { x: 210, y: 386 }, { x: 430, y: 386 }].map((p, i) => (
        <g key={`s-${i}`} transform={`translate(${p.x} ${p.y})`}>
          <circle cx="0" cy="-14" r="5" fill="#f0c8a0" />
          <path d="M-6 -8 Q0 -12 6 -8 L5 6 L-5 6 Z" fill={i % 2 ? '#60a5fa' : '#3b82f6'} />
          <rect x="-4" y="6" width="3" height="9" rx="1.5" fill="#334155" />
          <rect x="1" y="6" width="3" height="9" rx="1.5" fill="#334155" />
        </g>
      ))}

      {/* Bushes */}
      <ellipse cx="130" cy="388" rx="22" ry="9" fill="#a7d8b6" />
      <ellipse cx="512" cy="388" rx="22" ry="9" fill="#a7d8b6" />
    </svg>
  )
}
