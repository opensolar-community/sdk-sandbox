import { useOsSdk } from 'ossdk-react'
import { createContext, useEffect, useState } from 'react'
import { clearLocalStorage, keysForLocalStorage, loadFromLocalStorage } from './localStorage'
import { getSetting, setSetting } from './settings'

export const ContainerContext = createContext<Record<string, any>>({
  loaded: false,
  ossdk: null,
  projectKey: null,
  // setProjectKey: null,
  projectData: null,
  setProjectData: null,
  projectIdentifiersToken: null,
  setProjectIdentifiersToken: null,
  isStudioReady: null,
  setIsStudioReady: null,
  selected: null,
  setSelected: null,
  system: null,
  setSystem: null,
  loginMethod: null,
  setLoginMethod: null,

  osAppRoot: null,
  osApiRoot: null,
  osScriptLocation: null,
  osSdkKey: null,
  osOrgId: null,
  osToken: null,
  setOsToken: null,
  loginConfigsOverride: null,
  extraScriptParams: null,

  showFloatingToolbar: false,
  setShowFloatingToolbar: false,

  hasUnsavedChanges: false,
  setHasUnsavedChanges: null,

  componentMappingKey: null,

  orgId: null,
  setOrgId: null,

  currentRole: null,
  setCurrentRole: null,
  availableImagery: null,

  routePath: null,

  progress: {},

  consoleOutput: '',
  setConsoleOutput: null,
})

const SIGNALS_TO_HANDLE = [
  'objectSelected',
  'objectAdded',
  'objectChanged',
  'objectRemoved',
  'sceneLoaded',
  'queueProcessed',
]

const getViewOverrides = (userAccessMode) => {
  // Default to "full" if not specified
  if (userAccessMode === 'full' || !userAccessMode) {
    return {
      header: { show: false },
      homepage: { show: false },
      'forms.project.header': {
        show: false,
      },
      'forms.project.save_status': {
        show: true,
      },
    }
  }

  if (userAccessMode === 'original') {
    /*
    No view overrides whatsoever. In particular this will reveal the homepage and top menu and project menu
    */
    return {}
  }

  const viewOverrides = {
    header: { show: false },
    homepage: { show: false },
    'forms.project.header': {
      show: false,
    },
    'forms.project.save_status': {
      show: true,
    },

    'studio.tab_panels.summary': { show: false },
    'studio.systems.overview': { show: false },
    'studio.systems.add_new_system': { show: true },
    'studio.systems.duplicate_system': { show: true },
    'studio.tabs.summary': { show: false },
    'studio.tabs.panels.select_panel_type': { show: false },
    'studio.tabs.panels.buildable_panels': { show: false },
    'studio.tabs.panels.select_dc_optimizer': { show: false },
    'studio.tabs.mounting': { show: false },
    'studio.tabs.inverters': { show: false },
    'studio.tabs.batteries': { show: false },
    'studio.tabs.others': { show: false },
    'studio.tabs.pricing': { show: false },
    'studio.tabs.payment_options': { show: false },
    'studio.tabs.scaffolding': { show: false },
    'studio.tabs.incentives': { show: false },
    'studio.select_design_mode': { show: true },
    'studio.advanced': { show: true },
    'studio.view_controls': { show: true },
    'studio.view_controls.AlignMapButton': { show: false },
    'studio.view_controls.StreetViewButton': { show: false },
    'studio.view_selector': { show: true },
  }

  if (userAccessMode === 'basic') {
    Object.assign(viewOverrides, {
      'studio.tabs.panels.add': { show: false },
      'studio.tabs.selected_panel_group.basic_settings': { show: false },
      'studio.tabs.selected_panel_group.advanced_settings': { show: false },
      'studio.tabs.selected_panel_group.shading': { show: false },
      'studio.tabs.selected_panel_group.tools': { show: false },
      'studio.tabs.selected_panel_group.tools.FillRectangle': { show: false },
      'studio.tabs.selected_panel_group.tools.FillFacet': { show: false },
      'studio.tabs.selected_panel_group.tools.SelectFacet': { show: false },
      'studio.tabs.selected_panel_group.tools.Duplicate': { show: false },
      'studio.tabs.selected_panel_group.tools.AutoString': { show: false },
      'studio.tabs.selected_panel_group.tools.Delete': { show: false },
      'studio.select_design_mode': { show: false },
      'studio.advanced': { show: false },
      'studio.view_selector': { show: false },
    })
  } else if (userAccessMode === 'read_only') {
    Object.assign(viewOverrides, {
      'studio.tabs.panels.add': { show: false },
      'studio.tabs.panels': { show: false },
      'studio.select_design_mode': { show: false },
      'studio.advanced': { show: false },
      'studio.view_selector': { show: false },
    })
  }

  return viewOverrides
}

const hashParams = new URLSearchParams(window.location.search)

