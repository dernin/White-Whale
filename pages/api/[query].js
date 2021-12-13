import { searchPhrase } from '../../lib/search'
import { populateCollection, runQuery } from '../../lib/macrometa'

export default async function handler(req, res) {
    const query = req.query
    const urlParams = new URLSearchParams(query['query'])
    const author = urlParams.get('author')
    let phrase = urlParams.get('phrase')
    phrase = phrase.toLowerCase()
    //const test = urlParams.get('test')

    

    const results = await runQuery(
        `FOR file IN searches FILTER file.name == '${author}_search_${phrase}' RETURN file`
    )

    // if no results, send back false
    if (results.length == 0) {

        // to keep it from running searchPhrase more than once
        const checkCache = await runQuery(`FOR file IN caching FILTER file.name == '${author}' AND file.search == '${phrase}' RETURN file `)
        if (checkCache.length == 0) {
            searchPhrase(phrase, author)
            populateCollection('caching', {name: author, search: phrase})
        }
        
        return res.status(299).json({error: 'caching'})
    } else {
        return res.status(200).json(results[0])
    }
}
