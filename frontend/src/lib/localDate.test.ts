import { describe, expect, it } from 'vitest'
import {
  formatLocalDatePtBr,
  isSameLocalDate,
  localDateKey,
  parseLocalDate,
} from './localDate'

describe('localDate helpers', () => {
  it('parseia YYYY-MM-DD como data local sem deslocar dia', () => {
    const parsed = parseLocalDate('2026-05-02')

    expect(parsed).not.toBeNull()
    expect(parsed?.getFullYear()).toBe(2026)
    expect(parsed?.getMonth()).toBe(4)
    expect(parsed?.getDate()).toBe(2)
  })

  it('gera chave estável para comparação por dia', () => {
    const date = new Date(2026, 4, 2)

    expect(localDateKey('2026-05-02')).toBe('2026-05-02')
    expect(isSameLocalDate('2026-05-02', date)).toBe(true)
  })

  it('retorna fallback para data inválida', () => {
    expect(parseLocalDate('2026/05/02')).toBeNull()
    expect(formatLocalDatePtBr('2026/05/02')).toBe('2026/05/02')
  })
})
