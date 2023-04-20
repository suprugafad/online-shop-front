import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Footer: React.FC = () => {
  return (
    <AppBar position="static" color={'default'}>
      <Toolbar>
        <Typography variant="body1" color="inherit" sx={{ flexGrow: 1 }}>
          Онлайн-магазин настольных игр
        </Typography>
        <Typography variant="body2" color="inherit">
          © {new Date().getFullYear()}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;