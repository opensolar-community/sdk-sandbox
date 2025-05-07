import { Button, Stack, Typography } from '@mui/material'
import { useContext, useState } from 'react'
import { ContainerContext } from '../ContainerContext'
import { getFromLocalStorage } from '../localStorage'
import { CustomTabPanel } from '../utils'

const contextKeyGroups = [
  {
    label: 'Launch Config',
    keys: [
      'osAppRoot',
      'osScriptLocation',
      'osSdkKey',
      'osOrgId',
      'osToken',
      'loginConfigsOverride',
      'extraScriptParams',
      'componentMappingKey',
    ],
  },
  {
    label: 'Project Form State',
    keys: [
      'projectFormValues',
      'projectDirtyFields'
    ],
  },
  {
    label: 'Container App State',
    keys: [
      'routePath',
      'projectKey',
      'setProjectKey',
      'showFloatingToolbar',
      'setShowFloatingToolbar',
      'projectData',
      'setProjectData',
    ],
  },
  {
    label: 'Loading Progress',
    keys: ['projectKey', 'setProjectKey', 'loaded', 'ossdk', 'isStudioReady', 'setIsStudioReady'],
  },
  {
    label: 'Auth State',
    keys: [
      'orgId',
      'setOrgId',
      'loginMethod',
      'setLoginMethod',
      'token',
      'setToken',
      'projectIdentifiersToken',
      'setProjectIdentifiersToken',
      'currentRole',
    ],
  },
  {
    label: 'Studio state',
    keys: ['selected', 'setSelected', 'system', 'setSystem', 'availableImagery', 'progress'],
  },
]

const printValue = (key, value) => {
  if (typeof value === 'function') {
    return '(function)'
  } else if (typeof value === 'undefined') {
    return '(undefined)'
  } else if (key === 'ossdk' && !!value) {
    return 'ossdk'
  } else {
    return <span style={{ whiteSpace: 'pre' }}>{JSON.stringify(value, null, 2)}</span>
  }
}

interface Props {
  selectedTab: number
  tabIndex: number
  tabPrefix: string
}

export default function TabInspectState({ selectedTab, tabIndex, tabPrefix }: Props) {
  const context = useContext(ContainerContext)
  const [counter, setCounter] = useState(0)

  const refresh = () => {
    setCounter(counter + 1)
  }

  return (
    <CustomTabPanel value={selectedTab} index={tabIndex} prefix={tabPrefix}>
      <Stack direction="column" spacing={1}>
        {contextKeyGroups.map(({ label, keys }) => {
          return (
            <div key={label}>
              <Typography variant="h6">{label}</Typography>
              {Object.entries(context)
                .filter(([key]) => keys.includes(key))
                .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
                .map(([key, value]) => (
                  <div
                    key={key}
                    style={{
                      margin: 2,
                      borderBottom: '1px solid #eeeeee',
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
                    <div style={{ flex: '0 0 200px' }}>{key}</div>
                    <div style={{ flex: 1, overflow: 'scroll', maxHeight: 200 }}>{printValue(key, value)}</div>
                  </div>
                ))}
            </div>
          )
        })}

        <div key="Local Storage">
          <h2>Local Storage</h2>
          {Object.entries(getFromLocalStorage()).map(([key, value]) => (
            <div
              key={key}
              style={{
                margin: 2,
                borderBottom: '1px solid #eeeeee',
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <div style={{ flex: '0 0 200px' }}>{key}</div>
              <div style={{ flex: 1, overflow: 'scroll', maxHeight: 200 }}>{printValue(key, value)}</div>
            </div>
          ))}

          <Button
            variant="outlined"
            onClick={() => {
              context.saveToLocalStorage()
              refresh()
            }}
          >
            Save State to LocalStorage
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              context.clearLocalStorage()
              refresh()
            }}
          >
            Clear State from LocalStorage
          </Button>
        </div>
      </Stack>
    </CustomTabPanel>
  )
}
