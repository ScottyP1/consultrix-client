import { createFileRoute } from '@tanstack/react-router'
import {
  LuBuilding2,
  LuGraduationCap,
  LuUsers,
  LuUserCheck,
  LuBookOpen,
  LuClipboardCheck,
  LuTrendingUp,
  LuActivity,
} from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import ItemContainer from '#/components/ItemContainer'
import StatCard from '#/components/StatCard'
import SectionFrame from '#/components/dashboard/SectionFrame'
import AdminBarChart from '#/components/admin/AdminBarChart'
import AdminDonutChart from '#/components/admin/AdminDonutChart'
import { useAdminData } from '#/hooks/admin/useAdminData'
import { formatDate, formatStatusLabel, getFullName } from '#/lib/consultrix-format'
import type { AdminStatsDto } from '#/api/consultrix'

export const Route = createFileRoute('/admin/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { meQuery, cohortsQuery, studentsQuery, facilitiesQuery, statsQuery, isLoading, error } =
    useAdminData()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader eyebrow="Admin" title="Loading dashboard" subtitle="Fetching platform data." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Admin"
          title="Dashboard unavailable"
          subtitle={error instanceof Error ? error.message : 'Unable to load admin dashboard.'}
        />
      </div>
    )
  }

  const me = meQuery.data
  const cohorts = cohortsQuery.data ?? []
  const students = studentsQuery.data ?? []
  const facilities = facilitiesQuery.data ?? []
  const s = statsQuery.data

  // Top KPI cards - only use stats endpoint when available, fall back to list counts
  const kpis = [
    { icon: LuGraduationCap, bg: '#0c2240', accent: '#38bdf8', label: 'Total Students', value: String(s?.totalStudents ?? students.length) },
    { icon: LuTrendingUp, bg: '#052e16', accent: '#4ade80', label: 'Placed', value: String(s?.studentsPlaced ?? 0) },
    { icon: LuUsers, bg: '#1e1b4b', accent: '#818cf8', label: 'Active Cohorts', value: String(s?.cohortsActive ?? cohorts.filter(c => c.status === 'ACTIVE').length) },
    { icon: LuBuilding2, bg: '#1c1107', accent: '#fb923c', label: 'Facilities', value: String(s?.totalFacilities ?? facilities.length) },
    { icon: LuBookOpen, bg: '#1e1b4b', accent: '#c084fc', label: 'Modules', value: String(s?.totalModules ?? '--') },
    { icon: LuClipboardCheck, bg: '#0f172a', accent: '#94a3b8', label: 'Submissions', value: String(s?.totalSubmissions ?? '--') },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Admin"
        title={`Welcome back, ${me?.firstName ?? 'Admin'}`}
        subtitle="Platform-wide CRM — live data across facilities, cohorts, students, and grades."
      />

      {/* KPI row */}
      <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => (
          <StatCard key={k.label} icon={k.icon} iconBgClassName={k.bg} iconAccent={k.accent} label={k.label} value={k.value} />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid gap-4 xl:grid-cols-3">
        <SectionFrame label="Student Pipeline">
          {s ? (
            <AdminBarChart
              layout="horizontal"
              height={160}
              data={[
                { label: 'Not Started', value: s.studentsNotStarted, color: '#475569' },
                { label: 'In Progress', value: s.studentsInProgress, color: '#38bdf8' },
                { label: 'Placed', value: s.studentsPlaced, color: '#4ade80' },
              ]}
            />
          ) : <NoStats />}
        </SectionFrame>

        <SectionFrame label="Grade Distribution">
          {s ? (
            <AdminBarChart
              layout="vertical"
              height={160}
              data={[
                { label: 'A', value: s.gradeCountA, color: '#4ade80' },
                { label: 'B', value: s.gradeCountB, color: '#38bdf8' },
                { label: 'C', value: s.gradeCountC, color: '#818cf8' },
                { label: 'D', value: s.gradeCountD, color: '#fb923c' },
                { label: 'F', value: s.gradeCountF, color: '#f87171' },
              ]}
            />
          ) : <NoStats />}
          {s?.platformAvgAssignmentGrade != null && (
            <p className="mt-2 text-center text-xs text-white/40">
              Platform avg <span className="text-white/70">{s.platformAvgAssignmentGrade}%</span>
            </p>
          )}
        </SectionFrame>

        <SectionFrame label="Cohort Status">
          {s ? (
            <AdminDonutChart
              height={190}
              innerRadius={45}
              outerRadius={72}
              data={[
                { label: 'Recruiting', value: s.cohortsRecruiting, color: '#818cf8' },
                { label: 'Interviewing', value: s.cohortsInterviewing, color: '#fb923c' },
                { label: 'Active', value: s.cohortsActive, color: '#4ade80' },
                { label: 'Completed', value: s.cohortsCompleted, color: '#38bdf8' },
                { label: 'Archived', value: s.cohortsArchived, color: '#475569' },
              ]}
            />
          ) : <NoStats />}
        </SectionFrame>
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 xl:grid-cols-3">
        <SectionFrame label="Submission Status">
          {s ? (
            <AdminDonutChart
              height={190}
              innerRadius={40}
              outerRadius={68}
              data={[
                { label: 'Graded', value: s.submissionsGraded, color: '#4ade80' },
                { label: 'Submitted', value: s.submissionsUngraded, color: '#38bdf8' },
                { label: 'Late', value: s.submissionsLate, color: '#fb923c' },
                { label: 'Missing', value: s.submissionsMissing, color: '#f87171' },
              ]}
            />
          ) : <NoStats />}
        </SectionFrame>

        <SectionFrame label="Interview Pipeline">
          {s ? (
            <AdminBarChart
              layout="horizontal"
              height={160}
              data={[
                { label: 'None', value: s.interviewNone, color: '#475569' },
                { label: 'Screen', value: s.interviewScreen, color: '#818cf8' },
                { label: 'Technical', value: s.interviewTechnical, color: '#38bdf8' },
                { label: 'Final', value: s.interviewFinal, color: '#4ade80' },
              ]}
            />
          ) : <NoStats />}
        </SectionFrame>

        <SectionFrame label="Facility Status">
          {s ? (
            <AdminDonutChart
              height={190}
              innerRadius={40}
              outerRadius={68}
              data={[
                { label: 'Active', value: s.facilitiesActive, color: '#4ade80' },
                { label: 'Planned', value: s.facilitiesPlanned, color: '#fb923c' },
                { label: 'Closed', value: s.facilitiesClosed, color: '#475569' },
              ]}
            />
          ) : <NoStats />}
        </SectionFrame>
      </div>

      {/* Cohort list */}
      <SectionFrame label="Cohorts at a Glance">
        {cohorts.length > 0 ? (
          <div className="flex flex-col gap-2">
            {cohorts.slice(0, 8).map((cohort) => {
              const enrolled = students.filter((s) => s.cohort?.id === cohort.id).length
              const fillPct = cohort.capacity > 0 ? Math.round((enrolled / cohort.capacity) * 100) : 0

              return (
                <div key={cohort.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 rounded-xl px-3 py-2.5 hover:bg-white/5 transition-colors">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{cohort.name}</p>
                    <p className="text-xs text-white/35">{cohort.facility?.name ?? 'No facility'}</p>
                  </div>
                  <div className="flex w-28 flex-col gap-1">
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-sky-500/70"
                        style={{ width: `${Math.min(fillPct, 100)}%` }}
                      />
                    </div>
                    <p className="text-right text-[10px] text-white/30">{enrolled}/{cohort.capacity}</p>
                  </div>
                  <span className="text-xs text-white/40">{formatDate(cohort.startDate)}</span>
                  <span className="rounded-full bg-white/8 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-white/50">
                    {formatStatusLabel(cohort.status)}
                  </span>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-white/40">No cohorts found.</p>
        )}
      </SectionFrame>

      {/* Bottom summary */}
      <GlassContainer className="p-5">
        <p className="mb-4 text-xs uppercase tracking-[0.28em] text-white/45">Admin Identity</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <ItemContainer className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">Name</p>
            <p className="text-lg font-semibold text-white">
              {getFullName(me?.firstName, me?.lastName) || 'Admin'}
            </p>
            <p className="text-sm text-white/45">{me?.email}</p>
          </ItemContainer>
          <ItemContainer className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">Platform</p>
            <p className="text-lg font-semibold text-white">
              {facilities.length} facilities · {cohorts.length} cohorts
            </p>
            <p className="text-sm text-white/45">
              {students.length} students enrolled
            </p>
          </ItemContainer>
          <ItemContainer className="space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">Grades</p>
            <p className="text-lg font-semibold text-white">
              {s ? `${s.totalGrades} recorded` : '--'}
            </p>
            <p className="text-sm text-white/45">
              {s?.platformAvgAssignmentGrade != null ? `${s.platformAvgAssignmentGrade}% platform avg` : 'No grade data yet'}
            </p>
          </ItemContainer>
        </div>
      </GlassContainer>
    </div>
  )
}

function NoStats() {
  return <p className="py-6 text-center text-xs text-white/30">Stats not available</p>
}
