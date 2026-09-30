import { numericCoordinate, projectWithNumericCoordinates } from './numericCoordinates'

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

test('does not turn an empty or non-numeric value into 0', () => {
  expect(numericCoordinate('')).toBeUndefined()
  expect(numericCoordinate('   ')).toBeUndefined()
  expect(numericCoordinate('north')).toBeUndefined()
  expect(numericCoordinate(null)).toBeUndefined()
  expect(projectWithNumericCoordinates({ lat: 'north', lon: '' })).toEqual({ lat: 'north', lon: '' })
})
