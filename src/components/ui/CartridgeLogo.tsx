interface Props {
  className?: string;
}

/** Logo autoral: um cartucho de jogo em pixel. */
export default function CartridgeLogo({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Cartucho"
    >
      <rect x="6" y="4" width="20" height="24" fill="rgb(var(--c-surface-2))" />
      <rect
        x="6"
        y="4"
        width="20"
        height="24"
        fill="none"
        stroke="rgb(var(--c-primary))"
        strokeWidth="2"
      />
      <rect x="9" y="8" width="14" height="9" fill="rgb(var(--c-bg))" />
      <rect x="11" y="10" width="10" height="1.5" fill="rgb(var(--c-secondary))" />
      <rect x="11" y="13" width="7" height="1.5" fill="rgb(var(--c-accent))" />
      <rect x="10" y="21" width="2" height="3" fill="rgb(var(--c-accent))" />
      <rect x="14" y="21" width="2" height="3" fill="rgb(var(--c-accent))" />
      <rect x="18" y="21" width="2" height="3" fill="rgb(var(--c-accent))" />
    </svg>
  );
}
