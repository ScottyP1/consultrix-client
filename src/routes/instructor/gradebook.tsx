import { useEffect, useMemo, useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LuFlag, LuCircleCheck } from 'react-icons/lu'

import PageHeader from '#/components/PageHeader'
import SectionFrame from '#/components/dashboard/SectionFrame'
import GradebookDetailPanel from '#/components/gradebook/GradebookDetailPanel'
import GradebookTable from '#/components/gradebook/GradebookTable'
import GradebookToolbar from '#/components/gradebook/GradebookToolbar'
import type {
  GradebookCohort,
  GradebookRecord,
  GradebookStatus,
} from '#/data/gradebook/types'
import { useInstructorWorkspaceData } from '#/hooks/instructor/useInstructorWorkspaceData'
import {
  formatAssignmentDueDate,
  toNumber,
  formatDate,
} from '#/lib/consultrix-format'
import {
  deriveInstructorCohorts,
  getStudentName,
} from '#/lib/instructor-workspace'
import {
  createFlag,
  createGrade,
  getMyFlags,
  resolveFlag,
  updateGrade,
  type GradeRequestDto,
  type StudentFlagRequestDto,
} from '#/api/consultrix'

export const Route = createFileRoute('/instructor/gradebook')({
  component: RouteComponent,
})

