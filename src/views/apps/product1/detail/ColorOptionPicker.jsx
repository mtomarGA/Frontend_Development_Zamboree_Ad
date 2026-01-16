// src/views/products/ColorOptionPicker.js
import React, { useState, useEffect } from 'react';
import { Box, Popover, TextField, InputAdornment, IconButton } from '@mui/material';
import { SketchPicker } from 'react-color'; // Import the picker you want to use
import CustomTextField from '@core/components/mui/TextField'; // Assuming this is your custom text field

const ColorOptionPicker = ({ initialColor, onChange, label = 'Hex Code' }) => {
    const [color, setColor] = useState(initialColor || '#FFFFFF'); // Default to white
    const [anchorEl, setAnchorEl] = useState(null); // For Popover
    const [displayColorPicker, setDisplayColorPicker] = useState(false); // To control picker visibility

    // Update internal state if initialColor prop changes
    useEffect(() => {
        setColor(initialColor || '#FFFFFF');
    }, [initialColor]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setDisplayColorPicker(!displayColorPicker);
    };

    const handleClose = () => {
        setDisplayColorPicker(false);
        setAnchorEl(null);
    };

    const handleChange = (newColor) => {
        setColor(newColor.hex);
        onChange(newColor.hex); // Pass the hex code up to the parent form
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Display the selected color in a small swatch */}
            <Box
                sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '4px',
                    backgroundColor: color,
                    border: '1px solid #ccc',
                    cursor: 'pointer',
                    flexShrink: 0 // Prevent it from shrinking
                }}
                onClick={handleClick}
            />

            {/* TextField to display and manually enter hex code */}
            <CustomTextField
                fullWidth
                label={label}
                placeholder="#RRGGBB"
                value={color}
                onChange={(e) => {
                    const newValue = e.target.value;
                    setColor(newValue); // Update local state for immediate feedback
                    // Optionally, you can validate the hex code here before calling onChange
                    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
                        onChange(newValue);
                    }
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position='start'>
                            <Box
                                sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    backgroundColor: color,
                                    border: '1px solid #eee',
                                    mr: 1
                                }}
                            />
                        </InputAdornment>
                    ),
                    endAdornment: color && (
                        <InputAdornment position='end'>
                            <IconButton size='small' edge='end' onClick={() => handleChange({ hex: '' })}> {/* Clear button */}
                                <i className='tabler-x' />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />

            {/* Color Picker Popover */}
            <Popover
                open={displayColorPicker}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <SketchPicker color={color} onChange={handleChange} />
            </Popover>
        </Box>
    );
};

export default ColorOptionPicker;
