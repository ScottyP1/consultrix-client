import type { CSSProperties, ReactNode } from 'react'

type GlassContainerProps = {
  children?: ReactNode
  className?: string
  style?: CSSProperties
}

const baseStyle: CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  boxShadow:
    '0px 10px 30px -18px rgba(0, 0, 0, 0.45), 0px 1px 0px rgba(255, 255, 255, 0.08) inset, 0px 0px 0px 1px rgba(255, 255, 255, 0.02) inset',
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
      className={`rounded-[14px] border border-white/10 bg-white/5 px-4 py-3 ${className}`}
      style={{ ...baseStyle, ...style }}
    >
      {children}
    </div>
  )
}

export default GlassContainer
