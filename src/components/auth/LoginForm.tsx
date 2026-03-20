import { useState, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'

import GlassInput from '../liquidGlass/GlassInput'

import { useLogin } from '@/hooks/useLogin'
import { getDefaultRouteForRole } from '@/lib/auth-role'

const LoginForm = () => {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      const session = await loginMutation.mutateAsync({
        email,
        password,
      })

      void navigate({ to: getDefaultRouteForRole(session.role) })
    } catch {}
  }

  return (
    <div className="flex flex-col justify-center items-center gap-12 px-6 w-full">
      <h2 className="text-3xl font-bold self-start">Sign in</h2>
      <div className="flex flex-col gap-4 w-full">
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <GlassInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
          <GlassInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          {loginMutation.error ? (
            <p className="text-sm text-red-300">
              {loginMutation.error instanceof Error
                ? loginMutation.error.message
                : 'Unable to sign in.'}
            </p>
          ) : null}
          <button
            type="submit"
            className="bg-white hover:bg-white/80 hover:cursor-pointer text-black rounded-2xl p-4 font-bold disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <section className="flex flex-col gap-2 justify-center items-center">
          <span>Forgot Password?</span>
        </section>
      </div>
    </div>
  )
}

export default LoginForm
