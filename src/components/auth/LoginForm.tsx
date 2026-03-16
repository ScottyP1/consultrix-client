import { Link } from '@tanstack/react-router'
import GlassButton from '../liquidGlass/GlassButton'
import GlassInput from '../liquidGlass/GlassInput'

import { FaApple } from 'react-icons/fa'

const LoginForm = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-12 px-6 w-full">
      <h2 className="text-3xl font-bold self-start">Sign in</h2>
      <div className="flex flex-col gap-4 w-full">
        {/* <section className="flex flex-col gap-4">
          <GlassButton
            label="Sign in with Apple"
            className=""
            icon={<FaApple size={30} />}
          />
          <GlassButton
            label="Sign in with Google"
            icon={<img src="/images/google-icon.png" width={30} />}
          />
        </section>
        <section className="flex gap-4 items-center justify-center">
          <div className="w-full bg-gray-500 h-px" />
          <span>or</span>
          <div className="w-full bg-gray-500 h-px" />
        </section> */}
        <section className="flex flex-col gap-4 w-full">
          <GlassInput placeholder="Email" />
          <GlassInput placeholder="Password" />
          <button className="bg-white hover:bg-white/80 hover:cursor-pointer text-black rounded-2xl p-4 font-bold">
            Sign in
          </button>
        </section>
        <section className="flex flex-col gap-2 justify-center items-center">
          <span>Forgot Password?</span>
          {/* <span className="text-white/40">
            No account?
            <Link to="/auth/register" className="text-white">
              {' '}
              Click here
            </Link>
          </span> */}
        </section>
      </div>
    </div>
  )
}

export default LoginForm
