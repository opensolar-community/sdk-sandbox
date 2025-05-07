export const keysForLocalStorage = [
  { key: 'projectIdentifiersToken', serialize: null, deserialize: null },
  { key: 'projectData', serialize: (value) => JSON.stringify(value), deserialize: (value) => JSON.parse(value) },
  { key: 'loginMethod', serialize: (value) => JSON.stringify(value), deserialize: (value) => JSON.parse(value) },
]

export const loadFromLocalStorage = (key, defaultValue) => {
  let keySettings = keysForLocalStorage.find((keySettings) => keySettings.key === key)
  if (keySettings && localStorage.hasOwnProperty(keySettings.key)) {
    let rawValue = window['localStorage'].getItem(keySettings.key)
    return keySettings.deserialize ? keySettings.deserialize(rawValue) : rawValue
  } else {
    return defaultValue
  }
}

export const clearLocalStorage = () => {
  keysForLocalStorage.forEach((keySettings) => {
    localStorage.removeItem(keySettings.key)
  })
}

export const getFromLocalStorage = () => {
  let values = {}
  keysForLocalStorage.forEach((keySettings) => {
    values[keySettings.key] = loadFromLocalStorage(keySettings.key, undefined)
  })
  return values
}
