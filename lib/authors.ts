import authors from '../public/data/authors.json'

// json -> array
// Returns an array of authors from reading authors.json
export function getAuthors() {
    const authorList: Array<string> = []
    for (var key in authors) {
        authorList.push(key)
    }

    return authorList
}

// author (string) -> Object with data on author
// returns the IDs of texts to search
export function getAuthorData(author: string): Object {
   return authors[author]
}