import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { checkAuthentication, logout } from '../api/AuthAPI';
import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({title}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await checkAuthentication();
        console.log(response)

        if (response && response.data.isAuthenticated) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error(error)
        window.location.reload();
      }
    }

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response && response.status === 200) {
        const auth = await checkAuthentication();
        if (auth) {
          setIsAuthenticated(auth.data.isAuthenticated);
          setOpen(false);
        }
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AppBar position="static" color={'default'}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            {title}
          </Typography>
          {!isAuthenticated && (
            <>
              <Button component={Link} to="/signin" color="inherit">
                Sign In
              </Button>
              <Button component={Link} to="/signup" color="inherit">
                Sign Up
              </Button>
            </>
          )}
          {isAuthenticated && (
            <>
              <Button color="inherit">Profile</Button>
              <Button component={Link} to="/cart" color="inherit">
                Cart
              </Button>
              <Button color="inherit" onClick={handleOpen}>
                Log out
              </Button>
            </>
          )}
          <Button color="inherit">About shop</Button>
        </Toolbar>
      </AppBar>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;