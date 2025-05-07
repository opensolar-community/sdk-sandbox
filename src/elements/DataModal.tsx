import { Box, Modal } from '@mui/material'

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

const DataModal = ({ dataTitle, dataModalContent, setDataTitle, setDataModalContent, showDataModal, setShowDataModal }) => {
  const handleClose = () => {
    setShowDataModal(false)
    setDataTitle('')
    setDataModalContent('')
  }
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
            <pre>{dataModalContent}</pre>
          </Box>
          <button onClick={handleClose}>Close</button>
        </div>
      </Box>
    </Modal>
  )
}

export default DataModal
