const ItemContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className: string
}) => {
  return (
    <div
      className={`rounded-[14px] px-4 py-3 shadow-[0px_10px_30px_-18px_rgba(0,0,0,0.45),0px_1px_0px_rgba(255,255,255,0.08)_inset,0px_0px_0px_1px_rgba(255,255,255,0.02)_inset] backdrop-blur-[10px] ${className}`}
    >
      {children}
    </div>
  )
}

export default ItemContainer
