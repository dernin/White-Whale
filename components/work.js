import React from 'react'
import { getTitle} from '../lib/util'
import Match from './match'

export default class Work extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            matchVisible: false,
            matchesHeight: 0,
            expandIcon: 'fa-angle-right',
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
    this.q = this.data['q']
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
        if (this.state.expandIcon == 'fa-angle-right') {
            icon = 'fa-angle-down'
           
        } else {
            icon = 'fa-angle-right'
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
        
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeContainer)
    }


    render() {
        return (
            <div className="work-container">
                <div className="work-header clickable"  onClick={this.Expand}>
                    <div className="matches-circle"><div className="matches-count">{this.matches.length}</div></div>
                    <div className="work-title">{this.title}</div>
                    
                    
                    <button className="card-header-icon plus-icon" aria-label="see more">
                        <span className="icon">
                            <i className={`fas ${this.state.expandIcon}`} aria-hidden="true"></i>
                        </span>
                    </button>
                </div>
                <div className={`matches-container ${this.state.matchVisible ? "active" : ""}`} ref={(matchesContainer) => {this.matchesContainer = matchesContainer}}>
                {this.matches.map((match, index) => {
                    return (
                        <Match
                            key={this.data['ia'] + index}
                            data={match}
                            q = {this.q}
                            id={this.data['ia']}
                        />
                    )
                })}
                </div>
            </div>
        )
            }
    
}
