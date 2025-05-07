import Box from '@mui/material/Box'
import DividerBase from '@mui/material/Divider'
import * as React from 'react'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
  prefix: string
}

export const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, prefix, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${prefix}-${index}`}
      aria-labelledby={`${prefix}-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export const Divider = (props) => {
  return <DividerBase style={{ marginLeft: 20, marginRight: 10 }} orientation="vertical" flexItem />
}
