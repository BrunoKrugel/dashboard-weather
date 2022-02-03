import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import { Button, TextField, Paper, Alert } from '@mui/material';
import clientPromise from '../lib/mongodb';
import axios from 'axios';


export default function Home({ isConnected }) {
  const router = useRouter();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.user.value;
    const password = e.target.password.value;
    try {
      await axios.post(`${window.location.origin}/api/auth/login`, {
        username,
        password,
      });
      localStorage.setItem('isLogged', 'true');
      localStorage.setItem('username', username);
      router.push('/dashboard');
    } catch (error) {
      localStorage.setItem('isLogged', '');
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Dashboard Weather</title>
        <meta name="description" content="Dashboard Weather" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <form onSubmit={handleSubmit}>
          <Paper className={styles.card} elevation={3}>
            <TextField id="user" label="User" variant="outlined" />
            <TextField
              id="password"
              label="Password"
              variant="outlined"
              type="password"
              />
            {isConnected ? (
              <Alert severity="success">DB connected!</Alert>
            ) : (
              <Alert severity="error">DB not connected!</Alert>
            )}
            <div>
              <Button type="submit" variant="contained">
                Login
              </Button>
              <Link href="/auth/createUser" passHref>
                <Button variant="outlined">Sign in</Button>
              </Link>
            </div>
          </Paper>
        </form>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
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