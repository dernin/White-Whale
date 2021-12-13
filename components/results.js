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
    //console.log('res: ', res)
    if (res.status == 299) {
        const error = new Error('An error occurred while fetching the data.')
        // Attach extra info to the error object.
        error.info = await res.json()
        error.status = res.status
        throw error
    }

    return res.json()
}

function useFetchResults(apiString) {
    const { data, error } = useSWR(apiString, fetcher, {
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
            // if more than 30 tries, give up (5 minutes)
            if (retryCount >= 30) return

            // Retry after 15 seconds
            setTimeout(() => revalidate({ retryCount }), 15000)
        },
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
    })
    //console.log('data', data)

    return {
        results: data,
        isLoading: !error && !data,
        isError: error,
    }
}

export default function Results(props) {

    const longSearchMessage = (
        <div className="has-text-centered mt-2">
            This may take a few minutes. Please be patient as we search through{' '}
            {props.author}&apos;s bibliography.
        </div>
    )

    const searchresults = useFetchResults(
        `/api/author=${props.author}&phrase=${props.phrase}`
    )

    const pageData = useFetchResults(`/api/works?author=${props.author}`)

    //console.log('pageData', pageData.results)

    function buildResults(results, pageData) {


        const formattedResults = results.map((work) => {
            if (work['matches'] != null && work['matches'].length > 0) {
                const workPages = pageData.filter((entry) => {
                    return entry['ia'] == work['ia']
                })
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
