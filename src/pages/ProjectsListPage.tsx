import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const ProjectsList = () => {
  const _rows = [
    {
      identifier: '00Q8F000004TKwjUAG_1',
      address: '126 Mountain View Rd',
      locality: 'Hillsborough Township',
      state: 'NJ',
      zip: '08844',
      country_iso2: 'US',
      lat: 40.47811069999999,
      lon: -74.6609253,
    },
    {
      identifier: '00Q8F000004TKwUUAW',
      address: '45601 Angelica Dr',
      locality: 'Murrieta',
      state: 'CA',
      zip: '92562',
      country_iso2: 'US',
      lat: 33.5691906,
      lon: -117.1988399,
    },
  ]

  const navigate = useNavigate()
  const [rows, setRows] = useState(_rows)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    identifier: '',
    address: '',
    locality: '',
    state: '',
    zip: '',
    lat: '',
    lon: '',
  })
  useEffect(() => {
    const storedRows = sessionStorage.getItem('projects')
    if (storedRows) {
      setRows(JSON.parse(storedRows))
    } else {
      sessionStorage.setItem('projects', JSON.stringify(_rows))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFormData({
      identifier: '',
      address: '',
      locality: '',
      state: '',
      zip: '',
      lat: '',
      lon: '',
    })
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const handleSave = () => {
    setRows((prevRows) => [...prevRows, { ...formData }])
    sessionStorage.setItem('projects', JSON.stringify([...rows, { ...formData }]))
    handleClose()
  }
  const columns: GridColDef[] = [
    { field: 'identifier', headerName: 'Project Identifier', width: 200 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'locality', headerName: 'Locality', width: 200 },
    { field: 'state', headerName: 'State' },
    { field: 'zip', headerName: 'Zip' },
    { field: 'lat', headerName: 'Latitude' },
    { field: 'lon', headerName: 'Longitude' },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      minWidth: 150,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              navigate(`/design/${id}`)
            }}
          >
            <EditIcon style={{ marginRight: 5 }} />
            Design
          </Button>,
        ]
      },
    },
  ]

  return (
    <Container maxWidth="lg" style={{ paddingTop: 50 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%', justifyContent: 'space-between' }}>
        <Typography variant="h1" color={'secondary'}>
          My Projects
        </Typography>
        <Button color="primary" variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Create Project
        </Button>
      </Box>
      <Paper sx={{ height: 400, marginTop: 2 }}>
        <DataGrid rows={rows} columns={columns} getRowId={(row) => row.identifier} />
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Identifier"
            type="text"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            name="identifier"
            required
          />
          <TextField
            margin="dense"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            name="address"
          />
          <TextField
            margin="dense"
            label="Locality"
            type="text"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            name="locality"
          />
          <TextField
            onChange={handleChange}
            margin="dense"
            label="State"
            type="text"
            fullWidth
            variant="outlined"
            name="state"
          />
          <TextField
            margin="dense"
            label="Zip"
            type="text"
            fullWidth
            variant="outlined"
            onChange={handleChange}
            name="zip"
          />
          <TextField
            margin="dense"
            label="Latitude"
            type="number"
            fullWidth
            required
            variant="outlined"
            onChange={handleChange}
            name="lat"
          />
          <TextField
            margin="dense"
            label="Longitude"
            type="number"
            fullWidth
            required
            variant="outlined"
            onChange={handleChange}
            name="lon"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default ProjectsList
