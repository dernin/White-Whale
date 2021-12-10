import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/header'
import Body from '../components/body'
import Footer from '../components/footer'
import { searchPhrase } from '../lib/search'
import { getAuthors, setAuthorData, getAuthorWorks } from '../lib/authors'
import Layout from '../components/layout'
import { getFabric, updateDoc, runQuery } from '../lib/macrometa'
import { getURL } from 'next/dist/shared/lib/utils'
import { getData, resolveAfter10 } from '../lib/util'
import useSWR from 'swr'

export async function getStaticProps() {
    await getFabric()
    //getAuthorWorks("Herman Melville")
    //await updateDoc('authors', '8541999028', {'name': 'Herman', 'Clarel: A Poem and Pilgrimage in the Holy Land': { 'item_id': '1234'}})

    // const data = await getData("https://ia800800.us.archive.org/fulltext/inside.php?item_id=mobydickorwhitew00melv_1&doc=mobydickorwhitew00melv_1&path=/24/items/mobydickorwhitew00melv_1&q=%22Ocean%22")
    //console.log('data: ', data)

    async function run(test) {
        const apiString =
            'http://localhost:3000/api/author=Herman Melville&phrase=computer&test=' +
            test
        const { data, error } = useSWR(apiString, getData)
        //console.log(data)
        return data
    }
    async function search(searched, test) {
        if (searched == false) {
            const results = await run(test)
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

    //search(false, false)

    return {
        props: {},
    }
}

export default function Home(props) {
    /*async function runQ() {
        const data = await getData("http://localhost:3000/api/query?q=Herman Melville")
        //const data = await runQuery(`FOR file IN works FILTER file.author == 'Herman Melville' RETURN file`)
        console.log(data)
    } */
    //runQ()
    const fetcher = (...args) => fetch(...args).then(res => res.json())
    function run(test) {
        const apiString =
            'http://localhost:3000/api/author=Herman Melville&phrase=silicone&test=' + test
        const { data, error } = useSWR(apiString, fetcher)
        //console.log(data)
        if (error) false
        if (!data) false
        if (data) {
            console.log(data['allMatches'])
            return data['allMatches']
        }
    }

    async function search(searched, test) {
        if (searched == false) {
            const results = run(test)
            if (results == false) {
                await resolveAfter10()
                search(false, true)
            } else {
                searched = true
                console.log(results)
                return results
            }
        }
    }

    search(false, false)

    //const data = run()
    //console.log(data)


    return (
        <>
            <Layout></Layout>
        </>
    )
}
