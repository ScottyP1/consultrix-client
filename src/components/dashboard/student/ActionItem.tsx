import ItemContainer from '#/components/ItemContainer'

type ActionItemProps = {
  icon: React.ReactElement
  title: string
  subTitle: string
  btnLabel: string
  variant?: string
}
const ActionItem = ({
  icon,
  title,
  subTitle,
  btnLabel,
  variant = 'default',
}: ActionItemProps) => {
  return (
    <ItemContainer className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {icon}
        <div className="flex flex-col gap-1">
          <h4>{title}</h4>
          <h5 className="text-xs text-white/45">{subTitle}</h5>
        </div>
      </div>
      <button className="px-2 py-1 rounded-lg hover:cursor-pointer">
        {btnLabel}
      </button>
    </ItemContainer>
  )
}

export default ActionItem
