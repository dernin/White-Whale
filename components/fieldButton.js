import Button from "./button"

export default function FieldButton(props) {
    return (
        <div className="field">
            <div className="control">
                <Button className={props.className} type={props.type} text={props.text} />
            </div>
        </div>
    )
}