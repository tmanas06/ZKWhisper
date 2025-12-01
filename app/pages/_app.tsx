import type { AppProps } from 'next/app'
import '../styles/main.scss'
import Layout from '../components/layout'
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import dynamic from 'next/dynamic';

TimeAgo.addDefaultLocale(en);

// Dynamically import wagmi providers to avoid build errors if wagmi is not installed
const WagmiWrapper = dynamic(
  () => import('../components/wagmi-wrapper'),
  { ssr: false }
);

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiWrapper>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WagmiWrapper>
  );
}
