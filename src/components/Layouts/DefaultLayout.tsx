import { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { red } from '@mui/material/colors';
import Link from 'next/link';
const color = red[500];

const DefaultLayout: React.FC<{ title: string, children: ReactNode }> = ({ title, children }) => {
  const router = useRouter()

  return (
    <Box>
      <Head>
        <title>{title}</title>
      </Head>
      <AppBar component="nav" position="sticky" sx={{ background: '#262626' }}>
        <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
          <Typography
            variant="h6"
            component="div"
            sx={{ display: { xs: 'block', cursor: 'pointer' } }}
            onClick={() => {router.push('/')}}
          >
            PAYNET
          </Typography>
          <Box sx={{ display: { xs: 'flex' }, gap: 2,  }}>
            <Button variant={router.asPath == '/' ? 'outlined' : 'text'} sx={{ color: '#fff' }} onClick={() => router.push('/')}>
              Homepage
            </Button>
            <Button variant={router.asPath.includes('/payments') ? 'outlined' : 'text'} sx={{ color: '#fff' }} onClick={() => router.push('/payments')}>
              Payments
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: '50px' }}>
        {children}
      </Container>
    </Box>
  )
}

export default DefaultLayout