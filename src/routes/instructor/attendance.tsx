import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import PageHeader from '#/components/PageHeader'
import AttendanceDetailPanel from '#/components/attendance/AttendanceDetailPanel'
import AttendanceRoster from '#/components/attendance/AttendanceRoster'
import AttendanceTable from '#/components/attendance/AttendanceTable'
import AttendanceToolbar from '#/components/attendance/AttendanceToolbar'
import SectionFrame from '#/components/dashboard/SectionFrame'
import GlassContainer from '#/components/liquidGlass/GlassContainer'
import { instructorAttendanceCohorts } from '#/data/attendance/instructor'
import type { AttendanceStatus } from '#/data/attendance/types'

export const Route = createFileRoute('/instructor/attendance')({
  component: RouteComponent,
})

function RouteComponent() {
  const [cohorts, setCohorts] = useState(instructorAttendanceCohorts)
  const [selectedCohortId, setSelectedCohortId] = useState(
    instructorAttendanceCohorts[0]?.id ?? '',
  )
  const [activeView, setActiveView] = useState<'take' | 'history'>('take')
  const [statusFilter, setStatusFilter] = useState<'all' | AttendanceStatus>(
    'all',
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSessionId, setSelectedSessionId] = useState(
    instructorAttendanceCohorts[0]?.sessions.at(-1)?.id ??
      instructorAttendanceCohorts[0]?.sessions[0]?.id ??
      '',
  )
  const [selectedCell, setSelectedCell] = useState<{
    studentId: string
    sessionId: string
  } | null>(null)

  const selectedCohort =
    cohorts.find((cohort) => cohort.id === selectedCohortId) ?? cohorts[0]

  if (!selectedCohort) {
    return null
  }

  const selectedSession =
    selectedCohort.sessions.find(
      (session) => session.id === selectedSessionId,
    ) ??
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

    if (statusFilter === 'all') {
      return true
    }

    return selectedCohort.records.some(
      (record) =>
        record.studentId === student.id && record.status === statusFilter,
    )
  })

  const selectedStudent = selectedCell
    ? selectedCohort.students.find(
        (student) => student.id === selectedCell.studentId,
      )
    : undefined
  const detailSession = selectedCell
    ? selectedCohort.sessions.find(
        (session) => session.id === selectedCell.sessionId,
      )
    : undefined
  const selectedRecord = selectedCell
    ? (selectedCohort.records.find(
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
    ? selectedCohort.records.filter(
        (record) => record.sessionId === selectedSession.id,
      )
    : []

  const updateSelectedRecord = (
    updater: (record: {
      studentId: string
      sessionId: string
      status: AttendanceStatus
      note?: string
    }) => {
      studentId: string
      sessionId: string
      status: AttendanceStatus
      note?: string
    },
  ) => {
    if (!selectedCell) {
      return
    }

    setCohorts((currentCohorts) =>
      currentCohorts.map((cohort) => {
        if (cohort.id !== selectedCohort.id) {
          return cohort
        }

        const existingRecord = cohort.records.find(
          (record) =>
            record.studentId === selectedCell.studentId &&
            record.sessionId === selectedCell.sessionId,
        ) ?? {
          studentId: selectedCell.studentId,
          sessionId: selectedCell.sessionId,
          status: 'absent' as const,
          note: '',
        }

        const nextRecord = updater(existingRecord)
        const hasExistingRecord = cohort.records.some(
          (record) =>
            record.studentId === selectedCell.studentId &&
            record.sessionId === selectedCell.sessionId,
        )

        return {
          ...cohort,
          records: hasExistingRecord
            ? cohort.records.map((record) =>
                record.studentId === selectedCell.studentId &&
                record.sessionId === selectedCell.sessionId
                  ? nextRecord
                  : record,
              )
            : [...cohort.records, nextRecord],
        }
      }),
    )
  }

  const updateAttendanceRecord = (
    studentId: string,
    sessionId: string,
    updater: (record: {
      studentId: string
      sessionId: string
      status: AttendanceStatus
      note?: string
    }) => {
      studentId: string
      sessionId: string
      status: AttendanceStatus
      note?: string
    },
  ) => {
    setCohorts((currentCohorts) =>
      currentCohorts.map((cohort) => {
        if (cohort.id !== selectedCohort.id) {
          return cohort
        }

        const existingRecord = cohort.records.find(
          (record) =>
            record.studentId === studentId && record.sessionId === sessionId,
        ) ?? {
          studentId,
          sessionId,
          status: 'absent' as const,
          note: '',
        }

        const nextRecord = updater(existingRecord)
        const hasExistingRecord = cohort.records.some(
          (record) =>
            record.studentId === studentId && record.sessionId === sessionId,
        )

        return {
          ...cohort,
          records: hasExistingRecord
            ? cohort.records.map((record) =>
                record.studentId === studentId && record.sessionId === sessionId
                  ? nextRecord
                  : record,
              )
            : [...cohort.records, nextRecord],
        }
      }),
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Attendance"
        title="Instructor Attendance"
        subtitle="Take attendance quickly in the morning, then switch to history when you need to audit or revise older sessions."
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
          const nextCohort =
            cohorts.find((cohort) => cohort.id === value) ?? cohorts[0]

          setSelectedSessionId(
            nextCohort?.sessions.at(-1)?.id ??
              nextCohort?.sessions[0]?.id ??
              '',
          )
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
            label={`${selectedCohort.name} Morning Roster`}
            className="min-h-[36rem]"
          >
            <div className="space-y-5">
              <GlassContainer className="p-5">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                      Active Session
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {selectedSession.label}
                    </p>
                    <p className="text-sm text-white/45">
                      {selectedSession.date} · {selectedSession.topic}
                    </p>
                  </div>

                  <label className="space-y-2">
                    <span className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                      Session
                    </span>
                    <select
                      value={selectedSession.id}
                      onChange={(event) => {
                        const nextSessionId = event.target.value
                        setSelectedSessionId(nextSessionId)
                        setSelectedCell((current) =>
                          current
                            ? { ...current, sessionId: nextSessionId }
                            : current,
                        )
                      }}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                    >
                      {selectedCohort.sessions.map((session) => (
                        <option
                          key={session.id}
                          value={session.id}
                          className="bg-slate-950"
                        >
                          {session.label} · {session.date}
                        </option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      filteredStudents.forEach((student) => {
                        updateAttendanceRecord(
                          student.id,
                          selectedSession.id,
                          (record) => ({
                            ...record,
                            status: 'present',
                          }),
                        )
                      })
                    }}
                    className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-emerald-500"
                  >
                    Mark Visible Present
                  </button>
                </div>
              </GlassContainer>

              <AttendanceRoster
                students={filteredStudents}
                session={selectedSession}
                records={selectedSessionRecords}
                selectedStudentId={selectedCell?.studentId}
                onSelectStudent={(studentId) =>
                  setSelectedCell({ studentId, sessionId: selectedSession.id })
                }
                onStatusChange={(studentId, status) =>
                  updateAttendanceRecord(
                    studentId,
                    selectedSession.id,
                    (record) => ({
                      ...record,
                      status,
                    }),
                  )
                }
              />
            </div>
          </SectionFrame>

          <AttendanceDetailPanel
            student={selectedStudent}
            session={detailSession ?? selectedSession}
            record={selectedRecord}
            onStatusChange={(status) =>
              updateSelectedRecord((record) => ({
                ...record,
                status,
              }))
            }
            onNoteChange={(note) =>
              updateSelectedRecord((record) => ({
                ...record,
                note,
              }))
            }
          />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <SectionFrame
            label={`${selectedCohort.name} Session Matrix`}
            className="min-h-[36rem]"
          >
            <AttendanceTable
              students={filteredStudents}
              sessions={selectedCohort.sessions}
              records={selectedCohort.records}
              selectedCell={selectedCell}
              onSelectCell={(studentId, sessionId) =>
                setSelectedCell({ studentId, sessionId })
              }
            />
          </SectionFrame>

          <AttendanceDetailPanel
            student={selectedStudent}
            session={detailSession}
            record={selectedRecord}
            onStatusChange={(status) =>
              updateSelectedRecord((record) => ({
                ...record,
                status,
              }))
            }
            onNoteChange={(note) =>
              updateSelectedRecord((record) => ({
                ...record,
                note,
              }))
            }
          />
        </div>
      )}
    </div>
  )
}
