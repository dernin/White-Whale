import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/header'
import Body from '../components/body'
import Footer from '../components/footer'
import { searchPhrase } from '../lib/search'
import { getAuthors, setAuthorData } from '../lib/authors'
import Layout from '../components/layout'
import { getFabric } from '../lib/macrometa'



export async function getServerSideProps(context) {
    await getFabric()
    const query = context.query
    const author = query['author']
    const phrase = query['phrase'].toLowerCase()
    console.log(author + ' ' + phrase)

    const authorList = getAuthors()
    const results = search(false, false, author, phrase)
    const searchResults = results[0]['allMatches']

    
    //const results = await searchPhrase(phrase, author)
    //const searchResults = results[0]['allMatches']
    
    
    return {
        props: {
            authorList,
            searchResults,
            author,
            phrase
        }
    }
}

async function searchRequest(author, phrase) {
    const results = await runQuery(
        `FOR file IN searches FILTER file.name == '${author}_search_${phrase}' RETURN file`
    )

    // if no results, send back false
    if (results.length == 0) {
        if(test == 'false') {
            searchPhrase(phrase, author)
        }
        
        return false
    } else {
        return results[0]
    }
}

async function search(searched, test, author, phrase) {
    if (searched == false) {
        const results = await searchRequest(author, phrase)
        if (results['response'] == false) {
            await resolveAfter10()
            search(false, true)
        } else {
            searched = true
            console.log(results)
            return results
        }
    }
}


export default function Search(props) {

    return (
        <>
        <Layout>
            <Body author={props.author} phrase={props.phrase} results={props.searchResults} authorList={props.authorList} welcomeText={["Chase down passages easier and find repetition of ideas and phrases in an author's works by quickly searching the ", <b key='b'>full text</b>, " of their entire bibliography at once."]} />
        </Layout>
        </>
    )
}
