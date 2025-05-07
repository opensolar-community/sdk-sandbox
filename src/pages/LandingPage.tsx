import { Box, Button, Container, Typography } from '@mui/material'
import { Link } from 'react-router'

const LandingPage = () => {
  return (
    <Container maxWidth="lg" style={{ paddingTop: 50 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box>
          <Typography variant="h1" color={'secondary'}>
            Welcome to the OpenSolar SDK Sandbox
          </Typography>
        </Box>
        <Box flexGrow={1}>
          <Typography variant="body1" mt={2}>
            This is a reference implementation which uses the OpenSolar SDK to integrate with the OpenSolar platform.
          </Typography>
          <Typography variant="body1" mt={1}>
            To quickly get started, you'll need a JWT key which you can request from{' '}
            <a href="https://www.opensolar.com/partner-services/">partner services</a>. Once you have that, navigate to
            settings and plug that in to get going.
          </Typography>
        </Box>
      </Box>
      <Button style={{ marginTop: 20 }} variant="contained" component={Link} to="/projects">
        Get Started
      </Button>
    </Container>
  )
}
export default LandingPage
