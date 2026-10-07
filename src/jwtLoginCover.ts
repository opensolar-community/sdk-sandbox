/** Messages OsSdkView sends through onMessage. */
export const LOGIN_SUCCESS_TEXT = 'Login success'
export const LOGIN_FAILED_TEXT = 'Login failed'
export const SDK_BOOT_FAILED_TEXT = 'SDK Boot failed'
export const PROJECT_LOADED_TEXT = 'Project loaded'
export const PROJECT_CREATED_TEXT = 'Project created'
export const PROJECT_CREATE_OR_LOAD_FAILED_TEXT = 'Project create/load failed'

/** A non-empty osToken is the JWT the sandbox will pass to loginWithToken. */
export function hasJwt(osToken: unknown): boolean {
  return typeof osToken === 'string' && osToken.trim().length > 0
}

/**
 * Cover the iframe while a JWT sign-in is still opening the project.
 * A missing token shows the iframe immediately.
 */
export function shouldCoverIframe(osToken: unknown, loginSettled: boolean): boolean {
  return hasJwt(osToken) && !loginSettled
}

/**
 * Reveal the iframe once the project route is open, or when sign-in cannot continue.
 * Login success is earlier: OsSdkView sends it before createOrUpdateProject, while the iframe can still be on /login.
 */
export function messageRevealsIframe(text: string | undefined): boolean {
  return (
    text === PROJECT_LOADED_TEXT ||
    text === PROJECT_CREATED_TEXT ||
    text === PROJECT_CREATE_OR_LOAD_FAILED_TEXT ||
    text === LOGIN_FAILED_TEXT ||
    text === SDK_BOOT_FAILED_TEXT
  )
}
