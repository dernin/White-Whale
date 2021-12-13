import React from 'react'
import NavbarBurger from './navburger'
import Link from 'next/link'

export default class Header extends React.Component {
    constructor(props) {
        super(props)

        this.state = { isToggleOn: false }

        this.toggleBurger = this.toggleBurger.bind(this)
    }

    toggleBurger() {
        this.setState((prevState) => ({
            isToggleOn: !prevState.isToggleOn,
        }))
    }

    render() {
        return (
            <>
                <nav
                    className="navbar is-spaced is-transparent container"
                    role="navigation"
                    aria-label="main navigation"
                >
                    <div className="navbar-brand">
                        <Link href="/">
                        <a className="navbar-item">
                            <div className="is-sr-only">White Whale</div>
                            <div aria-hidden='true' className="title is-large">
                                <span className="has-text-white">White</span>{' '}
                                <span className="has-text-primary">Whale</span>
                            </div>
                        </a>
                        </Link>
                        <NavbarBurger
                            ariaExpanded={
                                this.state.isToggleOn ? 'true' : 'false'
                            }
                            className={
                                this.state.isToggleOn
                                    ? 'navbar-burger is-active'
                                    : 'navbar-burger'
                            }
                            onClick={this.toggleBurger}
                        />
                    </div>
                    <div
                        className={
                            this.state.isToggleOn
                                ? 'navbar-menu is-active'
                                : 'navbar-menu'
                        }
                    >
                        <div className="navbar-start">
                            <Link href="/">
                                <a className="navbar-item">Home</a>
                            </Link>
                            <Link href="/about">
                                <a className="navbar-item">About</a>
                            </Link>
                            <Link href="/contact">
                                <a className="navbar-item">Contact</a>
                            </Link>
                        </div>
                        
                    </div>
                </nav>
                <div className="divider container is-fullhd"></div>
            </>
        )
    }
}
