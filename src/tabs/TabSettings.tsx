import { Box, Button, Snackbar, Stack, TextField, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { ContainerContext } from '../ContainerContext'
import { CustomTabPanel } from '../utils'

interface Props {
  selectedTab: number
  setSelectedTab: (tabIndex: number) => void
  tabIndex: number
  tabPrefix: string
}

const TabSettings = ({ selectedTab, tabIndex, setSelectedTab, tabPrefix }: Props) => {
  const { osSdkKey, setOsSdkKey, osToken, setOsToken, ossdk } = useContext(ContainerContext)
  const [sdkKeyValue, setSdkKeyValue] = useState(osSdkKey ?? '')
  const [osTokenValue, setOsTokenValue] = useState(osToken ?? '')
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const handleSave = () => {
    if (sdkKeyValue !== osSdkKey) {
      setOsSdkKey(sdkKeyValue)
    }
    if (osTokenValue !== osToken) {
      setOsToken(osTokenValue)
    }
    setSnackbarMessage('Settings saved')
  }

  const handleCloseSnackbar = () => {
    setSnackbarMessage('')
  }

  const handleLogout = () => {
    setOsTokenValue('')
    setOsToken('')
    ossdk?.auth?.logout()
    setSnackbarMessage('Logged out')
  }

  return (
    <CustomTabPanel value={selectedTab} index={tabIndex} prefix={tabPrefix}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarMessage}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        key="settings-snackbar"
      />
      <Stack direction="column" spacing={2}>
        <Typography variant="h6">Client Code</Typography>
        <Typography variant="body1">
          The Client Code is necessary for verifying the integration with the SDK. Request your Client Code from{' '}
          <a href="https://www.opensolar.com/partner-services/">partners services</a>.
        </Typography>
        <TextField
          required
          id="sdk_key"
          label="Client Code"
          variant="standard"
          value={sdkKeyValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSdkKeyValue(event.target.value)}
        />
        <Typography variant="h6">JWT (osToken)</Typography>
        <Typography variant="body1">
          The JWT is used to identify the user to the SDK. The JWT can be generated using an SDK key. If you have a JWT
          you can enter it below.
        </Typography>
        <TextField
          required
          id="jwt"
          label="JWT"
          variant="standard"
          value={osTokenValue}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setOsTokenValue(event.target.value)}
        />
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
        <Typography variant="body1">
          Or request a new JWT from <a href="https://www.opensolar.com/partner-services/">partners services</a>.
        </Typography>

        <Box>
          <Box display={'flex'} justifyContent={'flex-end'}>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Stack>
    </CustomTabPanel>
  )
}
export default TabSettings
