import ReactJsonView from '@microlink/react-json-view'
import { Box, Button, Modal } from '@mui/material'
import { useMemo } from 'react'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const COLLAPSE_AT_DEPTH = 2

const DataModal = ({ dataTitle, dataModalContent, setDataTitle, setDataModalContent, showDataModal, setShowDataModal }) => {
  const handleClose = () => {
    setShowDataModal(false)
    setDataTitle('')
    setDataModalContent('')
  }

  const outputData = useMemo(() => {
    try {
      return dataModalContent ? JSON.parse(dataModalContent) : {};
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      return {};
    }
  }, [dataModalContent])
  return (
    <Modal
      open={showDataModal}
      onClose={handleClose}
      aria-labelledby="data-modal-title"
      aria-describedby="data-modal-description"
    >
      <Box sx={style}>
        <div>
          <h1>{dataTitle}</h1>
          <Box sx={{ maxHeight: '80vh', overflowY: 'scroll' }}>
            <ReactJsonView
              name={false}
              src={outputData}
              collapsed={COLLAPSE_AT_DEPTH} />
          </Box>
          <Button sx={{ mt: 2 }} variant="contained" onClick={handleClose}>
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  )
}

export default DataModal
