import Head from 'next/dist/shared/lib/head'
import Footer from './footer'
import Header from './header'
import { useRouter } from 'next/dist/client/router'
import { useEffect } from 'react'


export default function Layout({ children }) {
    const router = useRouter()

    useEffect(() => {
        //if(router.pathname == '/') {
            const html = document.getElementsByTagName('html')[0]
            html.classList.add('home-background')

            return () => {
                html.classList.remove('home-background')
            }
        //}
    })

    return <>
        <Head>
            <title>White Whale</title>
            <meta
                name="description"
                content="A quick and easy way to search the full text of open domain literature"
            />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css" integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossOrigin="anonymous"></link>
            {router.pathname == '/' &&
                <link rel="stylesheet" href="styles/home.css"></link>
            }
        </Head>
        <div className="wrapper">
            <Header />
            <div className="mt-5 mb-5">
                {children}
            </div>
        </div>
        <Footer />
    </>
}
