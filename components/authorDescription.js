import authors from '../public/data/authors.json'
import Block from './block'
import Card from './card/card'
import ReactMarkdown from 'react-markdown'
import { getAuthorWorks } from '../lib/authors'
import SimpleWork from './simpleWork'
import { isEmpty, replaceSpace } from '../lib/util'
import CardHeader from './card/cardHeader'
import React from 'react'
import Image from 'next/image'

// !!! Issue with how data is being taken here (specifically props.data)
export default class AuthorDescription extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            cardVisible: false,
            cardHeight: 0,
            icon: 'fa-angle-right',
        }

        this.title = props.title
        this.author = authors[props.title]
        this.description = this.author['summary']

        this.data = props.data[0]
        console.log(this.data)

        this.markdown = <ReactMarkdown>{this.description}</ReactMarkdown>

        // get keys (title) to each work
        this.keys = Object.keys(this.data)

        this.src = '/img/' + replaceSpace(this.title) + '.jpg'

        this.Expand = this.Expand.bind(this)

        this.resizeContainer = this.resizeContainer.bind(this)
    }

    resizeContainer() {
        if (this.state.cardVisible) {
            this.cardContainer.style.height = 'auto';
            const height = this.cardContainer.scrollHeight
            this.setState({
                cardHeight: height
            })
        }

    }

    Expand() {
        console.log('expand')
        let height
        let icon
        if (this.state.cardHeight == 0) {
            height = this.cardContainer.scrollHeight
            icon = 'fa-angle-down'
        } else {
            height = 0
            icon = 'fa-angle-right'
        }

        this.setState({
            cardVisible: true,
            cardHeight: height,
            icon: icon,
        })
    }

    componentDidMount() {
        window.addEventListener('resize', this.resizeContainer)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeContainer)
    }

    render() {
        return (
                <Card>
                    <CardHeader
                        text={this.title}
                        onClick={this.Expand}
                        icon={this.state.icon}
                    />
                    <div
                        className={`card-container ${
                            this.state.cardVisible ? 'active' : ''
                        } `}
                        ref={(cardContainer) => {
                            this.cardContainer = cardContainer
                        }}
                        style={{ height: this.state.cardHeight }}
                    >
                        
                            
                            <div className="side-image is-pulled-left">
                                    <Image
                                        width={400}
                                        height={500}
                                        src={this.src}
                                        quality={100}
                                        alt={this.title}
                                    />
                                    </div>
                                
                                <div className="mx-4 my-3">{this.markdown}</div>
                                <div className="card-content is-clear">
                                    <div className="subtitle is-3 has-text-info">
                                        Included Works
                                    </div>
                                    <div className="columns is-multiline">
                                        {this.keys.map((key) => {
                                            if (
                                                key != 'time' &&
                                                !isEmpty(
                                                    this.data[key]['item_id']
                                                )
                                            ) {
                                                return (
                                                    <SimpleWork
                                                        key={key}
                                                        title={key}
                                                        id={
                                                            this.data[key][
                                                                'item_id'
                                                            ]
                                                        }
                                                    />
                                                )
                                            }
                                        })}
                                    </div>
                                </div>
                            
                        
                    </div>
                </Card>
        )
    }
}

export function buildWorkList(author) {
    // get author file
    const file = getAuthorWorks(author)
    const data = JSON.parse(file)

    const array = [data[0]]

    return (
        <>
            {array.map((work) => {
                return <SimpleWork title={work} id={work['item_id']} key={work['item_id']} />
            })}
        </>
    )
}
