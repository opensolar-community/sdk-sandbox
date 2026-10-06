import { nextProjectRows, numericCoordinate, projectWithNumericCoordinates } from './numericCoordinates'

test('stores a typed latitude and longitude as numbers', () => {
  expect(numericCoordinate('51.519')).toBe(51.519)
  expect(numericCoordinate('-0.1645')).toBe(-0.1645)
  expect(projectWithNumericCoordinates({ identifier: 'new', lat: '28.6314512', lon: '77.2166672' })).toEqual({
    identifier: 'new',
    lat: 28.6314512,
    lon: 77.2166672,
  })
})

test('leaves an existing number unchanged', () => {
  expect(numericCoordinate(-33.8675)).toBe(-33.8675)
  expect(projectWithNumericCoordinates({ lat: -33.8675, lon: 151.207 })).toEqual({
    lat: -33.8675,
    lon: 151.207,
  })
})

test('appends a created project with numeric coordinates and keeps the existing rows', () => {
  const existing = { identifier: 'existing', lat: -33.8675, lon: 151.207, country_iso2: 'AU' }
  const next = nextProjectRows([existing], {
    identifier: 'india-new',
    address: '1 MG Road',
    lat: '28.6314512',
    lon: '77.2166672',
    country_iso2: 'IN',
  })

  expect(next).toEqual([
    existing,
    {
      identifier: 'india-new',
      address: '1 MG Road',
      lat: 28.6314512,
      lon: 77.2166672,
      country_iso2: 'IN',
    },
  ])
  expect(typeof next?.[1].lat).toBe('number')
  expect(typeof next?.[1].lon).toBe('number')
})

test('does not save a created project when a coordinate is blank', () => {
  const existing = { identifier: 'existing', lat: 1, lon: 2, country_iso2: 'AU' }
  expect(
    nextProjectRows([existing], {
      identifier: 'blank-lat',
      lat: '',
      lon: '77.2166672',
      country_iso2: 'IN',
    })
  ).toBeNull()
})

test('does not turn an empty or non-numeric value into 0', () => {
  expect(numericCoordinate('')).toBeUndefined()
  expect(numericCoordinate('   ')).toBeUndefined()
  expect(numericCoordinate('north')).toBeUndefined()
  expect(numericCoordinate(null)).toBeUndefined()
  expect(projectWithNumericCoordinates({ lat: 'north', lon: '' })).toEqual({ lat: 'north', lon: '' })
})
