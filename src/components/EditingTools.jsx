import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Slider,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import BrightnessHighIcon from '@mui/icons-material/BrightnessHigh';
import ContrastIcon from '@mui/icons-material/Contrast';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import TonalityIcon from '@mui/icons-material/Tonality';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import CompareIcon from '@mui/icons-material/Compare';
import SaveIcon from '@mui/icons-material/Save';

function EditingTools({ editingState, onEditingChange, image }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [originalState] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    rotation: 0,
    filter: ''
  });

  const tools = [
    {
      name: 'Brightness',
      key: 'brightness',
      icon: <BrightnessHighIcon fontSize="small" />,
      min: 0,
      max: 200,
      defaultValue: 100
    },
    {
      name: 'Contrast',
      key: 'contrast',
      icon: <ContrastIcon />,
      min: 0,
      max: 200,
      defaultValue: 100
    },
    {
      name: 'Saturation',
      key: 'saturation',
      icon: <ColorLensIcon />,
      min: 0,
      max: 200,
      defaultValue: 100
    },
    {
      name: 'Rotation',
      key: 'rotation',
      icon: <RotateRightIcon />,
      min: 0,
      max: 360,
      defaultValue: 0
    }
  ];

  const presets = [
    { name: 'Grayscale', value: 'grayscale(100%)', icon: <TonalityIcon fontSize="small" /> },
    { name: 'Sepia', value: 'sepia(100%)', icon: <InvertColorsIcon fontSize="small" /> },
    { name: 'Vintage', value: 'saturate(150%) sepia(25%) contrast(120%)', icon: <PhotoCameraIcon fontSize="small" /> },
    { name: 'Noir', value: 'grayscale(100%) contrast(120%) brightness(90%)', icon: <MovieFilterIcon fontSize="small" /> },
    { name: 'Chrome', value: 'contrast(110%) brightness(110%) saturate(130%)', icon: <FilterVintageIcon fontSize="small" /> },
    { name: 'Fade', value: 'brightness(110%) saturate(80%) opacity(90%)', icon: <FilterDramaIcon fontSize="small" /> }
  ];

  const [aiPrompt, setAiPrompt] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  const analyzeImage = () => {
    const { brightness, contrast, saturation } = editingState;
    let suggestions = [];

    if (brightness < 90) suggestions.push('Image appears dark. Consider increasing brightness.');
    if (brightness > 120) suggestions.push('Image might be overexposed. Try reducing brightness.');
    if (contrast < 90) suggestions.push('Low contrast detected. Increase contrast for better definition.');
    if (contrast > 130) suggestions.push('High contrast might be too harsh. Consider reducing it.');
    if (saturation < 90) suggestions.push('Colors appear muted. Try increasing saturation.');
    if (saturation > 120) suggestions.push('Colors might be oversaturated. Consider reducing saturation.');

    return suggestions.join('\n');
  };

  const handleAiPrompt = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Analyze current image state
    const analysis = analyzeImage();
    setAnalysisResult(analysis);

    const promptLower = aiPrompt.toLowerCase();
    
    if (promptLower.includes('vintage') || promptLower.includes('old')) {
      onEditingChange('filter', 'saturate(150%) sepia(25%) contrast(120%)');
    } else if (promptLower.includes('bright') || promptLower.includes('light')) {
      onEditingChange('brightness', 150);
    } else if (promptLower.includes('dark') || promptLower.includes('moody')) {
      onEditingChange('brightness', 70);
      onEditingChange('contrast', 130);
    } else if (promptLower.includes('warm')) {
      onEditingChange('filter', 'sepia(30%)');
      onEditingChange('saturation', 120);
    } else if (promptLower.includes('cool')) {
      onEditingChange('saturation', 80);
      onEditingChange('contrast', 110);
    }

    setIsProcessing(false);
  };
  
  // Update return statement with new layout
  const handleCompareToggle = () => {
    if (showComparison) {
      onEditingChange('brightness', originalState.brightness);
      onEditingChange('contrast', originalState.contrast);
      onEditingChange('saturation', originalState.saturation);
      onEditingChange('rotation', originalState.rotation);
      onEditingChange('filter', originalState.filter);
    }
    setShowComparison(!showComparison);
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 4, boxShadow: 'none', maxHeight: '100vh', overflow: 'auto' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
            Adjustments
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>
        
        {tools.map((tool) => (
          <Grid item xs={6} md={3} key={tool.key}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: 24 }}>
                {tool.icon}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                  {tool.name}
                </Typography>
                <Slider
                  size="small"
                  value={editingState[tool.key]}
                  onChange={(_, value) => onEditingChange(tool.key, value)}
                  min={tool.min}
                  max={tool.max}
                  defaultValue={tool.defaultValue}
                  sx={{
                    '& .MuiSlider-thumb': {
                      width: 12,
                      height: 12,
                    },
                    '& .MuiSlider-valueLabel': {
                      fontSize: '0.75rem'
                    }
                  }}
                />
              </Box>
            </Box>
          </Grid>
        ))}
  
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
            Preset Filters
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            {presets.map((preset) => (
              <Tooltip title={preset.name} key={preset.value}>
                <IconButton
                  onClick={() => onEditingChange('filter', preset.value)}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  {preset.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Grid>
  
        {/* Updated save button styling */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
            AI Image Enhancement
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                placeholder="Describe how you want to enhance the image..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                size="small"
                sx={{ flex: 1 }}
              />
              <Button
                variant="contained"
                onClick={handleAiPrompt}
                startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <AutoFixHighIcon />}
                disabled={isProcessing || !aiPrompt.trim()}
                sx={{ borderRadius: 2, whiteSpace: 'nowrap', flex: '0 0 auto' }}
              >
                {isProcessing ? 'Processing...' : 'Enhance'}
              </Button>
            </Box>
            {analysisResult && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  bgcolor: 'background.paper', 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                  {analysisResult}
                </Typography>
              </Paper>
            )}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<CompareIcon />}
              onClick={() => {
                if (showOriginal) {
                  Object.entries(editingState).forEach(([key, value]) => {
                    onEditingChange(key, value);
                  });
                } else {
                  Object.entries(originalState).forEach(([key, value]) => {
                    onEditingChange(key, value);
                  });
                }
                setShowOriginal(!showOriginal);
              }}
              sx={{ borderRadius: 2 }}
            >
              {showOriginal ? 'Show Edited' : 'Show Original'}
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={() => {
                const link = document.createElement('a');
                link.download = 'edited-image.jpg';
                link.href = image;
                link.click();
              }}
              sx={{ borderRadius: 2 }}
            >
              Save Image
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
 