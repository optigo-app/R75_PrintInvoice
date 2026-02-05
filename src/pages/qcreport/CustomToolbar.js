import React from 'react';
import { GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';

const CustomToolbar = () => {
  const theme = useTheme(); 

  return (
    <GridToolbarContainer sx={{ padding: '8px', display: 'flex', justifyContent: 'flex-start' }}>
      <GridToolbarFilterButton
        sx={{
          margin: '4px',
          padding: '10px',
          paddingX: '15px',
          borderRadius: '5px',
          border: `1px solid ${theme.palette.primary.main}`, 
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
        }}
      />
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
