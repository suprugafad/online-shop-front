import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {TextField, Button, Typography, Container, CircularProgress} from '@mui/material';
import axios from "axios";

const ResetPasswordPage = () => {
  const {resetToken, id} = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [tokenExists, setTokenExists] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/check_token/${id}/${resetToken}`);
        const isValidToken = response.data.isValidToken;
        setTokenExists(isValidToken)
        setIsLoading(false);
      } catch (error) {
        setTokenExists(false);
        setIsLoading(false)
      }
    };

    checkToken().catch(() => {
    });
  }, [id, resetToken]);

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    await axios.post(`http://localhost:5000/api/auth/change_password/${id}/${resetToken}`, {newPassword}, {withCredentials: true})
      .then(response => {
        // Обработать ответ от сервера

      })
      .catch(error => {
        console.error('Ошибка при сбросе пароля:', error);
        setError('Ошибка при сбросе пароля');
      });
  };

  if (!tokenExists) {
    return (
      <Container maxWidth="sm">
        {isLoading && (
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
            <CircularProgress/>
          </div>
        )}
        {!isLoading && (
          <>
            <Typography variant="h4" align="center" gutterBottom marginTop={'30px'}>
              This link is invalid.
            </Typography>
          </>
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      {isLoading && (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
          <CircularProgress/>
        </div>
      )}
      {!isLoading && (
        <>
          <Typography variant="h4" align="center" gutterBottom marginTop={'30px'}>
            Reset password
          </Typography>
          <TextField
            label="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            variant="contained"
            color="primary"
            onClick={handleResetPassword}
            fullWidth
            size="large"
            style={{marginTop: '16px'}}
          >
            Save password
          </Button>
        </>
      )}
    </Container>
  );
}
export default ResetPasswordPage;