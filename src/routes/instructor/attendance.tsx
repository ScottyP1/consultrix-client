import { useEffect, useMemo, useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useInstructorAttendanceMutations } from '#/hooks/instructor/useInstructorAttendanceMutations'
import { LuSave } from 'react-icons/lu'
import { getPlannedEventsForDate } from '#/api/consultrix'

import PageHeader from '#/components/PageHeader'
import AttendanceDetailPanel from '#/components/attendance/AttendanceDetailPanel'
import AttendanceRoster from '#/components/attendance/AttendanceRoster'
import AttendanceTable from '#/components/attendance/AttendanceTable'
import AttendanceToolbar from '#/components/attendance/AttendanceToolbar'
import SectionFrame from '#/components/dashboard/SectionFrame'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import type {
  AttendanceCohort,
  AttendanceRecord,
  AttendanceStatus,
} from '#/data/attendance/types'
import { useInstructorWorkspaceData } from '#/hooks/instructor/useInstructorWorkspaceData'
import { formatDate, formatStatusLabel } from '#/lib/consultrix-format'
import { deriveInstructorCohorts, getStudentName } from '#/lib/instructor-workspace'
import type { AttendanceRequestDto } from '#/api/consultrix'

export const Route = createFileRoute('/instructor/attendance')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    studentsQuery,
    modulesQuery,
    assignmentsQuery,
    attendanceQuery,
    isLoading,
    error,
  } = useInstructorWorkspaceData()
  const [activeView, setActiveView] = useState<'take' | 'history'>('take')
  const [statusFilter, setStatusFilter] = useState<'all' | AttendanceStatus>(
    'all',
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCohortId, setSelectedCohortId] = useState('')
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  )
  const [selectedSessionId, setSelectedSessionId] = useState('')
  const [selectedCell, setSelectedCell] = useState<{
    studentId: string
    sessionId: string
  } | null>(null)
  const [localRecordOverrides, setLocalRecordOverrides] = useState<
    Record<string, AttendanceRecord>
  >({})
  const [isSavingSession, setIsSavingSession] = useState(false)
  const [saveSessionError, setSaveSessionError] = useState<string | null>(null)

  const { createAttendanceMutation, updateAttendanceMutation } = useInstructorAttendanceMutations()

  const plannedEventsQuery = useQuery({
    queryKey: ['planned-events', selectedDate],
    queryFn: () => getPlannedEventsForDate(selectedDate),
    staleTime: 1000 * 60 * 2,
  })

  async function handleSubmitSession() {
    if (!selectedSession || !selectedCohort) return
    const cohortId = Number(selectedCohort.id)
    const sessionDate = selectedSession.id
    const sessionRecords = mergedRecords.filter((r) => r.sessionId === sessionDate)

    setIsSavingSession(true)
    setSaveSessionError(null)
    try {
      await Promise.all(
        sessionRecords.map((record) => {
          const payload: AttendanceRequestDto = {
            cohortId,
            studentUserId: Number(record.studentId),
            attendanceDate: sessionDate,
            status: record.status.toUpperCase(),
            note: record.note || undefined,
          }
          if (record.attendanceId != null) {
            return updateAttendanceMutation.mutateAsync({ id: record.attendanceId, payload })
          }
          return createAttendanceMutation.mutateAsync(payload)
        }),
      )
      setLocalRecordOverrides({})
    } catch (err) {
      setSaveSessionError(err instanceof Error ? err.message : 'Failed to save attendance')
    } finally {
      setIsSavingSession(false)
    }
  }

  const cohorts = useMemo<AttendanceCohort[]>(() => {
    const students = studentsQuery.data ?? []
    const modules = modulesQuery.data ?? []
    const assignments = assignmentsQuery.data ?? []
    const attendance = attendanceQuery.data ?? []
    const derivedCohorts = deriveInstructorCohorts({
      students,
      modules,
      assignments,
      attendance,
    })

    return derivedCohorts.map((cohort) => {
      const cohortStudents = students
        .filter((student) => student.cohort?.id === cohort.id)
        .map((student) => ({
          id: String(student.id),
          name: getStudentName(student),
          email: student.email,
        }))
      const existingDates = Array.from(
        new Set(
          attendance
            .filter((record) => record.cohort.id === cohort.id)
            .map((record) => record.attendanceDate),
        ),
      )

      // Always include today so the instructor can take attendance on any date
      const today = new Date().toISOString().slice(0, 10)
      const allDates = Array.from(new Set([...existingDates, today])).sort(
        (left, right) => new Date(left).getTime() - new Date(right).getTime(),
      )

      const sessions = allDates.map((date) => ({
        id: date,
        label: date === today ? `Today (${formatDate(date)})` : formatDate(date),
        date: formatDate(date),
        topic: cohort.name,
      }))

      const records = attendance
        .filter((record) => record.cohort.id === cohort.id)
        .map((record) => ({
          attendanceId: record.id,
          studentId: String(record.student.id),
          sessionId: record.attendanceDate,
          status: toAttendanceStatus(record.status),
          note: record.note ?? '',
        }))

      return {
        id: String(cohort.id),
        name: cohort.name,
        term: cohort.term,
        students: cohortStudents,
        sessions,
        records,
      }
    })
  }, [
    assignmentsQuery.data,
    attendanceQuery.data,
    modulesQuery.data,
    studentsQuery.data,
  ])

  useEffect(() => {
    if (!selectedCohortId && cohorts[0]?.id) {
      setSelectedCohortId(cohorts[0].id)
    }
  }, [cohorts, selectedCohortId])

  const selectedCohort =
    cohorts.find((cohort) => cohort.id === selectedCohortId) ?? cohorts[0]

  // Keep the session in sync with the selected date
  useEffect(() => {
    setSelectedSessionId(selectedDate)
  }, [selectedDate])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Attendance"
          title="Loading attendance"
          subtitle="Fetching live cohort attendance data."
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Attendance"
          title="Attendance unavailable"
          subtitle={error.message}
        />
      </div>
    )
  }

  if (!selectedCohort) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Attendance"
          title="No cohorts available"
          subtitle="No live attendance cohorts were returned for this instructor."
        />
      </div>
    )
  }

  const mergedRecords = mergeAttendanceRecords(
    selectedCohort.records,
    localRecordOverrides,
  )
  const selectedSession =
    selectedCohort.sessions.find((session) => session.id === selectedSessionId) ??
    selectedCohort.sessions.at(-1) ??
    selectedCohort.sessions[0]

  const filteredStudents = selectedCohort.students.filter((student) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) {
      return false
    }

    if (statusFilter === 'all' || !selectedSession) {
      return true
    }

    return mergedRecords.some(
      (record) =>
        record.studentId === student.id &&
        record.sessionId === selectedSession.id &&
        record.status === statusFilter,
    )
  })

  const selectedStudent = selectedCell
    ? selectedCohort.students.find((student) => student.id === selectedCell.studentId)
    : undefined
  const detailSession = selectedCell
    ? selectedCohort.sessions.find((session) => session.id === selectedCell.sessionId)
    : undefined
  const selectedRecord = selectedCell
    ? (mergedRecords.find(
        (record) =>
          record.studentId === selectedCell.studentId &&
          record.sessionId === selectedCell.sessionId,
      ) ?? {
        studentId: selectedCell.studentId,
        sessionId: selectedCell.sessionId,
        status: 'absent' as const,
        note: '',
      })
    : undefined
  const selectedSessionRecords = selectedSession
    ? mergedRecords.filter((record) => record.sessionId === selectedSession.id)
    : []

  const updateLocalRecord = (
    studentId: string,
    sessionId: string,
    updater: (record: AttendanceRecord) => AttendanceRecord,
  ) => {
    setLocalRecordOverrides((current) => {
      const currentRecord =
        current[`${studentId}:${sessionId}`] ??
        mergedRecords.find(
          (record) =>
            record.studentId === studentId && record.sessionId === sessionId,
        ) ?? {
          studentId,
          sessionId,
          status: 'absent' as const,
          note: '',
        }

      return {
        ...current,
        [`${studentId}:${sessionId}`]: updater(currentRecord),
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Attendance"
        title="Instructor Attendance"
        subtitle="Live attendance history with local review controls."
      />

      <AttendanceToolbar
        cohortOptions={cohorts.map((cohort) => ({
          id: cohort.id,
          name: cohort.name,
          term: cohort.term,
        }))}
        selectedCohortId={selectedCohort.id}
        onCohortChange={(value) => {
          setSelectedCohortId(value)
          setSelectedCell(null)
        }}
        selectedDate={selectedDate}
        onDateChange={(value) => {
          setSelectedDate(value)
          setSelectedCell(null)
        }}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveView('take')}
          className={`rounded-xl px-4 py-2 text-sm transition ${
            activeView === 'take'
              ? 'bg-blue-600 text-white'
              : 'border border-white/10 text-white/60'
          }`}
        >
          Take Attendance
        </button>
        <button
          type="button"
          onClick={() => setActiveView('history')}
          className={`rounded-xl px-4 py-2 text-sm transition ${
            activeView === 'history'
              ? 'bg-blue-600 text-white'
              : 'border border-white/10 text-white/60'
          }`}
        >
          History
        </button>
      </div>

      {activeView === 'take' && selectedSession ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <SectionFrame
            label={`${selectedCohort.name} · ${selectedSession.label}`}
            className="min-h-[36rem]"
          >
            <AttendanceRoster
              students={filteredStudents}
              session={selectedSession}
              records={selectedSessionRecords}
              plannedEvents={plannedEventsQuery.data ?? []}
              selectedStudentId={selectedCell?.studentId}
              onSelectStudent={(studentId) =>
                setSelectedCell({ studentId, sessionId: selectedSession.id })
              }
              onStatusChange={(studentId, status) =>
                updateLocalRecord(studentId, selectedSession.id, (record) => ({
                  ...record,
                  status,
                }))
              }
            />
          </SectionFrame>

          <AttendanceDetailPanel
            student={selectedStudent}
            session={detailSession}
            record={selectedRecord}
            onStatusChange={(status) => {
              if (!selectedCell) {
                return
              }

              updateLocalRecord(
                selectedCell.studentId,
                selectedCell.sessionId,
                (record) => ({
                  ...record,
                  status,
                }),
              )
            }}
            onNoteChange={(note) => {
              if (!selectedCell) {
                return
              }

              updateLocalRecord(
                selectedCell.studentId,
                selectedCell.sessionId,
                (record) => ({
                  ...record,
                  note,
                }),
              )
            }}
          />
        </div>
      ) : (
        <GlassContainer className="p-0">
          <AttendanceTable
            students={filteredStudents}
            sessions={selectedCohort.sessions}
            records={mergedRecords}
            selectedCell={selectedCell}
            onSelectCell={(studentId, sessionId) =>
              setSelectedCell({ studentId, sessionId })
            }
          />
        </GlassContainer>
      )}

      {activeView === 'take' && selectedSession && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleSubmitSession}
            disabled={isSavingSession}
            className="flex items-center gap-2 rounded-xl bg-sky-500/20 px-5 py-2.5 text-sm font-medium text-sky-300 transition-colors hover:bg-sky-500/30 disabled:opacity-50"
          >
            <LuSave size={14} />
            {isSavingSession ? 'Saving…' : 'Submit Session'}
          </button>
          {saveSessionError && (
            <p className="text-xs text-red-400">{saveSessionError}</p>
          )}
        </div>
      )}
    </div>
  )
}

function mergeAttendanceRecords(
  records: AttendanceRecord[],
  overrides: Record<string, AttendanceRecord>,
) {
  const merged = new Map(
    records.map((record) => [`${record.studentId}:${record.sessionId}`, record]),
  )

  Object.entries(overrides).forEach(([key, record]) => {
    merged.set(key, record)
  })

  return Array.from(merged.values())
}

function toAttendanceStatus(status: string): AttendanceStatus {
  const normalized = status.toLowerCase()

  if (normalized === 'present' || normalized === 'late') {
    return normalized
  }

  return normalized === 'excused' ? 'excused' : 'absent'
}
