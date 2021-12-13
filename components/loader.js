import { useEffect, useState } from "react"

export default function Loader(props) {
    const searchMessage = props.longSearchMessage
    const [message, setMessage] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            console.log('ran')
           setMessage(searchMessage)
        }, 5000)
        return () => clearTimeout(timer) 
    }, [])
    


    return (
        <>
        <div className="loading"></div>
        {message}
        </>
    )
}