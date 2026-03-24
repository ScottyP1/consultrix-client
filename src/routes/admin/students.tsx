import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { LuGraduationCap, LuTrendingUp, LuUserCheck, LuUserX } from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import ItemContainer from '#/components/ItemContainer'
import StatCard from '#/components/StatCard'
import { useAdminData } from '#/hooks/admin/useAdminData'
import { formatDate, formatStatusLabel, getFullName } from '#/lib/consultrix-format'

export const Route = createFileRoute('/admin/students')({
  component: RouteComponent,
})

function RouteComponent() {
  const { studentsQuery, isLoading, error } = useAdminData()
  const [search, setSearch] = useState('')
  const [pipelineFilter, setPipelineFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Students"
          title="Loading students"
          subtitle="Fetching student roster data."
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Students"
          title="Students unavailable"
          subtitle={error instanceof Error ? error.message : 'Unable to load students.'}
        />
      </div>
    )
  }

  const students = studentsQuery.data ?? []

  const activeStudents = students.filter((s) => s.graduationStatus === 'ACTIVE')
  const placedStudents = students.filter((s) => s.pipelineStage === 'COMPLETED')
  const withdrawnStudents = students.filter((s) => s.graduationStatus === 'WITHDRAWN')

  const filtered = students.filter((s) => {
    const name = getFullName(s.firstName, s.lastName).toLowerCase()
    const email = s.email.toLowerCase()
    const term = search.toLowerCase()
    const matchesSearch = !search || name.includes(term) || email.includes(term)
    const matchesPipeline = pipelineFilter === 'ALL' || s.pipelineStage === pipelineFilter
    const matchesStatus = statusFilter === 'ALL' || s.graduationStatus === statusFilter

    return matchesSearch && matchesPipeline && matchesStatus
  })

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Students"
        title="Students"
        subtitle="Full student roster with pipeline, placement, and enrollment status."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: LuGraduationCap, iconBgClassName: '#0c2240', iconAccent: '#38bdf8', label: 'Total Students', value: String(students.length) },
          { icon: LuUserCheck, iconBgClassName: '#052e16', iconAccent: '#4ade80', label: 'Active', value: String(activeStudents.length) },
          { icon: LuTrendingUp, iconBgClassName: '#1e1b4b', iconAccent: '#818cf8', label: 'Placed', value: String(placedStudents.length) },
          { icon: LuUserX, iconBgClassName: '#1c0a0a', iconAccent: '#f87171', label: 'Withdrawn', value: String(withdrawnStudents.length) },
        ].map((card) => (
          <StatCard
            key={card.label}
            icon={card.icon}
            iconBgClassName={card.iconBgClassName}
            iconAccent={card.iconAccent}
            label={card.label}
            value={card.value}
          />
        ))}
      </div>

      {/* Filters */}
      <GlassContainer className="flex flex-wrap items-center gap-3 p-4">
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[200px] flex-1 rounded-lg bg-white/8 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-white/20"
        />
        <select
          value={pipelineFilter}
          onChange={(e) => setPipelineFilter(e.target.value)}
          className="rounded-lg bg-white/8 px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-white/20"
        >
          <option value="ALL">All Stages</option>
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Placed</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg bg-white/8 px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-white/20"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="WITHDRAWN">Withdrawn</option>
        </select>
        <span className="ml-auto text-xs text-white/45">
          {filtered.length} of {students.length} students
        </span>
      </GlassContainer>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filtered.map((student) => (
            <Link
              key={student.id}
              to="/admin/student/$studentId"
              params={{ studentId: String(student.id) }}
              className="block rounded-2xl hover:bg-white/5 transition-colors"
            >
              <GlassContainer className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">
                        {getFullName(student.firstName, student.lastName)}
                      </p>
                      {student.status && (
                        <span className="rounded-full bg-white/8 px-2 py-0.5 text-xs uppercase tracking-[0.12em] text-white/50">
                          {formatStatusLabel(student.status)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/45">{student.email}</p>
                    {student.cohort && (
                      <p className="mt-0.5 text-xs text-white/35">
                        {student.cohort.name}
                        {student.cohort.facility?.name
                          ? ` · ${student.cohort.facility.name}`
                          : ''}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 shrink-0">
                    {student.graduationStatus && (
                      <PillBadge
                        label={`Grad: ${formatStatusLabel(student.graduationStatus)}`}
                        color={
                          student.graduationStatus === 'ACTIVE'
                            ? 'green'
                            : student.graduationStatus === 'COMPLETED'
                              ? 'blue'
                              : 'red'
                        }
                      />
                    )}
                    {student.pipelineStage && (
                      <PillBadge
                        label={`Pipeline: ${formatStatusLabel(student.pipelineStage)}`}
                        color={
                          student.pipelineStage === 'COMPLETED'
                            ? 'blue'
                            : student.pipelineStage === 'IN_PROGRESS'
                              ? 'amber'
                              : 'gray'
                        }
                      />
                    )}
                    {student.interviewStage && student.interviewStage !== 'NONE' && (
                      <PillBadge
                        label={`Interview: ${formatStatusLabel(student.interviewStage)}`}
                        color="violet"
                      />
                    )}
                  </div>
                </div>

                {(student.clientName || student.placementStartDate || student.notes) && (
                  <div className="mt-3 flex flex-wrap gap-4 border-t border-white/8 pt-3">
                    {student.clientName && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/45">Client</p>
                        <p className="text-sm text-white">{student.clientName}</p>
                      </div>
                    )}
                    {student.placementStartDate && (
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                          Placement Start
                        </p>
                        <p className="text-sm text-white">
                          {formatDate(student.placementStartDate)}
                        </p>
                      </div>
                    )}
                    {student.notes && (
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/45">Notes</p>
                        <p className="text-sm text-white/70">{student.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </GlassContainer>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/45">No students match the current filters.</p>
      )}
    </div>
  )
}

function PillBadge({
  label,
  color,
}: {
  label: string
  color: 'green' | 'blue' | 'red' | 'amber' | 'violet' | 'gray'
}) {
  const colorMap = {
    green: 'bg-emerald-500/15 text-emerald-300',
    blue: 'bg-sky-500/15 text-sky-300',
    red: 'bg-red-500/15 text-red-300',
    amber: 'bg-amber-500/15 text-amber-300',
    violet: 'bg-violet-500/15 text-violet-300',
    gray: 'bg-white/8 text-white/50',
  }

  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs ${colorMap[color]}`}>{label}</span>
  )
}
