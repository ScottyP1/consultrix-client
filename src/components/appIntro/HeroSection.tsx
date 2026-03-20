const HeroSection = () => {
  return (
    <section
      id="purpose"
      className="flex scroll-mt-28 flex-col gap-10 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="flex-1">
        <h1
          className="mt-6 text-6xl leading-[0.95] tracking-tight md:text-8xl"
          style={{
            fontFamily: '"Archivo Black", "Bebas Neue", sans-serif',
          }}
        >
          Workforce Lifecycle Management
          <span className="block text-[#5AB0FF]">Platform</span>
        </h1>
        <p
          className="mt-6 max-w-2xl text-lg text-white/70 md:text-xl"
          style={{ fontFamily: '"Space Grotesk", "Manrope", sans-serif' }}
        >
          A unified system to manage training cohorts, warehouse operations,
          academic progress, and placement pipelines.
        </p>
      </div>

      <div
        className="flex w-full max-w-sm flex-col gap-6 border-l border-white/10 pl-6 text-sm text-white/70"
        style={{ fontFamily: '"Space Grotesk", "Manrope", sans-serif' }}
      >
        <div className="text-xs uppercase tracking-[0.4em] text-white/50">
          Focus Areas
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-base text-white">
            WFM · Training · Placement
          </span>
          <span className="text-white/60">
            Centralize cohorts, compliance, and warehouse ops in a single data
            spine.
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/50">
          <span className="h-px w-10 bg-white/20" />
          Built for scale
        </div>
      </div>
    </section>
  )
}

export default HeroSection
