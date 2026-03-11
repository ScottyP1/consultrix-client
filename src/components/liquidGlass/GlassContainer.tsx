import type { CSSProperties, ReactNode } from 'react'

type GlassContainerProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

const baseStyle: CSSProperties = {
  background: 'rgba(255, 255, 255, 0.08)',
  boxShadow:
    '0px 6px 18px -12px rgba(0, 0, 0, 0.35), 0px 1px 6px -3px rgba(0, 0, 0, 0.25), 0px 1px 3px rgba(255, 255, 255, 0.12) inset',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
}

const GlassContainer = ({
  children,
  className = '',
  style,
}: GlassContainerProps) => {
  return (
    <div
      className={`rounded-[14px] h-12 border border-[rgba(255,255,255,0.28)] ${className}`}
      style={{ ...baseStyle, ...style }}
    >
      {children}
    </div>
  )
}

export default GlassContainer
