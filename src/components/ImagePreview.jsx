import React from 'react';
import { Box, Paper } from '@mui/material';

function ImagePreview({ image, editingState }) {
  const { brightness, contrast, saturation, rotation, filter } = editingState;

  const imageStyle = {
    maxWidth: '100%',
    maxHeight: '50vh',
    objectFit: 'contain',
    filter: `${filter || ''} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`.trim(),
    transform: `rotate(${rotation}deg)`,
    transition: 'filter 0.3s ease, transform 0.3s ease',
    borderRadius: 2,
    boxShadow: 3,
    width: '100%',
    willChange: 'filter, transform'
  };

  return (
    <Paper 
      sx={{
        p: 1.5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px',
        bgcolor: 'background.paper',
        mb: 3,
        borderRadius: 4
      }}
    >
      <Box
        component="img"
        src={image}
        alt="Preview"
        sx={imageStyle}
      />
    </Paper>
  );
}

export default ImagePreview;