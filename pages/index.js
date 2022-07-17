import Body from '../components/body'
import { getAuthors } from '../lib/authors.ts'
import Layout from '../components/layout'
import { getFabric } from '../lib/macrometa'


export async function getStaticProps() {
    await getFabric()
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
