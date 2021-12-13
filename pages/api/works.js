import { searchPhrase } from '../../lib/search'
import { runQuery } from '../../lib/macrometa'

export default async function handler(req, res) {
    const query = req.query
    const author = query['author']

    const results = await runQuery(
        `FOR file IN works FILTER file.author == '${author}' RETURN file`
    )

        // if no results, send back false
        if (results.length == 0) {
            return res.status(102).json({error: 'caching'})
        } else {
            return res.status(200).json(results)
        }

}
