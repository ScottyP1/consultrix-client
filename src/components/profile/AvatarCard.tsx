import GlassContainer from '../liquidGlass/GlassContainer'
import type { ProfileAvatarData } from '#/data/profile/types'

const AvatarCard = ({
  name,
  subtitle,
  buttonLabel,
  avatarLabel = 'U',
}: ProfileAvatarData) => {
  return (
    <GlassContainer className="flex flex-col gap-2 justify-center items-center">
      <div className="flex h-40 w-40 items-center justify-center rounded-full bg-blue-500 text-4xl font-semibold text-white">
        {avatarLabel}
      </div>
      <h2 className="text-lg">{name}</h2>
      <span className="text-sm text-white/45">{subtitle}</span>
      <button className="bg-blue-600 w-full py-2 rounded-lg mt-2">
        {buttonLabel}
      </button>
    </GlassContainer>
  )
}

export default AvatarCard
