const GlowOrb = ({ className }: { className?: string }) => {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="page-accent" />
      <div
        className={`absolute -top-48 left-[-15%] h-200 w-200 rounded-full bg-[radial-gradient(circle,rgba(90,176,255,0.55),rgba(11,15,20,0)_80%)] blur-2xl ${className}`}
      />
    </div>
  )
}

export default GlowOrb
