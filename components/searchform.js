import React from 'react'
<<<<<<< HEAD
import { strip, getData } from '../lib/util'
=======
import { strip } from '../lib/util'
>>>>>>> origin/txtsearch

class SearchForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            author: 'Select an author',
            phrase: '',
            authorError: '',
            phraseError: '',
            prevAuth: '',
            prevPhrase: ''
        }

<<<<<<< HEAD
        this.router = props.router

=======
>>>>>>> origin/txtsearch
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        const target = event.target
        const name = target.name
        const value = target.value

        this.setState({
            [name]: strip(value),
            ['authorError']: '',
            ['phraseError']: '',
        })
    }

    async handleSubmit(event) {
<<<<<<< HEAD
        console.log('handle Submit ran')
=======
>>>>>>> origin/txtsearch
        event.preventDefault()
        if (this.state.author === 'Select an author') {
            this.setState({
                ['authorError']: 'Please select an author',
            })
            return
        }
        if (this.state.phrase === '') {
            this.setState({
                ['phraseError']: 'Please enter a search term',
            })
            return
        }
<<<<<<< HEAD
        if (this.state.author == this.state.prevAuth && this.state.phrase == this.state.prevPhrase) {
            return
        }
        else {
            console.log(this.state.author + " " + this.state.prevAuth)
            console.log(this.state.phrase + " " + this.state.prevPhrase)
=======
        else if (this.state.author == this.state.prevAuth && this.state.phrase == this.state.prevPhrase) {
            return
        }
        else {
            // console.log(this.state.author + " " + this.state.prevAuth)
            // console.log(this.state.phrase + " " + this.state.prevPhrase)
>>>>>>> origin/txtsearch
            this.setState({
                ['prevAuth']: this.state.author,
                ['prevPhrase']: this.state.phrase
            })
            this.props.onSearch(this.state.author, this.state.phrase)
            
        }
        

    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="columns is-gapless searchbar is-centered is-multiline">
                    <div className="column is-narrow">
                        <div className="select is-large">
                            <select
                                name="author"
                                value={this.state.author}
                                onChange={this.handleChange}
                            >
                                <option key="select" value="Select an author">
                                    Select an author
                                </option>
                                {this.props.authorList.map((name) => {
                                    return <option key={name} value={name}>{name}</option>
                                })}
<<<<<<< HEAD

                            </select>
                            <div className="has-text-warning is-size-4">
                                {this.state.authorError}
                            </div>
=======
                            </select>
                        </div>
                        <div className="has-text-warning is-size-4">
                                {this.state.authorError}
>>>>>>> origin/txtsearch
                        </div>
                    </div>
                    <div className="column">
                        <input
                            className="input is-large"
                            name="phrase"
                            value={this.state.phrase}
                            type="text"
                            placeholder='Try selecting Herman Melville and searching for "Jonah"'
                            onChange={this.handleChange}
                        />
                        <div className="has-text-warning is-size-4">
                            {this.state.phraseError}
                        </div>
                    </div>
                    <div className="column is-narrow is-flex is-justify-content-center">
                        <button
                            type="submit"
                            value="Submit"
                            className="button is-link is-large"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </form>
        )
    }
}

export default SearchForm