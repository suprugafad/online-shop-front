import { Container, Grid, Box, Typography, Stack, Link as MuiLink, FormControlLabel, Checkbox,} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import React from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { literal, object, string, TypeOf } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../components/FormInput';
// import { ReactComponent as GoogleLogo } from "../assets/google.svg";
import styled from '@emotion/styled';
import axios, {AxiosError} from "axios";
import { useNavigate } from 'react-router-dom';

export const LinkItem: any = styled(Link)`
  text-decoration: none;
  color: #3683dc;
  &:hover {
    text-decoration: underline;
    color: #5ea1b6;
  }
`;

export const OauthMuiLink = styled(MuiLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f6f7;
  // border-radius: 1;
  padding: 0.6rem 0;
  column-gap: 1rem;
  text-decoration: none;
  color: #393e45;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: #fff;
    box-shadow: 0 1px 13px 0 rgb(0 0 0 / 15%);
  }
`;

const loginSchema = object({
  email: string().min(1, 'Email is required').email('Email is invalid'),
  password: string()
    .min(1, 'Password is required')
    .min(6, 'Password must be more than 6 characters')
    .max(32, 'Password must be less than 32 characters'),
  persistUser: literal(true).optional(),
});

type ILogin = TypeOf<typeof loginSchema>;

const SignInPage = () => {
  const navigate = useNavigate();

  const defaultValues: ILogin = {
    email: '',
    password: '',
  };

  const methods = useForm<ILogin>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const onSubmitHandler: SubmitHandler<ILogin> = async (values: ILogin) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/auth/login`, values, { withCredentials: true });

      await axios.post('http://localhost:5000/api/carts', { userId: response.data.user.id }, { withCredentials: true });

      navigate('/');
    } catch (error: unknown) {
      console.error(error);
      if ((error as AxiosError)?.response?.status === 401) {
        methods.setError('email', { type: 'manual', message: 'Invalid email or password' });
        methods.setError('password', { type: 'manual', message: 'Invalid email or password' });
      }
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{ height: '100vh', backgroundColor: { xs: '#fff', md: '#f4f4f4' } }}
    >
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        sx={{ width: '100%', height: '100%' }}
      >
        <Grid
          item
          sx={{ maxWidth: '70rem', width: '100%', backgroundColor: '#fff' }}
        >
          <FormProvider {...methods}>
            <Grid
              container
              sx={{
                boxShadow: { sm: '0 0 5px #ddd' },
                py: '6rem',
                px: '1rem',
              }}
            >
              <Grid
                item
                container
                justifyContent='space-between'
                rowSpacing={5}
                sx={{
                  maxWidth: { sm: '45rem' },
                  marginInline: 'auto',
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ borderRight: { sm: '1px solid #ddd' } }}
                >
                  <Box
                    display='flex'
                    flexDirection='column'
                    component='form'
                    noValidate
                    autoComplete='off'
                    sx={{ paddingRight: { sm: '3rem' } }}
                    onSubmit={methods.handleSubmit(onSubmitHandler)}
                  >
                    <Typography
                      variant='h6'
                      component='h1'
                      sx={{ textAlign: 'center', mb: '1.5rem' }}
                    >
                      Sign in your account
                    </Typography>

                    <FormInput
                      label='Enter your email'
                      type='email'
                      name='email'
                      focused
                      required
                    />
                    <FormInput
                      type='password'
                      label='Password'
                      name='password'
                      required
                      focused
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          size='small'
                          aria-label='trust this device checkbox'
                          required
                          {...methods.register('persistUser')}
                        />
                      }
                      label={
                        <Typography
                          variant='body2'
                          sx={{
                            fontSize: '0.8rem',
                            fontWeight: 400,
                            color: '#5e5b5d',
                          }}
                        >
                          Trust this device
                        </Typography>
                      }
                    />

                    <LoadingButton
                      loading={false}
                      type='submit'
                      variant='contained'
                      sx={{
                        py: '0.8rem',
                        mt: 2,
                        width: '80%',
                        marginInline: 'auto',
                      }}
                    >
                      Sign in
                    </LoadingButton>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography
                    variant='h6'
                    component='p'
                    sx={{
                      paddingLeft: { sm: '3rem' },
                      mb: '1.5rem',
                      textAlign: 'center',
                    }}
                  >
                    Sign in with another provider:
                  </Typography>
                  <Box
                    display='flex'
                    flexDirection='column'
                    sx={{ paddingLeft: { sm: '3rem' }, rowGap: '1rem' }}
                  >
                    <OauthMuiLink href=''>
                      {/*<GoogleLogo style={{ height: '2rem' }} />*/}
                      Google
                    </OauthMuiLink>
                  </Box>
                </Grid>
              </Grid>
              <Grid container justifyContent='center'>
                <Stack sx={{ mt: '3rem', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
                    Need an account?{' '}
                    <LinkItem to='/signup' style={{color: '#6d3398'}}>Sign up here</LinkItem>
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem' }}>
                    <LinkItem to='/forgotPassword' style={{color: '#6d3398'}}>Forgot password?</LinkItem>
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </FormProvider>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignInPage;