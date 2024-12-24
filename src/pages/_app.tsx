import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CssBaseline } from '@mui/material';
import { PaymentDataProvider } from '@/context/PaymentDataContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <PaymentDataProvider>
          <CssBaseline />
          <Component {...pageProps} />
        </PaymentDataProvider>
      </LocalizationProvider>
    </>
  )
}
