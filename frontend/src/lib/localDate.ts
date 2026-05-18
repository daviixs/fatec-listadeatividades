const LOCAL_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/

export function parseLocalDate(value: string): Date | null {
  const match = LOCAL_DATE_RE.exec(value)
  if (!match) {
    return null
  }

  const year = Number(match[1])
  const monthIndex = Number(match[2]) - 1
  const day = Number(match[3])

  const parsed = new Date(year, monthIndex, day)

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== monthIndex ||
    parsed.getDate() !== day
  ) {
    return null
  }

  return parsed
}

export function localDateKey(value: string): string | null {
  const parsed = parseLocalDate(value)
  if (!parsed) {
    return null
  }

  return dateToLocalDateKey(parsed)
}

export function dateToLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function isSameLocalDate(value: string, date: Date): boolean {
  const key = localDateKey(value)

  return key !== null && key === dateToLocalDateKey(date)
}

export function formatLocalDatePtBr(value: string): string {
  const parsed = parseLocalDate(value)
  if (!parsed) {
    return value
  }

  return parsed.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
