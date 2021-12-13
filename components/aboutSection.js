export default function AboutSection(props, {children}) {

    return (
        <div className="section container color-bg" id={props.id}>
            <h2 className="title is-2">{props.title}</h2>
            {props.text}
            <div className="author-children">{props.children}</div>
        </div>
    )
}