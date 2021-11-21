import '../styles/globals.scss'
import Script from 'next/script'

function MyApp({ Component, pageProps }) {
  return <>
  <Script strategy="lazyOnload" src="https://www.googletagmanager.com/gtag/js?id=G-Y76Z5SVS9T" />
  <Script strategy="lazyOnload" id="ga">
    {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-Y76Z5SVS9T', {
      page_path: window.location.pathname,
    });
    `}
  </Script>
  <Component {...pageProps} />
  </>
}

export default MyApp
