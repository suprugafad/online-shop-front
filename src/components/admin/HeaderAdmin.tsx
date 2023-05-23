import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { checkAdmin, logout } from '../../api/AuthAPI';
import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface HeaderProps {
  title: string;
}

const HeaderAdmin: React.FC<HeaderProps> = ({title}) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await checkAdmin();

        if (response && response.data.isAuthenticated) {
          setIsAdmin(true);
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
        const auth = await checkAdmin();
        if (auth) {
          setIsAdmin(auth.data.isAuthenticated);
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
      <AppBar position="static" color={'primary'}>
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" style={{textDecoration: 'none', color: 'white'}} sx={{flexGrow: 1, marginLeft: '3%'}}>
            {title}
          </Typography>
          {isAdmin && (
            <>
              <Button component={Link} to="/users" color="inherit">
                Users
              </Button>
              <Button component={Link} to="/orders" color="inherit">
                Orders
              </Button>
              <Button component={Link} to="/products" color="inherit">
                Products
              </Button>
              <Button component={Link} to="/statistics" color="inherit">
                Statistics
              </Button>
              <Button component={Link} to="/content" color="inherit">
                Content
              </Button>
              <Button color="inherit" onClick={handleOpen}>
                Log out
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title" style={{backgroundColor: '#7E52A0', color: 'white', marginBottom: '25px'}}>Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary" variant={'contained'} autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HeaderAdmin;