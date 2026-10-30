// Dot grid texture. The parent decides where it sits and how it fades (see .dp in globals.css).
// gap = distance between dots, r = dot radius (px).
export default function DotPattern({ gap = 14, r = 1, className = "" }: { gap?: number; r?: number; className?: string }) {
  return (
    <span
      className={`dp ${className}`}
      style={{ "--g": gap + "px", "--r": r + "px" }}
      aria-hidden="true"
    />
  );
}