function RouteComponent() {
  const {
    meQuery,
    studentsQuery,
    modulesQuery,
    assignmentsQuery,
    submissionsQuery,
    attendanceQuery,
    gradesQuery,
    isLoading,
    error,
  } = useInstructorWorkspaceData()
  const queryClient = useQueryClient()
  const [selectedCohortId, setSelectedCohortId] = useState('')
  const [selectedModuleId, setSelectedModuleId] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | GradebookStatus>(
    'all',
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCell, setSelectedCell] = useState<{
    studentId: string
    assignmentId: string
  } | null>(null)
  const [localRecordOverrides, setLocalRecordOverrides] = useState<
    Record<string, GradebookRecord>
  >({})

  // Flag state
  const [flagStudentId, setFlagStudentId] = useState<number | null>(null)
  const [flagStudentName, setFlagStudentName] = useState('')
  const [flagReason, setFlagReason] = useState('')
  const [flagPriority, setFlagPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>(
    'MEDIUM',
  )

  const myFlagsQuery = useQuery({
    queryKey: ['instructor', 'my-flags'],
    queryFn: getMyFlags,
  })

  const createFlagMutation = useMutation({
    mutationFn: (payload: StudentFlagRequestDto) => createFlag(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructor', 'my-flags'] })
      setFlagStudentId(null)
      setFlagReason('')
      setFlagPriority('MEDIUM')
    },
  })

  const resolveFlagMutation = useMutation({
    mutationFn: (id: number) => resolveFlag(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['instructor', 'my-flags'] }),
  })

  const invalidateGrades = () => {
    queryClient.invalidateQueries({ queryKey: ['instructor', 'grades'] })
    queryClient.invalidateQueries({ queryKey: ['instructor', 'submissions'] })
  }

  const createGradeMutation = useMutation({
    mutationFn: (payload: GradeRequestDto) => createGrade(payload),
    onSuccess: invalidateGrades,
  })

  const updateGradeMutation = useMutation({
    mutationFn: ({ gradeId, payload }: { gradeId: number; payload: GradeRequestDto }) =>
      updateGrade(gradeId, payload),
    onSuccess: invalidateGrades,
  })

  const cohorts = useMemo<GradebookCohort[]>(() => {
    const students = studentsQuery.data ?? []
    const modules = modulesQuery.data ?? []
    const assignments = assignmentsQuery.data ?? []
    const submissions = submissionsQuery.data ?? []
    const attendance = attendanceQuery.data ?? []
    const grades = gradesQuery.data ?? []
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
      const cohortModules = modules
        .filter((module) => module.cohort?.id === cohort.id)
        .map((module) => ({
          id: String(module.id),
          title: module.title,
          order: module.orderIndex,
        }))
      const cohortAssignments = assignments
        .filter((assignment) => assignment.module.cohort?.id === cohort.id)
        .map((assignment, index) => ({
          id: String(assignment.id),
          moduleId: String(assignment.module.id),
          title: assignment.title,
          pointsPossible: toNumber(assignment.maxScore),
          dueDate: formatAssignmentDueDate(
            assignment.dueDate,
            assignment.dueTime,
          ),
          order: index,
        }))
      const cohortRecords = submissions
        .filter(
          (submission) => submission.assignment.module.cohort?.id === cohort.id,
        )
        .map((submission) => {
          const grade = grades.find(
            (item) => item.submission.id === submission.id,
          )

          return {
            studentId: String(submission.student.id),
            assignmentId: String(submission.assignment.id),
            submissionId: submission.id,
            gradeId: grade?.id,
            score: grade ? toNumber(grade.score) : null,
            status: grade ? 'graded' : 'submitted',
            feedback: grade?.feedback ?? '',
            updatedAt: grade?.gradedAt ?? submission.submittedAt ?? undefined,
          } satisfies GradebookRecord
        })

      return {
        id: String(cohort.id),
        name: cohort.name,
        term: cohort.term,
        students: cohortStudents,
        modules: cohortModules,
        assignments: cohortAssignments,
        records: cohortRecords,
      }
    })
  }, [
    assignmentsQuery.data,
    attendanceQuery.data,
    gradesQuery.data,
    modulesQuery.data,
    studentsQuery.data,
    submissionsQuery.data,
  ])

  useEffect(() => {
    if (!selectedCohortId && cohorts[0]?.id) {
      setSelectedCohortId(cohorts[0].id)
    }
  }, [cohorts, selectedCohortId])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Gradebook"
          title="Loading gradebook"
          subtitle="Fetching live grading data."
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Gradebook"
          title="Gradebook unavailable"
          subtitle={error.message}
        />
      </div>
    )
  }

  const selectedCohort =
    cohorts.find((cohort) => cohort.id === selectedCohortId) ?? cohorts[0]

  if (!selectedCohort) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Gradebook"
          title="No cohorts available"
          subtitle="No live gradebook cohorts were returned for this instructor."
        />
      </div>
    )
  }

  const visibleAssignments = selectedCohort.assignments.filter(
    (assignment) =>
      selectedModuleId === 'all' || assignment.moduleId === selectedModuleId,
  )
  const visibleAssignmentIds = new Set(
    visibleAssignments.map((assignment) => assignment.id),
  )
  const mergedRecords = mergeGradebookRecords(
    selectedCohort.records.filter((record) =>
      visibleAssignmentIds.has(record.assignmentId),
    ),
    localRecordOverrides,
  )
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

    return mergedRecords.some(
      (record) =>
        record.studentId === student.id &&
        visibleAssignmentIds.has(record.assignmentId) &&
        record.status === statusFilter,
    )
  })

  const selectedStudent = selectedCell
    ? selectedCohort.students.find(
        (student) => student.id === selectedCell.studentId,
      )
    : undefined
  const selectedAssignment = selectedCell
    ? selectedCohort.assignments.find(
        (assignment) => assignment.id === selectedCell.assignmentId,
      )
    : undefined
  const selectedRecord = selectedCell
    ? (mergedRecords.find(
        (record) =>
          record.studentId === selectedCell.studentId &&
          record.assignmentId === selectedCell.assignmentId,
      ) ?? {
        studentId: selectedCell.studentId,
        assignmentId: selectedCell.assignmentId,
        score: null,
        status: 'missing' as const,
        feedback: '',
      })
    : undefined

  const updateLocalRecord = (
    studentId: string,
    assignmentId: string,
    updater: (record: GradebookRecord) => GradebookRecord,
  ) => {
    setLocalRecordOverrides((current) => {
      const currentRecord = current[`${studentId}:${assignmentId}`] ??
        mergedRecords.find(
          (record) =>
            record.studentId === studentId &&
            record.assignmentId === assignmentId,
        ) ?? {
          studentId,
          assignmentId,
          score: null,
          status: 'missing' as const,
          feedback: '',
        }

      return {
        ...current,
        [`${studentId}:${assignmentId}`]: updater(currentRecord),
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Gradebook"
        title="Instructor Gradebook"
        subtitle="Live submission and grade data with local review controls."
      />

      <GradebookToolbar
        cohortOptions={cohorts.map((cohort) => ({
          id: cohort.id,
          name: cohort.name,
          term: cohort.term,
        }))}
        selectedCohortId={selectedCohort.id}
        onCohortChange={(value) => {
          setSelectedCohortId(value)
          setSelectedModuleId('all')
          setSelectedCell(null)
        }}
        modules={selectedCohort.modules}
        selectedModuleId={selectedModuleId}
        onModuleChange={setSelectedModuleId}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <SectionFrame
          label={`${selectedCohort.name} Grade Matrix`}
          className="min-h-[36rem]"
        >
          <GradebookTable
            modules={selectedCohort.modules}
            assignments={visibleAssignments}
            students={filteredStudents}
            records={mergedRecords}
            selectedCell={selectedCell}
            onSelectCell={(studentId, assignmentId) =>
              setSelectedCell({ studentId, assignmentId })
            }
          />
        </SectionFrame>

        <GradebookDetailPanel
          student={selectedStudent}
          assignment={selectedAssignment}
          record={selectedRecord}
          onSave={() => {
            const record = selectedRecord
            const instructorUserId = meQuery.data?.id
            if (!record?.submissionId || record.score == null || !instructorUserId) return
            const payload: GradeRequestDto = {
              submissionId: record.submissionId,
              instructorUserId,
              score: record.score,
              feedback: record.feedback || undefined,
            }
            if (record.gradeId != null) {
              updateGradeMutation.mutate({ gradeId: record.gradeId, payload })
            } else {
              createGradeMutation.mutate(payload)
            }
          }}
          isSaving={createGradeMutation.isPending || updateGradeMutation.isPending}
          saveError={createGradeMutation.error ?? updateGradeMutation.error}
          onStatusChange={(status) => {
            if (!selectedCell) {
              return
            }

            updateLocalRecord(
              selectedCell.studentId,
              selectedCell.assignmentId,
              (record) => ({
                ...record,
                status,
                score: status === 'graded' ? record.score : null,
              }),
            )
          }}
          onScoreChange={(score) => {
            if (!selectedCell) {
              return
            }

            updateLocalRecord(
              selectedCell.studentId,
              selectedCell.assignmentId,
              (record) => ({
                ...record,
                score,
                status: score !== null ? 'graded' : record.status,
              }),
            )
          }}
          onFeedbackChange={(feedback) => {
            if (!selectedCell) {
              return
            }

            updateLocalRecord(
              selectedCell.studentId,
              selectedCell.assignmentId,
              (record) => ({
                ...record,
                feedback,
              }),
            )
          }}
        />
      </div>

      {/* Flag Student modal */}
      {flagStudentId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1117] p-6 shadow-2xl space-y-4">
            <p className="text-sm font-semibold text-white">
              Flag Student: {flagStudentName}
            </p>
            <textarea
              rows={4}
              placeholder="Describe the concern or issue requiring attention…"
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
              className="w-full rounded-lg bg-white/8 px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-white/20 resize-none"
            />
            <div className="flex items-center gap-3">
              <select
                value={flagPriority}
                onChange={(e) =>
                  setFlagPriority(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH')
                }
                className="rounded-lg bg-white/8 px-3 py-2 text-sm text-white outline-none"
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>
              <button
                onClick={() =>
                  createFlagMutation.mutate({
                    studentId: flagStudentId,
                    reason: flagReason,
                    priority: flagPriority,
                  })
                }
                disabled={!flagReason.trim() || createFlagMutation.isPending}
                className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-300 hover:bg-red-500/30 transition-colors disabled:opacity-40"
              >
                {createFlagMutation.isPending ? 'Flagging…' : 'Submit Flag'}
              </button>
              <button
                onClick={() => setFlagStudentId(null)}
                className="ml-auto text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* My Flags section */}
      <SectionFrame label={`My Flags (${(myFlagsQuery.data ?? []).length})`}>
        {(myFlagsQuery.data ?? []).length > 0 ? (
          <div className="flex flex-col gap-2">
            {(myFlagsQuery.data ?? []).map((flag) => (
              <div
                key={flag.id}
                className={`flex items-start justify-between gap-4 rounded-xl px-4 py-3 border ${flag.resolved ? 'opacity-50 border-white/8' : flag.priority === 'HIGH' ? 'border-red-500/20 bg-red-500/8' : flag.priority === 'MEDIUM' ? 'border-amber-500/20 bg-amber-500/8' : 'border-white/8 bg-white/4'}`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <LuFlag
                    size={13}
                    className={`mt-0.5 shrink-0 ${flag.resolved ? 'text-white/30' : flag.priority === 'HIGH' ? 'text-red-400' : flag.priority === 'MEDIUM' ? 'text-amber-400' : 'text-white/50'}`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      {flag.studentFirstName} {flag.studentLastName}
                    </p>
                    <p className="text-xs text-white/55 mt-0.5">
                      {flag.reason}
                    </p>
                    <p className="text-xs text-white/30 mt-0.5">
                      {formatDate(flag.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${flag.priority === 'HIGH' ? 'bg-red-500/15 text-red-300' : flag.priority === 'MEDIUM' ? 'bg-amber-500/15 text-amber-300' : 'bg-white/8 text-white/50'}`}
                  >
                    {flag.priority}
                  </span>
                  {flag.resolved ? (
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                      <LuCircleCheck size={12} /> Resolved
                    </span>
                  ) : (
                    <button
                      onClick={() => resolveFlagMutation.mutate(flag.id)}
                      className="rounded-lg bg-white/8 px-2.5 py-1 text-xs text-white/60 hover:bg-white/15 transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-3 text-sm text-white/35">
            No flags created yet. Select a student in the gradebook, then use
            "Flag Student" to create one.
          </p>
        )}

        {/* Quick flag from current selection */}
        {selectedStudent && (
          <div className="mt-3 border-t border-white/8 pt-3">
            <button
              onClick={() => {
                setFlagStudentId(Number(selectedStudent.id))
                setFlagStudentName(selectedStudent.name)
              }}
              className="flex items-center gap-1.5 rounded-lg bg-white/8 px-3 py-2 text-sm text-white/60 hover:bg-white/15 hover:text-white transition-colors"
            >
              <LuFlag size={13} />
              Flag {selectedStudent.name}
            </button>
          </div>
        )}
      </SectionFrame>

      <p className="text-xs text-white/35">
        Grade data is loaded live from submissions and grades. Edits in this
        view remain local until write actions are wired.
      </p>
    </div>
  )
}

function mergeGradebookRecords(
  records: GradebookRecord[],
  overrides: Record<string, GradebookRecord>,
) {
  const merged = new Map(
    records.map((record) => [
      `${record.studentId}:${record.assignmentId}`,
      record,
    ]),
  )

  Object.entries(overrides).forEach(([key, record]) => {
    merged.set(key, record)
  })

  return Array.from(merged.values())
}
