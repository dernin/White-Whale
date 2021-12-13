import authors from '../public/data/authors.json'
const fs = require('fs')
import {
    resolveAfter1,
    isEmpty,
    getData,
    createBookReaderFile,
    authorFolder,
} from './util'
import { getAuthorWorks, setAuthorData } from './authors'
import { populateCollection, runQuery } from './macrometa'

/* Data definitions 

// Match (Array)
// An array of data on a given match for a search string
// Includes
// - Title of Book of match
// - Page number where match was found
// - Paragraph of text containing matching text
// Ex: Title: Moby Dick, 
// Page: 9, 
// Text: "{{{Call me}}} Ishmael. Some years ago\u2014never mind how long precisely\u2014having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen, and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get Such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people\u2019s hats off\u2014then, I account it high time to get to sea as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword ; I quietly take to the ship. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the ocean with me."

Work
An array of data on a given work, ie book
Includes:
title, OLID, hostname, item_id, doc, and path
Ex: Title: Moby Dick
OLID: OL102749W
hostname: ia600800.us.archive.org
item_id: mobydickorwhitew00melv_1
doc: mobydickorwhitew00melv_1
path: /24/items/mobydickorwhitew00melv_1

*/

// String, Author -> JSON match data
// Caches the search and returns it
export async function searchPhrase(phrase, author) {
    const searchPath = author + '_search_' + phrase
    let queryCache = await runQuery(`FOR file IN searches FILTER file.name == '${searchPath}' RETURN file`)

    // if the search hasn't been cached before, do so, or if the file is out of date, recache it
    const cacheIsValid = await cacheValid(author, queryCache)

    if(!cacheIsValid) {
        console.log('Cache is not valid, building cache')

        // get an array of all of the author's works with their names, OLID, hostname, item_id, doc, and path
        // rebuilds the list if needed, otherwise just grab the one that exists
        const allAuthorWorks = await getAuthorWorks(author)

        // caches search
        return await cacheSearch(phrase, author, allAuthorWorks)
        //await resolveAfter1()

        //return await JSON.parse(searchData)
    } else {
        return 
    }

}

// String (Author), JSON search data  -> Boolean
// returns true if cache is valid 
// returns false if the cache time of a search is older than the authors.json file time or it doesn't exist
// this is because any time a work changes or a new work is added, the authors.json file time will be udpated and all previous caches will become invalid
export async function cacheValid(author, data) {
    
    if (data.length != 0) {
        // check time in cache vs the authors.json file time
        const cacheBoolean = data[data.length - 1]['time'] > authors[author]['time']
        console.log("inside cacheValidity it is " + cacheBoolean )

        return cacheBoolean
    } else {
        return false
    }
}

// String, Author, JSON author works data -> JSON match file
// Creates a JSON file of all the places in the given author's works that the given string appears

export async function cacheSearch(phrase, author, allAuthorWorks) {
    console.log('caching search for ' + phrase + ' on ' + author)
    allAuthorWorks = allAuthorWorks[0]
    // format phrase to replace spaces 

    const formattedPhrase = encodeURIComponent(phrase)

    // perform a search on all of the works with the phrase and create an array of all matches
    const allMatches = []

    for (var key in allAuthorWorks) {
        if (
            typeof allAuthorWorks[key] != 'number' &&
            !isEmpty(allAuthorWorks[key]['item_id'])
        ) {
            console.log('Key is ' + key)

            const url =
                'https://' +
                allAuthorWorks[key]['server'] +
                '/fulltext/inside.php?item_id=' +
                allAuthorWorks[key]['item_id'] +
                '&doc=' +
                allAuthorWorks[key]['doc'] +
                '&path=' +
                allAuthorWorks[key]['dir'] +
                '&q=%22' +
                formattedPhrase +
                '%22'

            const bookMeta = await getData(url)

            // filter out matches that aren't just titles and headers and other edge cases
            const filteredMatches = bookMeta['matches'].filter((result) => {
                // check that the text of the match is greater than the phrase's length + 13 characters to ensure it isn't just a header or title
                const lengthTest = result['text'].length > phrase.length + 13

                // check that the text doesn't contain 'Author of' {phrase}
                const authorOfPhrase = 'Author of {{{' + phrase
                const authorTest =
                    authorOfPhrase.toLowerCase() !=
                    result['text']
                        .toLowerCase()
                        .replace(/\"/g, '')
                        .slice(0, 13 + phrase.length)

                // check for 'ebook' to filter out ebook
                const ebookTest = !result['text']
                    .toLowerCase()
                    .includes('ebook')

                return lengthTest && authorTest && ebookTest
            })

            // Compile results:
            // ia is book id
            // q is search phrase
            // matches are all matches from the book
            const finalResults = {
                ia: bookMeta['ia'],
                q: bookMeta['q'],
                matches: filteredMatches,
            }

            allMatches.push(finalResults)
        }
    }

    // return null if there are no matches
    // otherwise write the matches to a json string
    if (allMatches.length > 0) {
        // Set time field to get the time the search is cached
        const cacheTime = Date.now()
        const name = author + '_search_' + phrase
        const searchObject = {allMatches, name: name, time: cacheTime}
        const fullSearchString = JSON.stringify(searchObject)
        
        // push results to database
        populateCollection('searches', fullSearchString)
        return fullSearchString
        
    } else {
        return null
    }
}

// Array (AuthorData) -> JSON files
// creates book reader page data files for each work of an author's
export async function createBookReaderFiles(authorData, author) {
    for (var key in authorData) {
        if (
            typeof authorData[key] != 'number' &&
            !isEmpty(authorData[key]['item_id'])
        ) {
            //console.log(authorData[key])
            await createBookReaderFile(authorData[key]['item_id'], author)
        }
    }
}
