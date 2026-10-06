import {describe, expect, it} from 'vitest'
import {cleanProps} from '../server/utils/cleanProps'

describe('cleanProps', () => {
  it('keeps short flat primitives', () => {
    expect(cleanProps({slug: 'a-story', percent: 50, active: true, from: null})).toEqual({
      slug: 'a-story',
      percent: 50,
      active: true,
      from: null,
    })
  })

  it('drops objects, arrays, functions and non-finite numbers', () => {
    const result = cleanProps({nested: {a: 1}, list: [1], fn: () => 1, bad: Infinity, nan: NaN})
    expect(result).toEqual({})
  })

  it('drops keys that are not plain letters', () => {
    expect(cleanProps({'bad key': 1, 'a-b': 2, __proto__x: 3, ok: 4})).toEqual({ok: 4})
  })

  it('truncates long strings to 200 characters', () => {
    expect(cleanProps({slug: 'x'.repeat(500)}).slug).toHaveLength(200)
  })

  it('keeps at most 10 entries', () => {
    const input = Object.fromEntries('abcdefghijklmno'.split('').map((k, i) => [k, i]))
    expect(Object.keys(cleanProps(input))).toHaveLength(10)
  })

  it('returns an empty object for non-objects', () => {
    expect(cleanProps(null)).toEqual({})
    expect(cleanProps('text')).toEqual({})
    expect(cleanProps(42)).toEqual({})
  })
})
