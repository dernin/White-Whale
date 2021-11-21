export default function CardHeader(props) {
    return(
        <div className="card-header clickable" onClick={props.onClick}>
            <p className="card-header-title">{props.text}</p>
            <button className="card-header-icon" aria-label="see more">
                <span className="icon">
                    <i className={`fas ${props.icon}`} aria-hidden="true"></i>
                </span>
            </button>
        </div>
    )
}