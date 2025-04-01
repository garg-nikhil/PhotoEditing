import React, { useState } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ImageUpload from './components/ImageUpload';
import EditingTools from './components/EditingTools';
import ImagePreview from './components/ImagePreview';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [image, setImage] = useState(null);
  const [editingState, setEditingState] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    rotation: 0,
    filter: '',
    crop: null
  });

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEditingChange = (type, value) => {
    setEditingState(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          bgcolor: 'background.default'
        }}
      >
        <Container 
          maxWidth="md" 
          sx={{ 
            py: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            height: '100%',
            overflow: 'hidden'
          }}>
          {!image ? (
            <ImageUpload onUpload={handleImageUpload} />
          ) : (
            <>
              <ImagePreview 
                image={image} 
                editingState={editingState} 
              />
              <EditingTools 
                editingState={editingState}
                onEditingChange={handleEditingChange}
                image={image}
              />
            </>
          )}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;