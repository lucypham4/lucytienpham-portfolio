/**
 * The logo as inline SVG so its parts can be animated — CSS cannot reach
 * inside an <img>. The supplied light and dark files differ only by inverted
 * tile and stroke colours, so one mark covers both: the tile takes the ink
 * colour and the strokes the page colour, which swap with the theme.
 */
export default function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 216 216"
      role="img"
      aria-label="Lucy Pham"
      className={`logo-mark ${className}`}
    >
      <rect
        width="216"
        height="216"
        rx="56"
        className="fill-black dark:fill-white"
      />
      <path
        className="logo-sun"
        d="M180.297 80.0538C180.297 92.8277 169.942 103.183 157.168 103.183C144.394 103.183 134.039 92.8277 134.039 80.0538C134.039 67.2799 144.394 56.9246 157.168 56.9246C169.942 56.9246 180.297 67.2799 180.297 80.0538Z"
        fill="#02AA4B"
      />
      {/* pathLength normalises both strokes to 1, so one dash value draws
          either of them regardless of their real lengths. */}
      <path
        className="logo-stroke logo-stroke-peak"
        d="M51 91.2751L73.2727 69.0001"
        pathLength={1}
        fill="none"
        strokeWidth={32}
        strokeLinecap="round"
      />
      <path
        className="logo-stroke logo-stroke-ridge"
        d="M142.469 155.442L107.469 122.442L75.4689 155.442"
        pathLength={1}
        fill="none"
        strokeWidth={32}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
