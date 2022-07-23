const fs = require('fs')
import path from 'path'
import {
    isEmpty,
    authorFolder,
} from './util'
import { getAuthorData } from './authors'
import { populateCollection, runQuery } from './macrometa'
import { findMatchesWholeFile } from './filesearch'

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


// String, Author, JSON author works data -> JSON match file
// Creates a JSON file of all the places in the given author's works that the given string appears and places it in database

export async function cacheSearch(phrase: string, author: string): Promise<string | null>{
    console.log('caching search for ' + phrase + ' on ' + author)
    populateCollection('caching_new', {name: author, search: phrase})

    let allAuthorWorks = getAuthorData(author)
    allAuthorWorks = allAuthorWorks['works']

    // format phrase to replace spaces 
    const formattedPhrase = encodeURIComponent(phrase)

    // perform a search on all of the works with the phrase and create an array of all matches
    const allMatches: Array<Object> = []

    for (var key in allAuthorWorks) {
        if (!isEmpty(allAuthorWorks[key]['item_id'])) {
            console.log('Key is ' + key)

            //const dir = path.resolve('./public', 'data')
            const filename = process.cwd() + '/data/' + authorFolder(author) + '/' + allAuthorWorks[key]['item_id'] + '_djvu.txt'

            const matches = findMatchesWholeFile(filename, phrase)

           
            // Compile results:
            // ia is book id
            // q is search phrase
            // matches are all matches from the book
            const finalResults = {
                ia: allAuthorWorks[key]['item_id'],
                q: phrase,
                matches: matches,
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
        populateCollection('searches_new', fullSearchString)
        return fullSearchString
        
    } else {
        return null
    }
}


