import { Tab, Tabs } from '@mui/material'
import Alert from '@mui/material/Alert'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import OsSdkView, { clearSignalHandlers } from 'ossdk-react'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ContainerContext } from '../ContainerContext'
import { InputButtonMenu, OutputButtonMenu } from '../elements/ButtonMenu'
import FloatingToolbar from '../elements/FloatingToolbar'
import ShowStateMessage from '../elements/ShowStateMessage'
import SettingsDrawer from '../SettingsDrawer'

enum ButtonTab {
  input = 0,
  output = 1,
}

function a11yProps(id: ButtonTab) {
  return {
    id: `button-tab-${id}`,
    'aria-controls': `button-tabpanel-${id}`,
  }
}

function DesignPage() {
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false)
  const params = useParams()

  const {
    ossdk,
    projectKey,
    projectData,
    setProjectData,
    setProjectFormValues,
    projectIdentifiersToken,
    setIsStudioReady,
    selected,
    setSelected,
    system,
    setSystem,
    showFloatingToolbar,
    osScriptLocation,
    osSdkKey,
    osOrgId,
    osToken,
    extraScriptParams,
    setHasUnsavedChanges,
    setProjectDirtyFields,
    componentMappingKey,
    setOrgId,
    setCurrentRole,
    setAvailableImagery,
    setRoutePath,
    alertMessage,
    showAlertMessage,
    hideAlertMessage,
    setProgress,
  } = useContext(ContainerContext)

  const height = 600

  useEffect(() => {
    const sessionProjects = sessionStorage.getItem('projects')
    if (osSdkKey && sessionProjects) {
      const projects = JSON.parse(sessionProjects)
      if (projects.length > 0) {
        const project = projects.find((project) => project.identifier === params.id)
        if (project) {
          setProjectData(project)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [selectedTab, setSelectedTab] = useState(ButtonTab.input)

  const handleTabChange = (_, newValue: ButtonTab) => {
    setSelectedTab(newValue)
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={() => {
          hideAlertMessage()
        }}
        open={!!alertMessage?.message}
        key={alertMessage?.message}
      >
        <Alert severity={alertMessage?.severity} variant="filled" sx={{ width: '100%', whiteSpace: 'pre-line' }}>
          {alertMessage?.message}
        </Alert>
      </Snackbar>

      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="tabs"
        onClick={(event) => {
          // selecting the same tab again will hide all tabs
          // we cannot use handleTabChange because that only fires when the tab changes
          // not when current tab is clicked
          let tabIndex = parseInt(event.target.id.split('-')[2])
          if (tabIndex === selectedTab) {
            setSelectedTab(null)
          }
        }}
      >
        <Tab label="Input" {...a11yProps(ButtonTab.input)} />
        <Tab label="Output" {...a11yProps(ButtonTab.output)} />
      </Tabs>
      <InputButtonMenu selectedTab={selectedTab} tabIndex={ButtonTab.input} tabPrefix="button-tabs" />
      <OutputButtonMenu selectedTab={selectedTab} tabIndex={ButtonTab.output} tabPrefix="button-tabs" />

      <ShowStateMessage />

      {osOrgId && (
        <Paper elevation={3} style={{ backgroundColor: '#cccccc', padding: 20 }}>
          <div style={{ position: 'relative' }}>
            {projectKey && showFloatingToolbar && <FloatingToolbar ossdk={ossdk} selected={selected} system={system} />}
            {!projectKey && (
              <div
                id="dummy-viewport-before-creation"
                style={{
                  height: height,
                  width: '100%',
                  backgroundColor: '#eeeeee',
                }}
              ></div>
            )}
            {projectKey && (
              <OsSdkView
                height={height}
                key={projectKey + projectIdentifiersToken + extraScriptParams}
                osToken={osToken}
                projectIdentifiersToken={projectIdentifiersToken}
                osScriptLocation={osScriptLocation}
                osSdkKey={osSdkKey}
                projectData={projectData}
                extraScriptParams={extraScriptParams}
                onMessage={(message, err) => {
                  let messageText = message.text + (err && err?.message ? ': ' + err.message : '')
                  if (message.severity !== 'debug') {
                    showAlertMessage(messageText, message.severity)
                  }
                  if (err) console.warn(err)
                }}
                onLoad={(ossdk) => {
                  console.log('onLoad fired')

                  // Call clear handles first to ensure that there are no lingering handlers from a previous sdk instance
                  // Sometimes they may not cleanup handlers if they do not exit as expected, e.g. when the iframe is removed
                  // rather than simply removing the sdk react component.
                  clearSignalHandlers(ossdk)

                  // Beware: This is NOT currently populating due to an unknown Bug.
                  ossdk.current_org.id.add(
                    (state) => {
                      setOrgId(state)
                    },
                    { now: true }
                  )

                  ossdk.auth.current_role.add(
                    (state) => {
                      setCurrentRole(state)
                    },
                    { now: true }
                  )

                  if (ossdk?.studio?.availableImagery?.add) {
                    ossdk.studio.availableImagery.add(
                      (state) => {
                        setAvailableImagery(state)
                      },
                      { now: true }
                    )
                  }

                  ossdk.route.path.add(
                    (state) => {
                      setRoutePath(state)
                    },
                    { now: true }
                  )

                  ossdk.project_form.dirty_fields.add(
                    (state) => {
                      console.log('ossdk.project_form.dirty_fields', state)
                      setProjectDirtyFields(state)
                      setHasUnsavedChanges(state.length > 0)
                    },
                    { now: true }
                  )

                  ossdk.project_form.values.add((values) => {
                    setProjectFormValues(values)
                  })

                  ossdk.studio.objectSelected.add((object, b, c) => {
                    console.log('objectSelected', object, b, c)
                    setSelected(object)

                    if (object?.type === 'OsSystem') {
                      setSystem(object)
                    }
                  })
                  ossdk.studio.objectAdded.add((a, b, c) => {
                    console.log('objectAdded', a, b, c)
                  })
                  ossdk.studio.objectChanged.add((object, attributeName, c) => {
                    console.log('objectChanged', object, attributeName, c)

                    if (object?.type === 'OsSystem') {
                      setSystem(object)
                    }
                  })
                  ossdk.studio.objectRemoved.add((a, b, c) => {
                    console.log('objectRemoved', a, b, c)
                  })

                  ossdk.studio.sceneLoaded.add(async () => {
                    console.log('sceneLoaded')
                    setIsStudioReady(true)

                    if (localStorage.getItem('autoDesignOnLoad')) {
                      const designData = await ossdk.project_form.getDesignData()
                      const hasSystems = designData.object.children.find(
                        (child) => child.type === 'OsSystem' && child.userData?.moduleQuantity > 0
                      )

                      if (hasSystems) {
                        showAlertMessage('Skip auto-design because systems were found', 'info')
                      } else {
                        showAlertMessage('auto-design can be started', 'info')
                      }
                    }
                  })

                  if (ossdk?.studio?.queueProcessed?.add) {
                    ossdk.studio.queueProcessed.add((_progress) => {
                      setProgress(_progress)
                    })
                  }
                }}
                onRemove={(ossdk) => {
                  console.log('onRemove fired')
                  clearSignalHandlers(ossdk)
                }}
              />
            )}
          </div>
          <SettingsDrawer showSettings={showSettingsDrawer} setShowSettings={setShowSettingsDrawer} />
        </Paper>
      )}
    </>
  )
}

export default DesignPage
