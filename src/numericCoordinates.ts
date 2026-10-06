/**
 * Latitude and longitude must be numbers before they are sent to Studio.
 * HTML inputs store typed values as text. A finite numeric string becomes a
 * number. Empty and non-numeric values are left unchanged so they are not
 * stored as 0.
 */
export function numericCoordinate(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined
  }
  if (typeof value !== 'string') {
    return undefined
  }
  const trimmed = value.trim()
  if (trimmed === '') {
    return undefined
  }
  const numeric = Number(trimmed)
  return Number.isFinite(numeric) ? numeric : undefined
}

export function projectWithNumericCoordinates<T extends Record<string, unknown>>(project: T): T {
  if (!project || typeof project !== 'object') {
    return project
  }
  const lat = numericCoordinate(project.lat)
  const lon = numericCoordinate(project.lon)
  if (lat === undefined && lon === undefined) {
    return project
  }
  return {
    ...project,
    ...(lat !== undefined ? { lat } : {}),
    ...(lon !== undefined ? { lon } : {}),
  }
}

type CreateProjectForm = {
  identifier: string
  lat: unknown
  lon: unknown
  country_iso2: string
}

/**
 * The project row written when Create Project is saved.
 * A typed coordinate is stored as a number. An empty or non-numeric
 * coordinate does not become 0, and no row is added.
 */
export function nextProjectRows<TRow, TForm extends CreateProjectForm>(
  prevRows: TRow[],
  formData: TForm
): Array<TRow | (Omit<TForm, 'lat' | 'lon'> & { lat: number; lon: number })> | null {
  const lat = numericCoordinate(formData.lat)
  const lon = numericCoordinate(formData.lon)
  if (!formData.identifier.trim() || lat === undefined || lon === undefined || !formData.country_iso2) {
    return null
  }
  return [...prevRows, { ...formData, lat, lon }]
}
