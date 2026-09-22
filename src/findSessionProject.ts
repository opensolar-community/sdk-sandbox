export function findSessionProject(
  identifier: string | undefined,
  storage: Pick<Storage, 'getItem'> = sessionStorage
): Record<string, unknown> | null {
  if (!identifier) {
    return null
  }

  try {
    const raw = storage.getItem('projects')
    if (!raw) {
      return null
    }

    const projects = JSON.parse(raw)
    if (!Array.isArray(projects)) {
      return null
    }

    return projects.find((project) => project?.identifier === identifier) ?? null
  } catch {
    return null
  }
}
