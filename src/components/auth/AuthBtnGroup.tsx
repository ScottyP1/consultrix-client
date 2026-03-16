import { Link } from '@tanstack/react-router'

const AuthBtnGroup = () => {
  return (
    <div
      className="flex gap-3 items-center justify-center"
      style={{ fontFamily: '"Space Grotesk", "Manrope", sans-serif' }}
    >
      <Link
        to="/auth/register"
        className="rounded-full bg-[#5AB0FF] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:brightness-110 md:px-6"
      >
        Join
      </Link>
      <Link
        to="/auth/login"
        className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70 transition hover:border-white/50 hover:text-white md:px-6"
      >
        Login
      </Link>
    </div>
  )
}

export default AuthBtnGroup
