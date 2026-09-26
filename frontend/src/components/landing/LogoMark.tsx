const RATIO = "681 / 185";

export default function LogoMark({
  color = "#143D2B",
  height = 22,
  fill = false,
  className = "",
}: {
  color?: string;
  height?: number | string;
  fill?: boolean;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label="NOCAP"
      className={className}
      style={{
        display: "inline-block",
        ...(fill ? { width: "100%", height: "auto" } : { height, width: "auto" }),
        aspectRatio: RATIO,
        backgroundColor: color,
        WebkitMaskImage: "url(/logo.png)",
        maskImage: "url(/logo.png)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
