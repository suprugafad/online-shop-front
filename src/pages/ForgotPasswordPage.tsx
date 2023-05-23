import React, {ChangeEvent, useState} from 'react';
import {Button, CircularProgress, Container, Divider, TextField, Typography} from '@mui/material';
import axios from "axios";

const ForgotPasswordPage = () => {
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [userExists, setUserExists] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSubmittedEmail(event.target.value);
  };

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(submittedEmail);

    setIsValidEmail(isValid);

    if (isValid && submittedEmail) {
      setIsLoading(true);

      try {
        const data = await checkUserExists(submittedEmail);
        const exists = !!data;

        setUserExists(exists);
        await resetPasswordMail(submittedEmail);

        if (exists) {
          setIsSubmitted(true);
        } else {
          console.log('not exist')
        }
      } catch (error) {
        console.log('Error checking user existence:', error);
      }
    }

    setIsLoading(false);
  };

  const checkUserExists = async (email: string) => {
    const response = await axios(`http://localhost:5000/api/users/email/${email}`);
    return response.data;
  };

  const resetPasswordMail = async (email: string) => {
    await axios.post(`http://localhost:5000/api/auth/forgot_password`, {email});
  };

  return (
    <Container maxWidth="sm" style={{marginTop: '30px'}}>
      {isLoading && (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
          <CircularProgress/>
        </div>
      )}
      {!isLoading && (
        <>
          <Typography variant="h4" align="center" gutterBottom marginBottom={'20px'}>
            Forgot Password
          </Typography>
          <Divider/>

          {!isSubmitted ? (
            <>
              <Typography variant="h6" gutterBottom marginTop={'20px'}>
                Input email of your account. You will receive message with link fo resetting password.
              </Typography>
              <TextField
                label="Email"
                fullWidth
                value={submittedEmail}
                onChange={handleEmailChange}
                margin="normal"
                error={!isValidEmail || userExists}
                helperText={!isValidEmail ? 'Invalid email format' : userExists ? 'User with this email does not exist' : ''}
              />
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </>
          ) : (
            <Typography align="center">
              An email with further instructions to reset your password has been sent to: {submittedEmail}
            </Typography>
          )}
        </>
      )}
    </Container>
  );
};

export default ForgotPasswordPage;
