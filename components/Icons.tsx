import type { CSSProperties } from "react";

type IconProps = { size?: number; className?: string };

export const SPARK = "M12 0C12.6 6.5 17.5 11.4 24 12C17.5 12.6 12.6 17.5 12 24C11.4 17.5 6.5 12.6 0 12C6.5 11.4 11.4 6.5 12 0Z";
export function Sparkle({ className, style }: { className?: string; style?: CSSProperties }) {
  return <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={SPARK} /></svg>;
}
export function Person({ size = 16, className }: IconProps) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="#fff" fillOpacity=".92" aria-hidden="true"><circle cx="12" cy="8.5" r="4.6" /><path d="M2.5 24c0-5.6 4.2-9 9.5-9s9.5 3.4 9.5 9z" /></svg>;
}
export function Quote({ size = 22, className }: IconProps) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 5C5.6 6.4 3 9.8 3 14v5h7v-7H6.6c.2-2 1.5-3.6 3.4-4.4zM21 5c-4.4 1.4-7 4.8-7 9v5h7v-7h-3.4c.2-2 1.5-3.6 3.4-4.4z" /></svg>;
}
export function Tick({ size = 14, className }: IconProps) {
  return <svg className={className} width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 6.4l2.6 2.6L10 3.4" /></svg>;
}
export function Plus({ size = 14 }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M7 1v12M1 7h12" /></svg>;
}
