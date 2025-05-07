import SettingsIcon from '@mui/icons-material/Settings'
import { Drawer, SpeedDial } from '@mui/material'
import SettingsDrawerContent from './SettingsDrawerContent'

const SettingsDrawer = ({ showSettings, setShowSettings }) => {
  return (
    <>
      <Drawer open={showSettings} onClose={() => setShowSettings(false)} anchor="left">
        <SettingsDrawerContent setShowSettings={setShowSettings} />
      </Drawer>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', top: 16, right: 16 }}
        icon={<SettingsIcon />}
        onClick={() => setShowSettings(true)}
      ></SpeedDial>
    </>
  )
}

export default SettingsDrawer