export function ContainerProvider({ children }) {
  const { loaded, ossdk } = useOsSdk()
  const [projectData, setProjectData] = useState<any>(loadFromLocalStorage('projectData', null))
  const [projectFormValues, setProjectFormValues] = useState<any>()

  const projectKey = (projectData && projectData?.identifier) || null
  const [projectIdentifiersToken, setProjectIdentifiersToken] = useState(
    loadFromLocalStorage('projectIdentifiersToken', null)
  )
  const [isStudioReady, setIsStudioReady] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [projectDirtyFields, setProjectDirtyFields] = useState<any>()

  const [selected, setSelected] = useState(null)
  const [system, setSystem] = useState(null)
  const [orgId, setOrgId] = useState(null)
  const [currentRole, setCurrentRole] = useState(null)
  const [availableImagery, setAvailableImagery] = useState(null)
  const [progress, setProgress] = useState({})
  const [routePath, setRoutePath] = useState(null)
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false)
  const [osAppRoot, setOsAppRoot] = useState(getSetting(hashParams, 'osAppRoot'))
  const [osApiRoot, setOsApiRoot] = useState(getSetting(hashParams, 'osApiRoot'))
  const [osScriptLocation, setOsScriptLocation] = useState(getSetting(hashParams, 'osScriptLocation'))
  const [osSdkKey, setOsSdkKey] = useState(getSetting(hashParams, 'osSdkKey'))
  const [osOrgId, setOsOrgId] = useState(getSetting(hashParams, 'osOrgId'))
  const [osToken, setOsToken] = useState(getSetting(hashParams, 'osToken'))
  const loginConfigsOverride = hashParams.get('loginConfigsOverride')
  const componentMappingKey = hashParams.get('componentMappingKey')

  const [loginMethod, setLoginMethod] = useState(getSetting(hashParams, 'loginMethod'))

  const [alertMessage, setAlertMessage] = useState<{ message: string; severity: string } | null>(null)

  const [consoleOutput, setConsoleOutput] = useState<string>('')

  useEffect(() => {
    const originalConsoleLog = console.log

    console.log = (...args) => {
      const message = args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' ')
      setConsoleOutput((prev) => `${prev}${message}\n`)
      originalConsoleLog(...args)
    }

    return () => {
      console.log = originalConsoleLog
    }
  }, [])

  const showAlertMessage = (message, severity) => {
    setAlertMessage({ message: message, severity: severity })
  }
  const hideAlertMessage = () => {
    setAlertMessage(null)
  }

  // default, basic, read_only
  const userAccessMode = hashParams.get('userAccessMode') || 'default'

  // TODO remove?
  // Do not add the ? at the start, this will automatically be added later
  let extraScriptParams = ''

  extraScriptParams += '&view_overrides=' + encodeURIComponent(JSON.stringify(getViewOverrides(userAccessMode)))
  if (loginConfigsOverride) extraScriptParams += '&login_configs_override=' + encodeURIComponent(loginConfigsOverride)
  if (SIGNALS_TO_HANDLE) extraScriptParams += '&signals=' + encodeURIComponent(JSON.stringify(SIGNALS_TO_HANDLE))
  if (osAppRoot) extraScriptParams += '&hostname_spa=' + encodeURIComponent(osAppRoot)
  if (osApiRoot) extraScriptParams += '&hostname_api=' + encodeURIComponent(osApiRoot)

  const saveToLocalStorage = () => {
    let values = {
      projectIdentifiersToken: projectIdentifiersToken,
      projectData: projectData,
      loginMethod: loginMethod,
    }

    keysForLocalStorage.forEach((keySettings) => {
      let rawValue = values[keySettings.key]
      if (rawValue) {
        window['localStorage'].setItem(
          keySettings.key,
          keySettings.serialize ? keySettings.serialize(rawValue) : rawValue
        )
      }
    })
  }

  return (
    <ContainerContext.Provider
      value={{
        loaded,
        ossdk,

        projectKey,
        // setProjectKey,
        projectData,
        setProjectData,
        projectFormValues,
        setProjectFormValues,
        projectIdentifiersToken,
        setProjectIdentifiersToken,
        isStudioReady,
        setIsStudioReady,
        selected,
        setSelected,
        system,
        setSystem,
        loginMethod,
        setLoginMethod,
        osAppRoot,
        setOsAppRoot,
        osApiRoot,
        setOsApiRoot,
        osScriptLocation,
        setOsScriptLocation,
        osSdkKey,
        setOsSdkKey: setSetting(setOsSdkKey, 'osSdkKey'),
        osOrgId,
        setOsOrgId,
        osToken,
        setOsToken: setSetting(setOsToken, 'osToken'),
        loginConfigsOverride,
        extraScriptParams,
        showFloatingToolbar,
        setShowFloatingToolbar,
        projectDirtyFields,
        setProjectDirtyFields,
        hasUnsavedChanges,
        setHasUnsavedChanges,

        componentMappingKey,

        orgId,
        setOrgId,

        currentRole,
        setCurrentRole,

        availableImagery,
        setAvailableImagery,

        progress,
        setProgress,

        routePath,
        setRoutePath,

        // Helper functions for localStorage for convenience in the sample app
        saveToLocalStorage,
        loadFromLocalStorage,
        clearLocalStorage,

        alertMessage,
        showAlertMessage,
        hideAlertMessage,

        consoleOutput,
        setConsoleOutput,
      }}
    >
      {children}
    </ContainerContext.Provider>
  )
}
