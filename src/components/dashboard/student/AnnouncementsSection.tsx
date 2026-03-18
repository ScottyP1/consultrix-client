import ItemContainer from '#/components/ItemContainer'

const AnnouncementsData = [
  {
    subject: 'Lesson Plan 3/11 Intro to SQL',
    description:
      'Getting started with SQL: Understanding Databases and Queries',
  },
  { subject: 'SBA Review', description: 'SBA Review' },
  {
    subject: 'Request preferred method',
    description:
      'Hi everyone, for any requests you can reach out to me via direct message.',
  },
]

const AnnouncementsSection = () => {
  return (
    <div className="flex flex-col gap-4">
      {AnnouncementsData.map((item) => (
        <ItemContainer className="flex flex-col justify-center">
          <h4>{item.subject}</h4>
          <span className="text-sm text-white/45">{item.description}</span>
        </ItemContainer>
      ))}
    </div>
  )
}

export default AnnouncementsSection
