import { searchPhrase } from "../../lib/search"

export default async function handler(req, res) {
    const query = req.query
    const urlParams = new URLSearchParams(query['query'])
    const author = urlParams.get('author')
    const phrase = urlParams.get('phrase')

    const results = await searchPhrase(phrase, author)
    //console.log(results)

    return res.json(results)
}