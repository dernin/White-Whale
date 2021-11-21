import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/header'
import Body from '../components/body'
import Footer from '../components/footer'
import { searchPhrase, setAuthorData } from '../lib/search'
import { getAuthors } from '../lib/authors'
import Layout from '../components/layout'

export async function getStaticProps() {
    const authorList = getAuthors()
    
    
    return {
        props: {
            authorList
        }
    }
}

export default function Home(props) {

    return (
        <>
        <Layout>
            <Body authorList={props.authorList} welcomeText={["Chase down passages easier and find repetition of ideas and phrases in an author's works by quickly searching the ", <b key='b'>full text</b>, " of their entire bibliography at once."]} />
        </Layout>
        </>
    )
}
