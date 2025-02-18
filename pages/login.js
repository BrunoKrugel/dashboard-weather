import Head from 'next/head';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import { Button, TextField, Paper, Alert, Snackbar } from '@mui/material';
import clientPromise from '../lib/db/mongodb';
import axios from 'axios';

export default function Home({ isConnected }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const isLogged = () => {
    if (localStorage.getItem('username') !== null)
      router.push('/main/dashboard');
  };

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.user.value;
    const password = e.target.password.value;
    try {
      await axios.post(`${window.location.origin}/api/auth/loginAuth`, {
        username,
        password,
      });
      localStorage.setItem('isLogged', 'true');
      localStorage.setItem('username', username);
      axios
        .post(`${window.location.origin}/api/db/info`, {
          username,
        })
        .then((res) => {
          localStorage.setItem('name', res.data.name);
          localStorage.setItem('lat', res.data.lat);
          localStorage.setItem('long', res.data.long);
          localStorage.setItem('email', res.data.email);
        });
      router.push('/main/dashboard');
    } catch (error) {
      localStorage.setItem('isLogged', '');
      setOpen(true);
    }
  };

  useEffect(() => {
    console.log(localStorage.getItem('username'));
    //TODO: check if user is logged
    //if (localStorage.getItem('username') !== null) router.push('/main/dashboard');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, ['']);

  return (
    <div className={styles.container}>
      <Head>
        <title>Dashboard Weather</title>
        <meta name="description" content="Login Page" />
        <link rel="icon" href="/cloudy.png" />
      </Head>
      <form onSubmit={handleSubmit}>
        <Paper className={styles.card} elevation={3}>
          <TextField id="user" label="Usuário" variant="outlined" />
          <TextField
            id="password"
            label="Senha"
            variant="outlined"
            type="password"
          />
          {isConnected
            ? console.log('DB connected')
            : console.log('DB not connected')}
          <div>
            <Button type="submit" variant="contained">
              Entrar
            </Button>
            <Link href="/auth/createUser" passHref>
              <Button variant="outlined">Registrar</Button>
            </Link>
          </div>
          <div className={styles.forgotPassword}>
            <Link href="/auth/forgotPassword" passHref>
              <a>Esqueceu a senha?</a>
            </Link>
          </div>
        </Paper>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Usuário/senha incorretos.
        </Alert>
      </Snackbar>
    </div>
  );
}

export async function getServerSideProps(_context) {
  try {
    await clientPromise;
    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}
