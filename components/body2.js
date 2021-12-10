import Link from 'next/dist/client/link'
import React from 'react'
import SearchForm from './searchform'
import { getData, resolveAfter10 } from '../lib/util'
import Work from './work'
import Loader from './loader'
import useSWR from 'swr'
const fetcher = (...args) => fetch(...args).then((res) => res.json())

export default class Body2 extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            searching: false,
            searched: false,
            longSearch: false,
            searchResults: {},
            author: '',
            longSearchMessage: '',
        }

        this.handleSearch = this.handleSearch.bind(this)

        //this.longSearchMessage = <div className="has-text-centered mt-2">This may take a few minutes. Please be patient as we search through {this.state.author}'s bibliography.</div>
    }

    async handleSearch(author, phrase) {
        this.setState({
            ['searched']: false,
            ['searching']: true,
            ['longSearch']: false,
            ['searchResults']: {},
            ['author']: author,
            ['longSearchMessage']: (
                <div className="has-text-centered mt-2">
                    This may take a few minutes. Please be patient as we search
                    through {author}&apos;s bibliography.
                </div>
            ),
        })

        let data = this.search(false, false, author, phrase)

        //const apiString = '/api/author=' + author + '&phrase=' + phrase
        //const data = await getData(apiString)
        if (data) {
            console.log(data)
            this.setState({
                ['searched']: true,
                ['searching']: false,
                ['longSearch']: false,
                ['searchResults']: data,
                ['author']: author,
                ['longSearchMessage']: '',
            })
        }
    }

    run(test, author, phrase) {
        const apiString = `/api/author=${author}&phrase=${phrase}&test=${test}`
        const { data, error } = useSWR(apiString, fetcher)
        //console.log(data)
        if (error) return false
        if (!data) return false
        if (data) {
            console.log(data['allMatches'])
            return data['allMatches']
        }
    }

    async search(searched, test, author, phrase) {
        if (searched == false) {
            const results = this.run(test, author, phrase)
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

    buildResults(results) {
        //console.log(results)
        /*
        while(this.section.firstChild) {
            this.section.firstChild.remove()
        } */

        const formattedResults = results.map((work) => {
            if (work['matches'] != null && work['matches'].length > 0) {
                return (
                    <Work
                        key={work['ia']}
                        data={work}
                        author={this.state.author}
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

    loadingResults() {
        setTimeout(() => {
            this.setState({
                ['longSearch']: true,
            })
        }, 5000)
        //console.log('loading results')

        let longSearchMessage
        if (this.state.longSearch) {
            longSearchMessage = (
                <div className="has-text-centered mt-2">
                    This may take a few minutes. Please be patient as we search
                    through {this.state.author}&apos;s bibliography.
                </div>
            )
        } else {
            longSearchMessage = null
        }

        return (
            <>
                <div className="loading"></div>
                {longSearchMessage}
            </>
        )
    }

    render() {
        /*
        let results
        if (this.state.searched) {
            results = JSON.stringify(this.state.searchResults)
        }
        else results = "" */

        return (
            <div className="container mb-6">
                <div className="color-bg">
                    <div className="container wide-50 has-text-centered pt-5">
                        {this.props.welcomeText}
                    </div>
                    <div className="section">
                        <div className="mb-5">
                            Simply choose an author and enter a phrase.{' '}
                            <Link href="/about#authors">
                                <a>Why these authors?</a>
                            </Link>
                        </div>
                    </div>
                    <SearchForm
                        authorList={this.props.authorList}
                        onSearch={this.handleSearch}
                    />
                </div>

                <div className="pt-5">
                    <div
                        className="section pt-0"
                        ref={(section) => {
                            this.section = section
                        }}
                    >
                        {this.state.searching && (
                            <Loader
                                longSearchMessage={this.state.longSearchMessage}
                            />
                        )}
                        {this.state.searched &&
                            this.buildResults(this.state.searchResults)}
                    </div>
                </div>
            </div>
        )
    }
}
