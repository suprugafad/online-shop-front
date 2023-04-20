import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <AppBar position="static" color={'default'}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Button color="inherit">Categories</Button>
        <Button color="inherit">Contacts</Button>
        <Button color="inherit">About shop</Button>
        <Button color="inherit">Cart</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;