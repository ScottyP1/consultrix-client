type GlassButtonProps = {
  className?: string
  label: string
  icon: React.ReactElement
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const GlassButton = ({ className = '', label, icon }: GlassButtonProps) => {
  return (
    <button
      onClick={() => alert('Future feature')}
      className={`flex font-bold items-center justify-center gap-4 rounded-[14px] border border-[rgba(255,255,255,0.28)] bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,.2)] hover:cursor-pointer px-4 py-2 text-[15px] text-white placeholder:text-white/60 shadow-[0px_6px_18px_-12px_rgba(0,0,0,0.35),_0px_1px_6px_-3px_rgba(0,0,0,0.25),_0px_1px_3px_rgba(255,255,255,0.12)_inset] backdrop-blur-[10px] outline-none transition focus:border-white/60 focus:ring-2 focus:ring-white/20 ${className}`}
    >
      {icon && icon}
      {label}
    </button>
  )
}

export default GlassButton
