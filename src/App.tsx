import { AppBar, Box, Button, Container, createTheme, ThemeProvider, Toolbar, Typography } from '@mui/material'
import { useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router'
import { ContainerProvider } from './ContainerContext'
import DesignPage from './pages/DesignPage'
import LandingPage from './pages/LandingPage'
import ProjectsListPage from './pages/ProjectsListPage'
import SettingsDrawer from './SettingsDrawer'

const theme = createTheme({
  palette: {
    primary: {
      main: '#f69516',
    },
    secondary: {
      main: '#4d4d4d',
    },
  },
  typography: {
    fontFamily: 'Raleway',
    htmlFontSize: 16,
    h1: {
      fontSize: '2.4rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '1.8rem',
    },
    h3: {
      fontSize: '1.6rem',
    },
    h5: {
      fontSize: '1.2rem',
    },
    body1: {
      fontFamily: 'Roboto',
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          borderBottom: '1px solid #ccc',
        },
      },
    },
  },
})

function App() {
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false)

  return (
    <ThemeProvider theme={theme}>
      <ContainerProvider>
        <BrowserRouter>
          <div className="App">
            <AppBar position="static">
              <Container maxWidth="xl">
                <Toolbar disableGutters>
                  <Link to="/">
                    <img src="/logo.png" width="200px" alt="logo" />
                  </Link>
                  <Box>
                    <Button key="Home" component={Link} to="/" variant="text">
                      <Typography variant="h5" color="secondary">
                        Home
                      </Typography>
                    </Button>
                    <Button key="Projects" component={Link} to="/projects" variant="text">
                      <Typography variant="h5" color="secondary">
                        Projects
                      </Typography>
                    </Button>
                  </Box>
                </Toolbar>
              </Container>
            </AppBar>
            <Routes>
              <Route index element={<LandingPage />} />
              <Route path="/projects" element={<ProjectsListPage />} />
              <Route path="/design/:id" element={<DesignPage />} />
            </Routes>

            <SettingsDrawer showSettings={showSettingsDrawer} setShowSettings={setShowSettingsDrawer} />
          </div>
        </BrowserRouter>
      </ContainerProvider>
    </ThemeProvider>
  )
}

export default App
