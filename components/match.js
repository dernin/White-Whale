import Link from 'next/link'




export default function Match(props) {
   
    const text = props.data
    const link = "https://archive.org/details/" + props.id + "/mode/2up?q=" + props.q

    return <div className="match">
        <div className="match-text" dangerouslySetInnerHTML={{__html: text}}></div>
        <div className="page"><Link href={link}><a target='_blank'>Find in the text</a></Link></div>
    </div>

}

