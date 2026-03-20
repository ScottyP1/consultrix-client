import type { ReactNode } from 'react'

import GlassContainer from '../liquidGlass/GlassContainer'

const SectionFrame = ({
  className,
  label,
  headerClassName,
  contentClassName,
  children,
}: {
  className?: string
  label?: string
  headerClassName?: string
  contentClassName?: string
  children: ReactNode
}) => {
  return (
    <GlassContainer
      className={`flex h-full flex-col overflow-hidden p-5 ${className ?? ''}`}
    >
      <div
        className={`flex h-full min-h-0 flex-col gap-5 ${contentClassName ?? ''}`}
      >
        {label && (
          <header className={`space-y-1 ${headerClassName ?? ''}`}>
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/45">
              {label}
            </p>
          </header>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </GlassContainer>
  )
}

export default SectionFrame
