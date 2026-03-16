import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import GlassContainer from '../liquidGlass/GlassContainer'
import AuthBtnGroup from '../auth/AuthBtnGroup'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const navBase =
    'relative after:absolute after:left-0 after:-bottom-2 after:h-px after:w-full after:transition-transform'
  const navInactive =
    'text-white/70 hover:text-white after:scale-x-0 after:bg-white/60 hover:after:scale-x-100'

  const handleMenuToggle = () => {
    setIsMenuOpen((open) => {
      return !open
    })
  }

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current) return
      if (!menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <GlassContainer
      className="fixed top-5 z-50 inset-x-3 md:inset-x-8 h-16 border-white/10"
      style={{
        background: 'rgba(11, 15, 20, 0.22)',
        boxShadow:
          '0px 12px 30px -22px rgba(0, 0, 0, 0.7), 0px 1px 0px rgba(255, 255, 255, 0.08) inset',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <nav
        className="relative flex h-full items-center justify-between gap-10 px-6 text-center"
        style={{ fontFamily: '"Space Grotesk", "Manrope", sans-serif' }}
      >
        <button
          type="button"
          className="flex gap-4 items-center hover:cursor-pointer"
          onClick={() => scrollToSection('hero')}
        >
          <img
            src="/images/consultrix-icon.png"
            width={30}
            height={30}
            alt="Consultrix icon"
            className="contrast-75 brightness-150"
          />
          <span className="tracking-[0.45em] text-[11px] text-white/70">
            CONSULTRIX
          </span>
        </button>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            className="hover:cursor-pointer flex items-center justify-center rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-white/30 hover:text-white"
            onClick={handleMenuToggle}
          >
            {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
            <span className="ml-2 hidden sm:inline">Menu</span>
          </button>
          {isMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-4 w-72 rounded-2xl border border-white/10 bg-[#0B0F14]/95 p-4 text-left text-[11px] uppercase tracking-[0.28em] text-white/70 shadow-[0px_20px_45px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl"
            >
              <button
                role="menuitem"
                className={`${navBase} ${navInactive} block w-full rounded-xl px-4 py-3 text-left`}
                onClick={() => {
                  scrollToSection('hero')
                  setIsMenuOpen(false)
                }}
              >
                HOME
              </button>
              <button
                role="menuitem"
                className={`${navBase} ${navInactive} block w-full rounded-xl px-4 py-3 text-left`}
                onClick={() => {
                  scrollToSection('solutions')
                  setIsMenuOpen(false)
                }}
              >
                SOLUTIONS
              </button>
              <button
                role="menuitem"
                className={`${navBase} ${navInactive} block w-full rounded-xl px-4 py-3 text-left`}
                onClick={() => {
                  scrollToSection('capabilities')
                  setIsMenuOpen(false)
                }}
              >
                CORE CAPABILITIES
              </button>
              <button
                role="menuitem"
                className={`${navBase} ${navInactive} block w-full rounded-xl px-4 py-3 text-left`}
                onClick={() => {
                  scrollToSection('warehouse-ops')
                  setIsMenuOpen(false)
                }}
              >
                WAREHOUSE OPERATIONS
              </button>
              <button
                role="menuitem"
                className={`${navBase} ${navInactive} block w-full rounded-xl px-4 py-3 text-left`}
                onClick={() => {
                  scrollToSection('cohort-timeline')
                  setIsMenuOpen(false)
                }}
              >
                COHORT LIFECYCLE TIMELINE
              </button>
              <button
                role="menuitem"
                className={`${navBase} ${navInactive} block w-full rounded-xl px-4 py-3 text-left`}
                onClick={() => {
                  scrollToSection('key-benefits')
                  setIsMenuOpen(false)
                }}
              >
                KEY BENEFITS
              </button>
              <div className="mt-4 border-t border-white/10 pt-4">
                <AuthBtnGroup />
              </div>
            </div>
          )}
        </div>
      </nav>
    </GlassContainer>
  )
}

export default Navbar
