import fs from 'fs'
import { formatMatch, getPageNumber } from '../lib/util'
import Link from 'next/link'
import { useLayoutEffect, useState } from 'react'



export default function Match(props) {


    const data = props.data
    //console.log(data['par'][0]['page'])
    //console.log(props.pageData)
    const page = getPageNumber(data['par'][0]['page'], props.pageData)
    
    const pageNumber = data['par'][0]['page']

    const text = formatMatch(data['text'])

    

    const link = "https://archive.org/details/" + props.id + "/page/" + page + "/mode/1up"

    return <div className="match">
        <div className="match-text" dangerouslySetInnerHTML={{__html: text}}></div>
        <div className="page">Page: <Link href={link}><a target='_blank'>{pageNumber}</a></Link></div>
    </div>

}

