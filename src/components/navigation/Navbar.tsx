import { Link } from '@tanstack/react-router'

import GlassContainer from '../liquidGlass/GlassContainer'
import AuthBtnGroup from '../auth/AuthBtnGroup'

const Navbar = () => {
  return (
    <GlassContainer className="fixed top-5 z-50 inset-x-3 md:inset-x-8 h-16">
      <nav className="flex h-full items-center justify-between gap-10 px-6 text-center">
        <Link to="." className="flex gap-4 items-center">
          <img
            src="/images/consultrix-icon.png"
            width={30}
            height={30}
            alt="Consultrix icon"
            className="contrast-50 brightness-300"
          />
          <span className="tracking-[5px] text-xs text-gray-400">
            CONSULTRIX
          </span>
        </Link>
        <div className="hidden md:flex gap-12 items-center justify-center">
          <Link
            to="."
            className="tracking-[3px] text-white/50 hover:text-white"
          >
            HOME
          </Link>
          <Link
            to="."
            className="tracking-[3px] text-white/50 hover:text-white"
          >
            PURPOSE
          </Link>
          <Link
            to="."
            className="tracking-[3px] text-white/50 hover:text-white"
          >
            LEARN MORE
          </Link>
        </div>
        <AuthBtnGroup />
      </nav>
    </GlassContainer>
  )
}

export default Navbar
