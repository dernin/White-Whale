import { useState } from 'react'
import Work from './work'
import Loader from './loader'
import useSWR from 'swr'
import { runQuery } from '../lib/macrometa'
//const fetcher = (...args) => fetch(...args).then((res) => res.json())

const fetcher = async (url) => {
    const res = await fetch(url)

    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    console.log('res: ', res)
    if (res.status == 102) {
        const error = new Error('An error occurred while fetching the data.')
        // Attach extra info to the error object.
        error.info = await res.json()
        error.status = res.status
        throw error
    }

    return res.json()
}

function fetchResults(apiString) {
    const { data, error } = useSWR(apiString, fetcher, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // if more than 30 tries, give up (5 minutes)
            if (retryCount >= 30) return

            // Retry after 10 seconds
            setTimeout(() => revalidate({ retryCount }), 10000)
        },
    })
    console.log('data', data)

    return {
        results: data,
        isLoading: !error && !data,
        isError: error,
    }
}

export default function Results(props) {
    const [searchResults, setSearchResults] = useState({})
    const [searched, setSearched] = useState(false)
    const longSearchMessage = (
        <div className="has-text-centered mt-2">
            This may take a few minutes. Please be patient as we search through{' '}
            {props.author}&apos;s bibliography.
        </div>
    )

    

    

    const searchresults = fetchResults(
        `/api/author=${props.author}&phrase=${props.phrase}`
    )

    const pageData = fetchResults(`/api/works?author=${props.author}`)

    console.log('pageData', pageData.results)

    
    //console.log('working on results')
    //console.log(searchresults.results)

    //console.log(searchresults.isError)

    /*
    if(!searched) {
        const apiString = `/api/author=${props.author}&phrase=${props.phrase}&test=false`
        const { data, error } = useSWR(apiString, fetcher)
        //console.log(data)
        //if (error) return false
        //if (!data) return false
        if (data) {
            console.log(data['allMatches'])
            setSearchResults(data['allMatches'])
            setSearched(true)
        }
    } */

    /*
    async function search(searched, test, author, phrase) {
        if (searched == false) {
            const results = run(test, author, phrase)
            if (results == false) {
                await resolveAfter10()
                search(false, true)
            } else {
                searched = true
                console.log(results)
                return results
            }
        }
    } */

    function buildResults(results, pageData) {
        //console.log(results)
        /*
        while(this.section.firstChild) {
            this.section.firstChild.remove()
        } */

        console.log(pageData)

        const formattedResults = results.map((work) => {
            if (work['matches'] != null && work['matches'].length > 0) {
                const workPages = pageData.filter((entry) => {
                    return entry['ia'] == work['ia']
                })
                //const workPages = {}
                return (
                    <Work
                        key={work['ia']}
                        data={work}
                        author={props.author}
                        pageData={workPages}
                    />
                )
            }
        })
        const filteredResults = formattedResults.filter((result) => {
            return result != null
        })

        if (filteredResults.length > 0) {
            return filteredResults
        } else {
            return <div className="has-text-centered">No results</div>
        }
    }
    if (searchresults.isLoading || searchresults.isError || pageData.isLoading)
        return <Loader longSearchMessage={longSearchMessage} />

    return (
        <>
            {buildResults(
                searchresults.results['allMatches'],
                pageData.results
            )}
        </>
    )
}
