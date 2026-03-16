const Header = ({ title, subTitle }: { title: string; subTitle: string }) => {
  return (
    <div className="text-center">
      <h3 className="text-[11px] uppercase tracking-[0.6em] text-white/50">
        {subTitle}
      </h3>
      <h2 className="mt-3 text-2xl font-semibold tracking-[0.2em] text-white/90">
        {title}
      </h2>
    </div>
  )
}

export default Header
