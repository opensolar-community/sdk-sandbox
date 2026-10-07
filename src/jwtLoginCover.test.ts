import {
  LOGIN_FAILED_TEXT,
  LOGIN_SUCCESS_TEXT,
  PROJECT_CREATED_TEXT,
  PROJECT_CREATE_OR_LOAD_FAILED_TEXT,
  PROJECT_LOADED_TEXT,
  SDK_BOOT_FAILED_TEXT,
  hasJwt,
  messageRevealsIframe,
  shouldCoverIframe,
} from './jwtLoginCover'

test('a non-empty osToken is a JWT', () => {
  expect(hasJwt('ossdk_token')).toBe(true)
  expect(hasJwt('  ')).toBe(false)
  expect(hasJwt('')).toBe(false)
  expect(hasJwt(null)).toBe(false)
  expect(hasJwt(undefined)).toBe(false)
})

test('covers the iframe until a JWT login settles', () => {
  expect(shouldCoverIframe('ossdk_token', false)).toBe(true)
  expect(shouldCoverIframe('ossdk_token', true)).toBe(false)
  expect(shouldCoverIframe('', false)).toBe(false)
  expect(shouldCoverIframe(null, false)).toBe(false)
})

test('project load or a failed sign-in reveals the iframe', () => {
  expect(messageRevealsIframe(PROJECT_LOADED_TEXT)).toBe(true)
  expect(messageRevealsIframe(PROJECT_CREATED_TEXT)).toBe(true)
  expect(messageRevealsIframe(PROJECT_CREATE_OR_LOAD_FAILED_TEXT)).toBe(true)
  expect(messageRevealsIframe(LOGIN_FAILED_TEXT)).toBe(true)
  expect(messageRevealsIframe(SDK_BOOT_FAILED_TEXT)).toBe(true)
  expect(messageRevealsIframe(LOGIN_SUCCESS_TEXT)).toBe(false)
  expect(messageRevealsIframe(undefined)).toBe(false)
})
