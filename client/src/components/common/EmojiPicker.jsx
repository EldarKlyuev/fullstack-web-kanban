import { Box, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'


const EmojiPicker = props => {
  const [selectedEmoji, setSelectedEmoji] = useState()

  useEffect(() => {
    setSelectedEmoji(props.icon)
  }, [props.icon])

  return (
    <Box sx={{ position: 'relative', width: 'max-content' }}>
      <Typography
        variant='h3'
        fontWeight='700'
        sx={{ cursor: 'pointer' }}
      >
        {selectedEmoji}
      </Typography>
      <Box sx={{
        display: 'block',
        position: 'absolute',
        top: '100%',
        zIndex: '9999'
      }}>
      </Box>
    </Box>
  )
}

export default EmojiPicker