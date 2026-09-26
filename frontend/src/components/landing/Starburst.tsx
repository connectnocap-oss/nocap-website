import { useMemo } from "react";

export default function Starburst({ points = 12, className = "" }: { points?: number; className?: string }) {
  const pts = useMemo(() => {
    const arr: string[] = [];
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? 50 : 18;
      const a = (Math.PI * i) / points - Math.PI / 2;
      arr.push(`${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`);
    }
    return arr.join(" ");
  }, [points]);

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <polygon points={pts} fill="currentColor" />
    </svg>
  );
}
