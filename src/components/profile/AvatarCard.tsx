import GlassContainer from '../liquidGlass/GlassContainer'

const AvatarCard = () => {
  return (
    <GlassContainer className="flex flex-col gap-2 justify-center items-center">
      <div className="h-40 w-40 bg-blue-500 rounded-full" />
      <h2 className="text-lg">User name</h2>
      <span className="text-sm text-white/45">Student ID: STU-2024 0042</span>
      <button className="bg-blue-600 w-full py-2 rounded-lg mt-2">
        Edit Profile
      </button>
    </GlassContainer>
  )
}

export default AvatarCard
