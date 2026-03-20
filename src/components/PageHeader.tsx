type PageHeaderProps = {
  eyebrow?: string
  title?: string
  subtitle?: string
}

const PageHeader = ({ eyebrow, title, subtitle }: PageHeaderProps) => {
  return (
    <header className="space-y-1">
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.3em] text-white/45">
          {eyebrow}
        </p>
      )}
      <h1 className="text-3xl font-semibold tracking-tight text-white">
        {title}
      </h1>
      {subtitle && <p className="text-sm text-white/55">{subtitle}</p>}
    </header>
  )
}

export default PageHeader
