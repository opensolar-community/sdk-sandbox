import { findSessionProject } from './findSessionProject'

function storageWith(projects: unknown): Pick<Storage, 'getItem'> {
  return {
    getItem: (key: string) => (key === 'projects' ? JSON.stringify(projects) : null),
  }
}

test('returns the session project whose identifier matches the route', () => {
  const match = findSessionProject(
    'sydney-260903-c',
    storageWith([
      { identifier: '00Q8F000004TKwjUAG_1', country_iso2: 'US' },
      { identifier: 'sydney-260903-c', lat: -33.8675 },
    ])
  )

  expect(match).toEqual({ identifier: 'sydney-260903-c', lat: -33.8675 })
})

test('returns null when the route identifier is missing from session storage', () => {
  expect(findSessionProject('missing', storageWith([{ identifier: 'other' }]))).toBeNull()
})

test('returns null for invalid JSON or a missing identifier', () => {
  expect(findSessionProject(undefined, storageWith([]))).toBeNull()
  expect(
    findSessionProject('sydney-260903-c', {
      getItem: () => '{not-json',
    })
  ).toBeNull()
})
