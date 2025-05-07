import { Box, Tab, Tabs } from '@mui/material'
import { useState } from 'react'
import TabConsole from './tabs/TabConsole'
import TabDocs from './tabs/TabDocs'
import TabInspectState from './tabs/TabInspectState'
import TabSettings from './tabs/TabSettings'

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

export enum TabEnum {
  Settings = 0,
  Inspect = 1,
  Docs = 2,
  Console = 3,
}

const tabPrefix = 'settings-tab'

const SettingsDrawerContent = ({ setShowSettings }) => {
  const [selectedTab, setSelectedTab] = useState(TabEnum.Settings)

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  return (
    <Box sx={{ width: '650px' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', width: '100%' }}>
        <Box sx={{ flexGrow: 1 }}>
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
            <Tab label="Settings" {...a11yProps(TabEnum.Settings)} />
            <Tab label="Inspect" {...a11yProps(TabEnum.Inspect)} />
            <Tab label="Docs" {...a11yProps(TabEnum.Docs)} />
            <Tab label="Console" {...a11yProps(TabEnum.Console)} />
          </Tabs>
        </Box>
      </Box>
      <TabSettings
        selectedTab={selectedTab}
        tabIndex={TabEnum.Settings}
        setSelectedTab={setSelectedTab}
        tabPrefix={tabPrefix}
      />
      <TabInspectState selectedTab={selectedTab} tabIndex={TabEnum.Inspect} tabPrefix={tabPrefix} />
      <TabDocs selectedTab={selectedTab} tabIndex={TabEnum.Docs} tabPrefix={tabPrefix} />
      <TabConsole selectedTab={selectedTab} tabIndex={TabEnum.Console} tabPrefix={tabPrefix} />
    </Box>
  )
}

export default SettingsDrawerContent
