import Alert from '@mui/material/Alert'
import Stack from '@mui/material/Stack'
import { useContext } from 'react'
import { ContainerContext } from '../ContainerContext'

const styles = {
  code: {
    backgroundColor: '#f0f0f0',
    padding: 4,
    borderRadius: 2,
  },
}
const ShowStateMessage = () => {
  const { loginMethod, projectKey, osOrgId } = useContext(ContainerContext)

  const alerts: any[] = []

  let final = false

  if (!osOrgId && !final) {
    alerts.push(
      <span>
        The "osOrgId" parameter is required for initialising SDK and should be based on the org_id of the provided JWT.
        Please refer to the README for more information.
      </span>
    )
    final = true
  }

  if (!loginMethod && !final) {
    alerts.push(
      <span>
        Selecting a loginMethod is required. See <span style={styles.code}> Setup &gt; Login with X</span>
      </span>
    )
    final = true
  }

  if (!projectKey && !final) {
    alerts.push(<span>Please provide a client code in Settings &gt; Client code.</span>)
    final = true
  }

  if (alerts.length > 0) {
    return (
      <Stack sx={{ width: '100%' }} spacing={1} style={{ marginTop: 10, marginBottom: 10 }}>
        {alerts.map((alert, key) => (
          <Alert key={key} severity="error">
            {alert}
          </Alert>
        ))}
      </Stack>
    )
  } else {
    return null
  }
}

export default ShowStateMessage
