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

  it('rejeita 29/02 em ano não bissexto', () => {
    expect(parseLocalDate('2023-02-29')).toBeNull()
  })

  it('aceita 29/02 em ano bissexto', () => {
    const parsed = parseLocalDate('2024-02-29')

    expect(parsed).not.toBeNull()
    expect(parsed?.getFullYear()).toBe(2024)
    expect(parsed?.getMonth()).toBe(1)
    expect(parsed?.getDate()).toBe(29)
  })

  it('rejeita mês/dia zero e fora de faixa', () => {
    expect(parseLocalDate('2026-00-10')).toBeNull()
    expect(parseLocalDate('2026-13-10')).toBeNull()
    expect(parseLocalDate('2026-05-00')).toBeNull()
    expect(parseLocalDate('2026-04-31')).toBeNull()
  })

  it('suporta apenas anos 0100-9999', () => {
    expect(parseLocalDate('0099-12-31')).toBeNull()

    const minSupportedYear = parseLocalDate('0100-01-01')
    expect(minSupportedYear).not.toBeNull()
    expect(minSupportedYear?.getFullYear()).toBe(100)
  })
})
