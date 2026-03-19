import GlassContainer from '../liquidGlass/GlassContainer'

const SkillCard = ({ skills }: { skills: string[] }) => {
  return (
    <GlassContainer className="flex flex-col justify-center gap-4">
      <h2 className="text-2xl">Skills & Technologies</h2>
      <div className="flex gap-2 flex-wrap">
        {skills.map((item) => (
          <SkillPill key={item} label={item} />
        ))}
      </div>
    </GlassContainer>
  )
}

export default SkillCard

const SkillPill = ({ label }: { label: string }) => {
  return (
    <span className="text-blue-500 px-4 py-2 rounded-xl bg-blue-500/30 text-sm">
      {label}
    </span>
  )
}
