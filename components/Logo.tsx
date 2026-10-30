// GrowWheel mark: three arcs (three founders, three lanes) turning as one wheel, growth arrow in the middle.
export function Mark({ size = 30 }) {
  return (
    <svg className="mk2" width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <g className="whl" strokeWidth="4.5" strokeLinecap="round">
        <circle cx="16" cy="16" r="12" pathLength="100" strokeDasharray="22 78" stroke="var(--action)" transform="rotate(-80 16 16)" />
        <circle cx="16" cy="16" r="12" pathLength="100" strokeDasharray="22 78" stroke="var(--focus)" transform="rotate(40 16 16)" />
        <circle cx="16" cy="16" r="12" pathLength="100" strokeDasharray="22 78" stroke="var(--accent)" transform="rotate(160 16 16)" />
      </g>
      <path className="ar2" d="M12.2 19.8l7.4-7.4M14 12.2h5.8V18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Logo({ className = "" }) {
  return (
    <>
      <Mark />
      <span className={`lgt ${className}`}>
        <b>Grow</b>
        <span>Wheel</span>
      </span>
    </>
  );
}
