const Header = ({ role, userName }: { role: string; userName: string }) => {
  return (
    <header className="space-y-2">
      <p className="text-xs uppercase tracking-[0.3em] text-white/45">
        {role} dashboard
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-white">
        Welcome back {userName}
      </h1>
    </header>
  )
}

export default Header
