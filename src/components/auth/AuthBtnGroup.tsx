import { Link } from '@tanstack/react-router'

import { useAuth } from '@/context/AuthContext'

const AuthBtnGroup = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { isAuthenticated, logout } = useAuth()

  return (
    <div
      className="flex gap-3 items-center justify-center"
      style={{ fontFamily: '"Space Grotesk", "Manrope", sans-serif' }}
    >
      {isAuthenticated ? (
        <button
          type="button"
          className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70 transition hover:cursor-pointer hover:border-white/50 hover:text-white md:px-6"
          onClick={() => {
            logout()
            onNavigate?.()
          }}
        >
          Logout
        </button>
      ) : (
        <Link
          to="/auth/login"
          className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70 transition hover:border-white/50 hover:text-white md:px-6"
          onClick={onNavigate}
        >
          Login
        </Link>
      )}
    </div>
  )
}

export default AuthBtnGroup
