import React from "react"

export default function NavbarBurger(props) {
    
    return (
        <a
            role="button"
            className={props.className}
            aria-label="menu"
            aria-expanded={props.ariaExpanded}
            onClick={props.onClick}
        >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    )
}
