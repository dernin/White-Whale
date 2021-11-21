export default function Button(props) {
    const className = "button " + props.className
    return (
        <button className={className} type={props.type} value={props.value}>{props.text}</button>
    )
}