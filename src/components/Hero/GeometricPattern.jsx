'use client'

export default function GeometricPattern() {
  return (
    <div className="absolute inset-0 z-0 opacity-20">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="diamondPattern"
            patternUnits="userSpaceOnUse"
            width="120"
            height="120"
            patternTransform="rotate(45)"
          >
            <rect width="60" height="60" fill="#1a1a1a" />
            <rect x="60" width="60" height="60" fill="#333" />
            <rect y="60" width="60" height="60" fill="#333" />
            <rect x="60" y="60" width="60" height="60" fill="#1a1a1a" />
            <line x1="0" y1="60" x2="120" y2="60" stroke="#444" strokeWidth="1" />
            <line x1="60" y1="0" x2="60" y2="120" stroke="#444" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diamondPattern)" />
      </svg>
    </div>
  )
}