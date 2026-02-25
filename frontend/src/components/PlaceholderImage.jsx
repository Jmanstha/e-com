export function PlaceholderImage() {
  return (
    <div className="w-full h-48 flex items-center justify-center bg-[#f0e6d6] rounded-t-xl overflow-hidden">
      <svg
        viewBox="0 0 120 100"
        className="w-28 h-28 opacity-60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* yarn ball */}
        <circle cx="60" cy="50" r="36" fill="#c97d4e" opacity="0.3" />
        <circle
          cx="60"
          cy="50"
          r="36"
          stroke="#c97d4e"
          strokeWidth="2"
          fill="none"
        />
        {/* yarn lines */}
        <path
          d="M30 35 Q60 20 90 35"
          stroke="#a0522d"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M25 50 Q60 38 95 50"
          stroke="#a0522d"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M28 65 Q60 55 92 65"
          stroke="#a0522d"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M35 78 Q60 70 85 78"
          stroke="#a0522d"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* needle */}
        <line
          x1="78"
          y1="18"
          x2="96"
          y2="72"
          stroke="#8B6914"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="96" cy="74" r="3" fill="#8B6914" />
      </svg>
    </div>
  );
}
