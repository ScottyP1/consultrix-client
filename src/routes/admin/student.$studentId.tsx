import { createFileRoute, Link } from '@tanstack/react-router'
import { LuArrowLeft, LuGraduationCap, LuClipboardCheck, LuUserCheck, LuAward } from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import ItemContainer from '#/components/ItemContainer'
import StatCard from '#/components/StatCard'
import SectionFrame from '#/components/dashboard/SectionFrame'
import AdminBarChart from '#/components/admin/AdminBarChart'
import FlagSection from '#/components/detail/FlagSection'
import { useAdminStudentDetail } from '#/hooks/admin/useAdminStudentDetail'
import { formatDate, formatStatusLabel, getFullName } from '#/lib/consultrix-format'

export const Route = createFileRoute('/admin/student/$studentId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { studentId } = Route.useParams()
  const id = Number(studentId)

  const {
    student,
    isLoading,
    modulesQuery,
    assignmentsQuery,
    gradesQuery,
    submissionsQuery,
    attendanceQuery,
    flagsQuery,
    createFlagMutation,
    resolveFlagMutation,
  } = useAdminStudentDetail(id)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader eyebrow="Student" title="Loading student…" />
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex flex-col gap-6">
        <BackLink />
        <PageHeader eyebrow="Student" title="Student not found" subtitle={`No student with ID ${id}`} />
      </div>
    )
  }

  const grades = gradesQuery.data ?? []
  const submissions = submissionsQuery.data ?? []
  const attendance = attendanceQuery.data ?? []
  const modules = modulesQuery.data ?? []
  const assignments = assignmentsQuery.data ?? []
  const flags = flagsQuery.data ?? []

  const name = getFullName(student.firstName, student.lastName)
  const presentDays = attendance.filter((a) => a.status === 'PRESENT').length
  const attendanceRate = attendance.length > 0 ? Math.round((presentDays / attendance.length) * 100) : null
  const overallGrade = grades.length > 0 ? grades[0].overallGradePercentage : null
  const letterGrade = grades.length > 0 ? grades[0].overallLetterGrade : null
  const lateSubmissions = submissions.filter((s) => s.status === 'LATE').length

  const moduleGradeMap = new Map<string, number>()
  grades.forEach((g) => {
    const mod = modules.find((m) => m.id === g.moduleId)
    const title = mod?.title ?? `Module ${g.moduleId}`
    if (!moduleGradeMap.has(title)) {
      moduleGradeMap.set(title, Number(g.moduleGradePercentage))
    }
  })
  const moduleGradeData = Array.from(moduleGradeMap.entries()).map(([label, value]) => ({
    label,
    value: Math.round(value),
    color: value >= 90 ? '#4ade80' : value >= 70 ? '#38bdf8' : '#f87171',
  }))

  return (
    <div className="flex flex-col gap-6">
      <BackLink />

      <div className="flex items-start justify-between gap-4">
        <PageHeader
          eyebrow="Student"
          title={name}
          subtitle={student.email}
        />
        <div className="flex shrink-0 flex-wrap gap-2 pt-1">
          {student.graduationStatus && (
            <StatusPill label={formatStatusLabel(student.graduationStatus)} />
          )}
          {student.pipelineStage && (
            <StatusPill label={`Pipeline: ${formatStatusLabel(student.pipelineStage)}`} />
          )}
          {student.interviewStage && student.interviewStage !== 'NONE' && (
            <StatusPill label={`Interview: ${formatStatusLabel(student.interviewStage)}`} />
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={LuAward} iconBgClassName="#0c2240" iconAccent="#38bdf8"
          label="Overall Grade" value={overallGrade != null ? `${overallGrade}%` : '--'} />
        <StatCard icon={LuGraduationCap} iconBgClassName="#1e1b4b" iconAccent="#818cf8"
          label="Letter Grade" value={letterGrade ?? '--'} />
        <StatCard icon={LuUserCheck} iconBgClassName="#052e16" iconAccent="#4ade80"
          label="Attendance" value={attendanceRate != null ? `${attendanceRate}%` : '--'} />
        <StatCard icon={LuClipboardCheck} iconBgClassName="#1c0a0a" iconAccent="#f87171"
          label="Late Submissions" value={String(lateSubmissions)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <GlassContainer className="space-y-4 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Profile</p>
          <div className="grid grid-cols-2 gap-3">
            <InfoItem label="Cohort" value={student.cohort?.name ?? '--'} />
            <InfoItem label="Facility" value={student.cohort?.facility?.name ?? '--'} />
            <InfoItem label="Grad Status" value={formatStatusLabel(student.graduationStatus)} />
            <InfoItem label="Pipeline" value={formatStatusLabel(student.pipelineStage)} />
            <InfoItem label="Interview" value={formatStatusLabel(student.interviewStage)} />
            <InfoItem label="Account Status" value={formatStatusLabel(student.status)} />
          </div>
          {(student.clientName || student.placementStartDate) && (
            <div className="border-t border-white/8 pt-4 grid grid-cols-2 gap-3">
              <InfoItem label="Client" value={student.clientName ?? '--'} />
              <InfoItem label="Placement Start" value={formatDate(student.placementStartDate)} />
            </div>
          )}
          {student.notes && (
            <div className="border-t border-white/8 pt-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45 mb-1">Notes</p>
              <p className="text-sm text-white/70">{student.notes}</p>
            </div>
          )}
        </GlassContainer>

        <SectionFrame label="Grade by Module">
          {moduleGradeData.length > 0 ? (
            <AdminBarChart
              layout="horizontal"
              height={Math.max(120, moduleGradeData.length * 38)}
              data={moduleGradeData}
            />
          ) : (
            <p className="py-6 text-center text-sm text-white/35">No graded modules yet.</p>
          )}
        </SectionFrame>
      </div>

      <SectionFrame label={`Submissions (${submissions.length})`}>
        {submissions.length > 0 ? (
          <div className="flex flex-col gap-2">
            {submissions.slice(0, 15).map((sub) => {
              const assignment = assignments.find((a) => a.id === sub.assignmentId)
              return (
                <div key={sub.submissionId} className="flex items-center justify-between gap-4 rounded-xl px-3 py-2 hover:bg-white/5 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-white">
                      {assignment?.title ?? `Assignment #${sub.assignmentId}`}
                    </p>
                    <p className="text-xs text-white/35">{formatDate(sub.submittedAt)}</p>
                  </div>
                  <SubmissionStatusBadge status={sub.status} />
                </div>
              )
            })}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-white/35">No submissions found.</p>
        )}
      </SectionFrame>

      <SectionFrame label={`Attendance Log (${attendance.length} records)`}>
        {attendance.length > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {attendance.slice(0, 30).map((record) => (
              <ItemContainer key={record.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{formatDate(record.attendanceDate)}</p>
                  {record.note && <p className="text-xs text-white/35">{record.note}</p>}
                </div>
                <AttendanceStatusBadge status={record.status} />
              </ItemContainer>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-white/35">No attendance records found.</p>
        )}
      </SectionFrame>

      <FlagSection
        flags={flags}
        studentId={id}
        onCreateFlag={(payload) => createFlagMutation.mutate(payload)}
        onResolveFlag={(flagId) => resolveFlagMutation.mutate(flagId)}
        isCreating={createFlagMutation.isPending}
        isResolving={resolveFlagMutation.isPending}
        createError={createFlagMutation.error}
      />
    </div>
  )
}

function BackLink() {
  return (
    <Link to="/admin/students" className="flex items-center gap-1.5 text-sm text-white/45 hover:text-white/70 transition-colors w-fit">
      <LuArrowLeft size={14} />
      Back to Students
    </Link>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.16em] text-white/40">{label}</p>
      <p className="text-sm text-white">{value || '--'}</p>
    </div>
  )
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/60">{label}</span>
  )
}

function SubmissionStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    SUBMITTED: 'bg-sky-500/15 text-sky-300',
    LATE: 'bg-amber-500/15 text-amber-300',
    MISSING: 'bg-red-500/15 text-red-300',
  }
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs ${map[status] ?? 'bg-white/8 text-white/50'}`}>
      {formatStatusLabel(status)}
    </span>
  )
}

function AttendanceStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PRESENT: 'text-emerald-400',
    ABSENT: 'text-red-400',
    LATE: 'text-amber-400',
  }
  return (
    <span className={`text-xs font-medium ${map[status] ?? 'text-white/50'}`}>
      {formatStatusLabel(status)}
    </span>
  )
}
