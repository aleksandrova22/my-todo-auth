import { Header } from '@/components/Header';
import { Toaster } from 'react-hot-toast';
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps ) {
  return <>
    <Header />
    <SessionProvider session={session}>
    <Component {...pageProps} />
    </SessionProvider >
    <Toaster />
  </>
}

