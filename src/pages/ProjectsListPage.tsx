import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import WarningIcon from '@mui/icons-material/Warning';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const EMPTY_PROJECT_FORM = {
  identifier: '',
  address: '',
  locality: '',
  state: '',
  zip: '',
  lat: '',
  lon: '',
  country_iso2: '',
}

// OpenSolar-supported countries: Country.iso2 + name from
// sunsuite django/osapi/production_utils.py COUNTRY_NAMES (excludes sentinel "**").
// MK label matches django/osapi/migrations/0508_update_country_to_North_Macedonia.py.
// Sorted alphabetically by country name.
const COUNTRY_ISO2_OPTIONS = [
  { iso2: 'AF', label: 'Afghanistan' },
  { iso2: 'AX', label: 'Aland Islands' },
  { iso2: 'AL', label: 'Albania' },
  { iso2: 'DZ', label: 'Algeria' },
  { iso2: 'AS', label: 'American Samoa' },
  { iso2: 'AD', label: 'Andorra' },
  { iso2: 'AO', label: 'Angola' },
  { iso2: 'AI', label: 'Anguilla' },
  { iso2: 'AQ', label: 'Antarctica' },
  { iso2: 'AG', label: 'Antigua and Barbuda' },
  { iso2: 'AR', label: 'Argentina' },
  { iso2: 'AM', label: 'Armenia' },
  { iso2: 'AW', label: 'Aruba' },
  { iso2: 'AU', label: 'Australia' },
  { iso2: 'AT', label: 'Austria' },
  { iso2: 'AZ', label: 'Azerbaijan' },
  { iso2: 'BS', label: 'Bahamas' },
  { iso2: 'BH', label: 'Bahrain' },
  { iso2: 'BD', label: 'Bangladesh' },
  { iso2: 'BB', label: 'Barbados' },
  { iso2: 'BY', label: 'Belarus' },
  { iso2: 'BE', label: 'Belgium' },
  { iso2: 'BZ', label: 'Belize' },
  { iso2: 'BJ', label: 'Benin' },
  { iso2: 'BM', label: 'Bermuda' },
  { iso2: 'BT', label: 'Bhutan' },
  { iso2: 'BO', label: 'Bolivia' },
  { iso2: 'BA', label: 'Bosnia and Herzegovina' },
  { iso2: 'BW', label: 'Botswana' },
  { iso2: 'BV', label: 'Bouvet Island' },
  { iso2: 'BR', label: 'Brazil' },
  { iso2: 'IO', label: 'British Indian Ocean Territory' },
  { iso2: 'VG', label: 'British Virgin Islands' },
  { iso2: 'BN', label: 'Brunei Darussalam' },
  { iso2: 'BG', label: 'Bulgaria' },
  { iso2: 'BF', label: 'Burkina Faso' },
  { iso2: 'BI', label: 'Burundi' },
  { iso2: 'KH', label: 'Cambodia' },
  { iso2: 'CM', label: 'Cameroon' },
  { iso2: 'CA', label: 'Canada' },
  { iso2: 'CV', label: 'Cape Verde' },
  { iso2: 'KY', label: 'Cayman Islands' },
  { iso2: 'CF', label: 'Central African Republic' },
  { iso2: 'TD', label: 'Chad' },
  { iso2: 'CL', label: 'Chile' },
  { iso2: 'CN', label: 'China' },
  { iso2: 'CX', label: 'Christmas Island' },
  { iso2: 'CC', label: 'Cocos (Keeling) Islands' },
  { iso2: 'CO', label: 'Colombia' },
  { iso2: 'KM', label: 'Comoros' },
  { iso2: 'CG', label: 'Congo' },
  { iso2: 'CK', label: 'Cook Islands' },
  { iso2: 'CR', label: 'Costa Rica' },
  { iso2: 'CI', label: 'Cote d\'Ivoire' },
  { iso2: 'HR', label: 'Croatia' },
  { iso2: 'CU', label: 'Cuba' },
  { iso2: 'CY', label: 'Cyprus' },
  { iso2: 'CZ', label: 'Czech Republic' },
  { iso2: 'KP', label: 'Democratic People\'s Republic of Korea' },
  { iso2: 'CD', label: 'Democratic Republic of the Congo' },
  { iso2: 'DK', label: 'Denmark' },
  { iso2: 'DJ', label: 'Djibouti' },
  { iso2: 'DM', label: 'Dominica' },
  { iso2: 'DO', label: 'Dominican Republic' },
  { iso2: 'EC', label: 'Ecuador' },
  { iso2: 'EG', label: 'Egypt' },
  { iso2: 'SV', label: 'El Salvador' },
  { iso2: 'GQ', label: 'Equatorial Guinea' },
  { iso2: 'ER', label: 'Eritrea' },
  { iso2: 'EE', label: 'Estonia' },
  { iso2: 'ET', label: 'Ethiopia' },
  { iso2: 'FK', label: 'Falkland Islands (Malvinas)' },
  { iso2: 'FO', label: 'Faroe Islands' },
  { iso2: 'FM', label: 'Federated States of Micronesia' },
  { iso2: 'FJ', label: 'Fiji' },
  { iso2: 'FI', label: 'Finland' },
  { iso2: 'FR', label: 'France' },
  { iso2: 'GF', label: 'French Guiana' },
  { iso2: 'PF', label: 'French Polynesia' },
  { iso2: 'TF', label: 'French Southern and Antarctic Lands' },
  { iso2: 'GA', label: 'Gabon' },
  { iso2: 'GM', label: 'Gambia' },
  { iso2: 'GE', label: 'Georgia' },
  { iso2: 'DE', label: 'Germany' },
  { iso2: 'GH', label: 'Ghana' },
  { iso2: 'GI', label: 'Gibraltar' },
  { iso2: 'GR', label: 'Greece' },
  { iso2: 'GL', label: 'Greenland' },
  { iso2: 'GD', label: 'Grenada' },
  { iso2: 'GP', label: 'Guadeloupe' },
  { iso2: 'GU', label: 'Guam' },
  { iso2: 'GT', label: 'Guatemala' },
  { iso2: 'GG', label: 'Guernsey' },
  { iso2: 'GN', label: 'Guinea' },
  { iso2: 'GW', label: 'Guinea-Bissau' },
  { iso2: 'GY', label: 'Guyana' },
  { iso2: 'HT', label: 'Haiti' },
  { iso2: 'HM', label: 'Heard Island and McDonald Islands' },
  { iso2: 'VA', label: 'Holy See (Vatican City)' },
  { iso2: 'HN', label: 'Honduras' },
  { iso2: 'HK', label: 'Hong Kong' },
  { iso2: 'HU', label: 'Hungary' },
  { iso2: 'IS', label: 'Iceland' },
  { iso2: 'IN', label: 'India' },
  { iso2: 'ID', label: 'Indonesia' },
  { iso2: 'IR', label: 'Iran (Islamic Republic of)' },
  { iso2: 'IQ', label: 'Iraq' },
  { iso2: 'IE', label: 'Ireland' },
  { iso2: 'IM', label: 'Isle of Man' },
  { iso2: 'IL', label: 'Israel' },
  { iso2: 'IT', label: 'Italy' },
  { iso2: 'JM', label: 'Jamaica' },
  { iso2: 'JP', label: 'Japan' },
  { iso2: 'JE', label: 'Jersey' },
  { iso2: 'JO', label: 'Jordan' },
  { iso2: 'KZ', label: 'Kazakhstan' },
  { iso2: 'KE', label: 'Kenya' },
  { iso2: 'KI', label: 'Kiribati' },
  { iso2: 'KW', label: 'Kuwait' },
  { iso2: 'KG', label: 'Kyrgyzstan' },
  { iso2: 'LA', label: 'Lao People\'s Democratic Republic' },
  { iso2: 'LV', label: 'Latvia' },
  { iso2: 'LB', label: 'Lebanon' },
  { iso2: 'LS', label: 'Lesotho' },
  { iso2: 'LR', label: 'Liberia' },
  { iso2: 'LY', label: 'Libyan Arab Jamahiriya' },
  { iso2: 'LI', label: 'Liechtenstein' },
  { iso2: 'LT', label: 'Lithuania' },
  { iso2: 'LU', label: 'Luxembourg' },
  { iso2: 'MO', label: 'Macau' },
  { iso2: 'MG', label: 'Madagascar' },
  { iso2: 'MW', label: 'Malawi' },
  { iso2: 'MY', label: 'Malaysia' },
  { iso2: 'MV', label: 'Maldives' },
  { iso2: 'ML', label: 'Mali' },
  { iso2: 'MT', label: 'Malta' },
  { iso2: 'MH', label: 'Marshall Islands' },
  { iso2: 'MQ', label: 'Martinique' },
  { iso2: 'MR', label: 'Mauritania' },
  { iso2: 'MU', label: 'Mauritius' },
  { iso2: 'YT', label: 'Mayotte' },
  { iso2: 'MX', label: 'Mexico' },
  { iso2: 'MC', label: 'Monaco' },
  { iso2: 'MN', label: 'Mongolia' },
  { iso2: 'ME', label: 'Montenegro' },
  { iso2: 'MS', label: 'Montserrat' },
  { iso2: 'MA', label: 'Morocco' },
  { iso2: 'MZ', label: 'Mozambique' },
  { iso2: 'MM', label: 'Myanmar (Burma)' },
  { iso2: 'NA', label: 'Namibia' },
  { iso2: 'NR', label: 'Nauru' },
  { iso2: 'NP', label: 'Nepal' },
  { iso2: 'NL', label: 'Netherlands' },
  { iso2: 'AN', label: 'Netherlands Antilles' },
  { iso2: 'NC', label: 'New Caledonia' },
  { iso2: 'NZ', label: 'New Zealand' },
  { iso2: 'NI', label: 'Nicaragua' },
  { iso2: 'NE', label: 'Niger' },
  { iso2: 'NG', label: 'Nigeria' },
  { iso2: 'NU', label: 'Niue' },
  { iso2: 'NF', label: 'Norfolk Island' },
  { iso2: 'MK', label: 'North Macedonia' },
  { iso2: 'MP', label: 'Northern Mariana Islands' },
  { iso2: 'NO', label: 'Norway' },
  { iso2: 'OM', label: 'Oman' },
  { iso2: 'PK', label: 'Pakistan' },
  { iso2: 'PW', label: 'Palau' },
  { iso2: 'PS', label: 'Palestine' },
  { iso2: 'PA', label: 'Panama' },
  { iso2: 'PG', label: 'Papua New Guinea' },
  { iso2: 'PY', label: 'Paraguay' },
  { iso2: 'PE', label: 'Peru' },
  { iso2: 'PH', label: 'Philippines' },
  { iso2: 'PN', label: 'Pitcairn Islands' },
  { iso2: 'PL', label: 'Poland' },
  { iso2: 'PT', label: 'Portugal' },
  { iso2: 'PR', label: 'Puerto Rico' },
  { iso2: 'QA', label: 'Qatar' },
  { iso2: 'KR', label: 'Republic of Korea' },
  { iso2: 'MD', label: 'Republic of Moldova' },
  { iso2: 'RE', label: 'Reunion' },
  { iso2: 'RO', label: 'Romania' },
  { iso2: 'RU', label: 'Russia' },
  { iso2: 'RW', label: 'Rwanda' },
  { iso2: 'BL', label: 'Saint Barthelemy' },
  { iso2: 'SH', label: 'Saint Helena' },
  { iso2: 'KN', label: 'Saint Kitts and Nevis' },
  { iso2: 'LC', label: 'Saint Lucia' },
  { iso2: 'MF', label: 'Saint Martin' },
  { iso2: 'PM', label: 'Saint Pierre and Miquelon' },
  { iso2: 'VC', label: 'Saint Vincent and the Grenadines' },
  { iso2: 'WS', label: 'Samoa' },
  { iso2: 'SM', label: 'San Marino' },
  { iso2: 'ST', label: 'Sao Tome and Principe' },
  { iso2: 'SA', label: 'Saudi Arabia' },
  { iso2: 'SN', label: 'Senegal' },
  { iso2: 'RS', label: 'Serbia' },
  { iso2: 'SC', label: 'Seychelles' },
  { iso2: 'SL', label: 'Sierra Leone' },
  { iso2: 'SG', label: 'Singapore' },
  { iso2: 'SX', label: 'Sint Maarten' },
  { iso2: 'SK', label: 'Slovakia' },
  { iso2: 'SI', label: 'Slovenia' },
  { iso2: 'SB', label: 'Solomon Islands' },
  { iso2: 'SO', label: 'Somalia' },
  { iso2: 'ZA', label: 'South Africa' },
  { iso2: 'GS', label: 'South Georgia South Sandwich Islands' },
  { iso2: 'ES', label: 'Spain' },
  { iso2: 'LK', label: 'Sri Lanka' },
  { iso2: 'SD', label: 'Sudan' },
  { iso2: 'SR', label: 'Suriname' },
  { iso2: 'SJ', label: 'Svalbard' },
  { iso2: 'SZ', label: 'Swaziland' },
  { iso2: 'SE', label: 'Sweden' },
  { iso2: 'CH', label: 'Switzerland' },
  { iso2: 'SY', label: 'Syrian Arab Republic' },
  { iso2: 'TW', label: 'Taiwan' },
  { iso2: 'TJ', label: 'Tajikistan' },
  { iso2: 'TH', label: 'Thailand' },
  { iso2: 'TL', label: 'Timor-Leste' },
  { iso2: 'TG', label: 'Togo' },
  { iso2: 'TK', label: 'Tokelau' },
  { iso2: 'TO', label: 'Tonga' },
  { iso2: 'TT', label: 'Trinidad and Tobago' },
  { iso2: 'TN', label: 'Tunisia' },
  { iso2: 'TR', label: 'Turkey' },
  { iso2: 'TM', label: 'Turkmenistan' },
  { iso2: 'TC', label: 'Turks and Caicos Islands' },
  { iso2: 'TV', label: 'Tuvalu' },
  { iso2: 'UG', label: 'Uganda' },
  { iso2: 'UA', label: 'Ukraine' },
  { iso2: 'AE', label: 'United Arab Emirates' },
  { iso2: 'GB', label: 'United Kingdom' },
  { iso2: 'TZ', label: 'United Republic of Tanzania' },
  { iso2: 'US', label: 'United States' },
  { iso2: 'UM', label: 'United States Minor Outlying Islands' },
  { iso2: 'VI', label: 'United States Virgin Islands' },
  { iso2: 'UY', label: 'Uruguay' },
  { iso2: 'UZ', label: 'Uzbekistan' },
  { iso2: 'VU', label: 'Vanuatu' },
  { iso2: 'VE', label: 'Venezuela' },
  { iso2: 'VN', label: 'Viet Nam' },
  { iso2: 'WF', label: 'Wallis and Futuna Islands' },
  { iso2: 'EH', label: 'Western Sahara' },
  { iso2: 'YE', label: 'Yemen' },
  { iso2: 'ZM', label: 'Zambia' },
  { iso2: 'ZW', label: 'Zimbabwe' },
] as const

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
  const [formData, setFormData] = useState(EMPTY_PROJECT_FORM)
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
    setFormData(EMPTY_PROJECT_FORM)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const canSave = Boolean(
    formData.identifier.trim() && formData.lat !== '' && formData.lon !== '' && formData.country_iso2
  )
  const handleSave = () => {
    if (!canSave) {
      return
    }
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
    { field: 'country_iso2', headerName: 'Country', width: 100 },
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
          <Card sx={{ mb: 2, bgcolor: '#fff8e6' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WarningIcon color="warning" fontSize="large" />
                <Typography variant="h6">
                  WARNING
                </Typography></Box>
              <Typography variant="body2">
                Projects created in this environment do not persist across sessions. However, they are added to your OpenSolar organization account and can be accessed in the Sandbox using their unique identifier.
              </Typography>
            </CardContent>
          </Card>
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
          <FormControl fullWidth required margin="dense">
            <InputLabel id="country-iso2-label">Country</InputLabel>
            <Select
              labelId="country-iso2-label"
              label="Country"
              name="country_iso2"
              value={formData.country_iso2}
              onChange={(event) => {
                setFormData((prev) => ({ ...prev, country_iso2: String(event.target.value) }))
              }}
            >
              {COUNTRY_ISO2_OPTIONS.map((country) => (
                <MenuItem key={country.iso2} value={country.iso2}>
                  {country.label} ({country.iso2})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary" disabled={!canSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default ProjectsList
