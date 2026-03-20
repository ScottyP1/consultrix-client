export function getFullName(firstName?: string | null, lastName?: string | null) {
  return [firstName, lastName].filter(Boolean).join(' ').trim()
}

export function getInitials(firstName?: string | null, lastName?: string | null) {
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.trim()

  return initials || 'A'
}

export function formatDate(value?: string | null) {
  if (!value) {
    return '--'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return '--'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function formatAssignmentDueDate(
  dueDate?: string | null,
  dueTime?: string | null,
) {
  if (!dueDate && !dueTime) {
    return '--'
  }

  const composedValue =
    dueDate && dueTime
      ? dueTime.includes('T')
        ? dueTime
        : `${dueDate}T${dueTime}`
      : dueDate ?? dueTime

  return formatDateTime(composedValue)
}

export function formatStatusLabel(value?: string | null) {
  if (!value) {
    return '--'
  }

  return value
    .toLowerCase()
    .split(/[_\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function toNumber(value: unknown) {
  if (typeof value === 'number') {
    return value
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : 0
}
