import { Button, Stack, TextField, Typography } from '@mui/material'
import { useContext } from 'react'
import { ContainerContext } from '../ContainerContext'
import { CustomTabPanel } from '../utils'

interface Props {
  selectedTab: number
  tabIndex: number
  tabPrefix: string
}

const TabConsole = ({ selectedTab, tabIndex, tabPrefix }: Props) => {
  const { consoleOutput, setConsoleOutput } = useContext(ContainerContext)

  return (
    <CustomTabPanel value={selectedTab} index={tabIndex} prefix={tabPrefix}>
      <Stack direction="column" spacing={1}>
        <Typography variant="h6">Console</Typography>
        <Typography variant="subtitle1">Displays console output</Typography>
        <TextField
          id="outlined-multiline-static"
          label="Console"
          multiline
          rows={20}
          InputProps={{
            readOnly: true,
          }}
          value={consoleOutput}
        />
        <Button variant="contained" onClick={() => setConsoleOutput('')}>
          Clear
        </Button>
      </Stack>
    </CustomTabPanel>
  )
}
export default TabConsole
