import { Html, Head, Main, NextScript } from 'next/document'
import { ColorModeScript } from '@chakra-ui/react'
import theme from "../src/theme";
import Footer from '@/components/footer';

export default function Document() {
  return (
    <Html lang="en">
      <Head title='Zenforms'>
        <meta property='og:title' content='Zenforms'/>
        </Head>
      <body>
        <Main />
        <NextScript />
      </body>
      <Footer />
    </Html>
  )
}