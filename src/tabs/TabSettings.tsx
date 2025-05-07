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
  const { osSdkKey, setOsSdkKey, osToken, setOsToken } = useContext(ContainerContext)
  const [sdkKeyValue, setSdkKeyValue] = useState(osSdkKey ?? '')
  const [osTokenValue, setOsTokenValue] = useState(osToken ?? '')
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)

  const handleSave = () => {
    if (sdkKeyValue !== osSdkKey) {
      setOsSdkKey(sdkKeyValue)
    }
    if (osTokenValue !== osToken) {
      setOsToken(osTokenValue)
    }
    setIsSnackbarOpen(true)
  }

  const handleCloseSnackbar = () => {
    setIsSnackbarOpen(false)
  }

  return (
    <CustomTabPanel value={selectedTab} index={tabIndex} prefix={tabPrefix}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={isSnackbarOpen}
        onClose={handleCloseSnackbar}
        message="Settings saved"
        key="settings-snackbar"
      />
      <Stack direction="column" spacing={1}>
        <Typography variant="h6">Client Code</Typography>
        <Typography variant="body1">
          The Client Code is necessary for verifying the integration with the SDK. Request your Client Code from{' '}
          <a href="https://www.opensolar.com/partner-services/">partners services</a>.
        </Typography>
        <TextField
          required
          id="sdk_key"
          label="SDK Key"
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
