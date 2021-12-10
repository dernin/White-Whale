import React from 'react'
import { getTitle, authorFolder } from '../lib/util'
import Match from './match'
import { runQuery } from '../lib/macrometa'

export default class Work extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            matchVisible: false,
            matchesHeight: 0,
            expandIcon: '+',
        }

        this.Expand = this.Expand.bind(this)
        this.resizeContainer = this.resizeContainer.bind(this)
        
    this.pageData = props.pageData
    this.author = props.author
    this.data = props.data
    this.ia = this.data['ia']

    // Get book title
    this.title = getTitle(this.data['ia'], props.author)

    // Get number of matches
    this.matches = this.data['matches']

    //const authorFold = authorFolder(props.author)
    
    //this.pageData = this.getPageData(props.author, this.data['ia'])
    }


    resizeContainer() {
        if (this.state.matchVisible) {
            this.matchesContainer.style.height = 'auto';
            const height = this.matchesContainer.scrollHeight
            
            this.matchesContainer.style.height = height + 'px'
        }

    }

    

    Expand(){
        let height
        if (this.state.matchesHeight == 0) {
            height = this.matchesContainer.scrollHeight
        }
        else {
            height = 0
        }

        let icon
        if (this.state.expandIcon == '+') {
            icon = '-'
           
        } else {
            icon = '+'
        }

        
        
        this.setState((prevState) => ({
            matchVisible: !prevState.matchVisible,
            matchesHeight: height,
            expandIcon: icon
        }))

        this.matchesContainer.style.height = height + "px"
    }

    async componentDidMount() {
        window.addEventListener('resize', this.resizeContainer)
        //data = await runQuery(`FOR file IN works FILTER file.author == '${this.author}' RETURN file`)
        
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeContainer)
    }


    render() {
        return (
            <div className="work-container">
                <div className="work-header"  onClick={this.Expand}>
                    <div className="matches-circle"><div className="matches-count">{this.matches.length}</div></div>
                    <div className="work-title">{this.title}</div>
                    
                    <div className="plus-icon">{this.state.expandIcon}</div>
                </div>
                <div className={`matches-container ${this.state.matchVisible ? "active" : ""}`} ref={(matchesContainer) => {this.matchesContainer = matchesContainer}}>
                {this.matches.map((match, key) => {
                    return (
                        <Match
                            key={key}
                            data={match}
                            id={this.data['ia']}
                            author={this.props.author}
                            pageData={this.pageData}
                        />
                    )
                })}
                </div>
            </div>
        )
            }
    
}
