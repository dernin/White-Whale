import Link from 'next/dist/client/link'
import React, { useState } from 'react'
import SearchForm from './searchform'
import Results from './results'


export default function Body(props) {
    
    const [searched, setSearched] = useState(false)
    const [currentPhrase, setCurrentPhrase] = useState('')
    const [currentAuthor, setCurrentAuthor] = useState('')


    function handleSearch(author, phrase) {
        setSearched(true)
        setCurrentPhrase(phrase)
        setCurrentAuthor(author)
    }


    return (
        <div className="container mb-6">
            <div className="color-bg">
                <div className="container wide-50 has-text-centered pt-5">
                    {props.welcomeText}
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
                    authorList={props.authorList}
                    onSearch={handleSearch}
                />
            </div>

            <div className="pt-5">
                <div
                    className="section pt-0"
                >
                    {searched &&
                        <Results author={currentAuthor} phrase={currentPhrase} /> }
                </div>
            </div>
        </div>
    )
}
