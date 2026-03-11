import { Link } from '@tanstack/react-router'

const AuthBtnGroup = () => {
  return (
    <div className="flex gap-4 items-center justify-center">
      <Link
        to="/auth/register"
        className="bg-white rounded-lg px-3 py-1 md:px-6 text-black font-bold"
      >
        Join
      </Link>
      <Link
        to="/auth/login"
        className="outline-1 rounded-lg px-3 py-1 md:px-6 font-bold"
      >
        Login
      </Link>
    </div>
  )
}

export default AuthBtnGroup
