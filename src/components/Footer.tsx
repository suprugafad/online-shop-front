import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Link} from "react-router-dom";
import { Facebook, Instagram, Telegram } from '@mui/icons-material';
import {Box, IconButton} from "@mui/material";

const Footer: React.FC = () => {
  return (
    <AppBar position="static" color={'primary'} style={{  height: '120px'}}>
      <Toolbar sx={{width: '100%', display:'flex', justifyContent: 'space-between', marginTop: '30px'}}>

        <Typography variant="h6" component={Link} to="/" style={{textDecoration: 'none', color: 'white', }} sx={{flexGrow: 1, marginLeft: '3%'}}>
          GameScape
        </Typography>
          <Box width={'140px'} marginRight={'100px'}>
          <Typography variant="inherit" component={Link} to="/" style={{textDecoration: 'none', color: 'white', }} sx={{flexGrow: 1, marginLeft: '3%'}}>
            Follow our news:
          </Typography>
          <IconButton component="a" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" color="inherit" >
            <Facebook />
          </IconButton>
          <IconButton component="a" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" color="inherit">
            <Instagram />
          </IconButton>
          <IconButton component="a" href="https://telegram.me/" target="_blank" rel="noopener noreferrer" color="inherit">
            <Telegram />
          </IconButton>
        </Box>

        <Typography variant="body2" color="inherit" marginRight={'60px'}>
          © {new Date().getFullYear()}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;