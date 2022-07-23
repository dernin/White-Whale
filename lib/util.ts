import authors from '../public/data/authors.json'
import json5 from 'json5'

// string -> Boolean
// returns if a string is empty or not
export function isEmpty(str: string): boolean {
    return !str || str.length === 0
}

// String -> String
// removes html tags from string
export function strip(html: string): string {
    let doc = new DOMParser().parseFromString(html, 'text/html')
    return doc.body.textContent || ''
}

// URL -> JSON
// takes a URL and uses fetch to return JSON data
export async function getData(url) {
    try {
        const data = await fetch(url, { mode: 'cors'})
        const text = await data.text()
        //console.log('text: ', text)
        let jsonData = await json5.parse(text)
        return jsonData
        // return data.json()
    } catch(e) {
        console.log(e)
        return getData(url)
    }
}

// item_id (string), author (string) -> Name (string)
// takes an item_id and returns the full title of the book
export function getTitle(id: string, author: string): string {
    const works = authors[author]['works']

    for (var key in works) {
        if (works[key]['item_id'] === id) {
            return key
        }
    }
}

// string (author) -> string (author folder)
// gets the folder for an author
export function authorFolder(author: string): string {
    return authors[author]['folder']
}

// String -> String
// Removes all punctation from the beginning of the string except for { which is handled by formatMatch
export function removePunctuationFromStart(match: string): string {
    const regex = /^[^a-zA-Z0-9{]*/

    return match.replace(regex, '')
}

// String -> String
// Removes spaces from string and replaces them with underscores
export function replaceSpace(string: string): string {
    const regex = /[" "]/

    return string.replace(regex, '_')
}

