interface ParticleBackgroundProps {
  color?: string
  className?: string
}

export function ParticleBackground({
  color = '#B87744',
  className = '',
}: ParticleBackgroundProps) {
  const filterId = `particleFilter-${color
    .replace('#', '')
    .replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <div className={`absolute inset-0 ${className}`}>
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.066666670143604279 0.066666670143604279"
              stitchTiles="stitch"
              numOctaves="3"
              result="noise"
              seed="7605"
            />
            <feColorMatrix
              in="noise"
              type="luminanceToAlpha"
              result="alphaNoise"
            />
            <feComponentTransfer in="alphaNoise" result="coloredNoise1">
              <feFuncA
                type="discrete"
                tableValues="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
              />
            </feComponentTransfer>
            <feComposite
              operator="in"
              in2="shape"
              in="coloredNoise1"
              result="noise1Clipped"
            />
            <feFlood floodColor="rgba(0, 0, 0, 0.15)" result="color1Flood" />
            <feComposite
              operator="in"
              in2="noise1Clipped"
              in="color1Flood"
              result="color1"
            />
            <feMerge result="effect1_noise">
              <feMergeNode in="shape" />
              <feMergeNode in="color1" />
            </feMerge>
          </filter>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={color}
          filter={`url(#${filterId})`}
        />
      </svg>
    </div>
  )
}
