import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { checkAuthentication, getUserId, logout } from '../api/AuthAPI';
import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { IUser } from "../types";
import profileAPI from "../api/ProfileAPI";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({title}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<IUser>();

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await checkAuthentication();

        if (response && response.data.isAuthenticated) {
          setIsAuthenticated(true);

          const userId = await getUserId();
          const user = await profileAPI.fetchUserInfo(userId);

          setUser(user);
        }
      } catch (error) {
        console.error(error)
        window.location.reload();
      }
    }

    fetchData().catch(() => {});
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

  const handleProfile = () => {
    navigate('/profile', {state: {user}});
  }

  return (
    <>
      <AppBar position="static" color={'primary'}>
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" style={{textDecoration: 'none', color: 'white'}} sx={{flexGrow: 1, marginLeft: '3%'}}>
            {title}
          </Typography>
          <Button color="inherit" component={Link} to="/catalog" sx={{}}>Catalog</Button>
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
              <Button color="inherit" onClick={handleProfile}>Profile</Button>
              <Button component={Link} to="/cart" color="inherit">
                Cart
              </Button>
              <Button color="inherit" onClick={handleOpen}>
                Log out
              </Button>
            </>
          )}
          <Button component={Link} to="/aboutShop" color="inherit" sx={{marginRight: '5%'}}>About shop</Button>
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
          <Button onClick={handleLogout} component={Link} to="/" color="primary" variant={'contained'} autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;