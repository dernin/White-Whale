export default function FormField(props) {
    // get input type based on props.element
    let element
    switch(props.element) {
        case 'input':
            element = <input className="input is-medium" type={props.type} placeholder={props.placeholder} name={props.name} onChange={props.onChange}/>
            break
        case 'textarea':
            element = <textarea className="textarea is-medium" placeholder={props.placeholder} name={props.name} onChange={props.onChange}></textarea>
    }

    return (
            <div className="field">
                <label className="label">{props.label}</label>
                <div className="control">
                    {element}
                </div>
                <p className="help is-warning">{props.error}</p>
            </div>
    )
}