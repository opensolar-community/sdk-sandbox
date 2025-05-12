import { Stack, Typography } from '@mui/material'
import { CustomTabPanel } from '../utils'

interface Props {
  selectedTab: number
  tabIndex: number
  tabPrefix: string
}

const TabDocs = ({ selectedTab, tabIndex, tabPrefix }: Props) => {
  return (
    <CustomTabPanel value={selectedTab} index={tabIndex} prefix={tabPrefix}>
      <Stack direction="column" spacing={1}>
        <Typography variant="h6">Documentation</Typography>
        <Typography variant="subtitle1">Useful links to important documentation.</Typography>
        <Typography variant="body1">
          <ul>
            <li>
              <a href="https://developers.opensolar.com/sdk/learn/" target="_blank" rel="noopener noreferrer">
                Complete SDK guide
              </a>
            </li>
            <li>
              <a href="https://github.com/opensolar-community/sdk-sandbox/" target="_blank" rel="noopener noreferrer">
                Sandbox code repository
              </a>
            </li>
            <li>
              <a href="https://www.npmjs.com/package/@opensolar/ossdk-react" target="_blank" rel="noopener noreferrer">
                OpenSolar SDK React library (ossdk-react)
              </a>
            </li>
            <li>
              <a href="https://www.opensolar.com/partner-services/" target="_blank" rel="noopener noreferrer">
                Partner services
              </a>
            </li>
            <li>
              <a href="https://www.opensolar.com/pro-services/" target="_blank" rel="noopener noreferrer">
                Need help?
              </a>
            </li>
          </ul>
        </Typography>
      </Stack>
    </CustomTabPanel>
  )
}
export default TabDocs
