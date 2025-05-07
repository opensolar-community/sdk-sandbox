import { defaultSettings } from './constants'

type SettingsKey = keyof typeof defaultSettings

export const getSetting = (urlParams: URLSearchParams, key: SettingsKey) => {
  if (urlParams.has(key)) {
    return urlParams.get(key)
  }

  // check if key in local storage
  const storedValue = localStorage.getItem(key)
  if (storedValue) {
    return storedValue
  }

  return defaultSettings[key]
}

export const setSetting = (setter, key: string) => {
  return (value: string) => {
    setter(value)
    localStorage.setItem(key, value)
  }
}
