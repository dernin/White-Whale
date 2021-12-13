export default function SimpleWork(props) {

    const link = "https://archive.org/details/" + props.id

    return (
        <div className="column is-half"><a href={link} rel="noreferrer" target="_blank">{props.title}</a></div>
    )
}