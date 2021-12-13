import authors from '../public/data/authors.json'
import fs from 'fs'
import { populateCollection } from './macrometa'
import jsonic from 'jsonic'
import json5 from 'json5'

// string -> Boolean
// returns if a string is empty or not
export function isEmpty(str) {
    return !str || str.length === 0
}

// returns a 100 milisecond timeout
export function resolveAfter1() {
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve('slow')
        }, 100)
    })
}

// returns a 10 second timeout
export function resolveAfter10() {
    return new Promise((resolve) => {
        setTimeout(function () {
            resolve('slow')
        }, 10000)
    })
}

// String -> String
// removes html tags from string
export function strip(html) {
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
export function getTitle(id, author) {
    const works = authors[author]['works']

    for (var key in works) {
        if (works[key]['item_id'] === id) {
            return key
        }
    }
}

// item_id, author -> Work JSON data
// returns the meta data for a given work
export async function getWork(id, author) {
    const authorFolder = authors[author]['folder']
    const authorFile = fs.readFileSync(
        'public/data/' + authorFolder + '/' + author + '.json'
    )
    const authorData = JSON.parse(authorFile)

    // search through authors works for matching id
    for (var key in authorData) {
        if (authorData[key]['item_id'] == id) {
            return authorData[key]
        }
    }
}

// works data, key, author -> JSON File
// Pulls and creates the JSON bookreader file for a work with the authors works JSON data, the key for the work in question and the author
// URL format: https://ia600304.us.archive.org/BookReader/BookReaderJSIA.php?id=typee28656gut&itemPath=/26/items/typee28656gut&server=ia600304.us.archive.org&format=json&subPrefix=28656-pdf
export async function createBookReaderFile(works, key, author) {
    // const authorFolder = authors[author]['folder']
    const work = works[key]
    const id = work['item_id']

    //const path = 'public/data/' + authorFolder + '/' + id + '.json'

    //fetch data
    const url =
        'https://' +
        work['server'] +
        '/BookReader/BookReaderJSIA.php?id=' +
        id +
        '&itemPath=' +
        work['dir'] +
        '&server=' +
        work['server'] +
        '&format=json&subPrefix=' +
        work['doc']

    const jsondata = await getData(url)

    // get only the data we actually need
    const data = jsondata['data']['brOptions']['data']

    // create an empty JSON object to write into
    let fileData = {}

    // create a counter we will iterate over and modify based on the form of the data
    let counter = 0

    // iterate over the data creating a more managable JSON object
    for (var x = 0; x < data.length; x++) {
        fileData = pullPageSpread(fileData, data[x], counter)

        // since the data is written in left-right page spreads we must account for times when there is only 1 page in a spread, in which case we must increment by 1
        if (data[x].length < 2) {
            counter++
        } else {
            counter += 2
        }
    }
    fileData['author'] = author
    fileData['ia'] = id

    // stringify the new JSON object
    fileData = JSON.stringify(fileData)

    // write the object to the database
    return populateCollection('works', fileData)
}

// Array, Array, Counter-> Array
// creates a new spread where the page's index and page number are recorded from the BookReader format
export function pullPageSpread(fileData, array, counter) {
    // write the left page
    const left = pullPage(array[0], counter)

    // have to take the leaf number because sometimes leaf numbers skip
    fileData[array[0]['leafNum']] = left

    // if there is a right page, also write the right page
    if (array[1] != null) {
        const right = pullPage(array[1], counter + 1)
        fileData[array[1]['leafNum']] = right
    }

    // return the complete spread
    return fileData
}

// array, counter, start -> array
// pulls the BookReader data for a given page
export function pullPage(array, counter) {
    let page

    // if there is a pageNum assigned to the page, use it
    if (array['pageNum'] != null) {
        page = array['pageNum']
    }
    // first page is always an empty string
    else if (counter == 0) {
        page = ''
    }
    // otherwise it is an n page
    else {
        page = 'n' + counter.toString()
    }

    return page
}

// string (author) -> string (author folder)
// gets the folder for an author
export function authorFolder(author) {
    return authors[author]['folder']
}

// Int (page number), JSON page data -> string (page number)
// returns page number that can be used in constructing archive.org URL
export function getPageNumber(page, pageData) {
    try {
        let pageString = pageData[page].toString()
        return pageString
    } catch {
        console.log(pageData)
        console.log(page - 1)
    }
}

// String -> String
// Replace {{{}}} with <b></b> in string and remove punction from the beginning of the string

export function formatMatch(match) {
    const regex1 = /{{{/g
    const regex2 = /}}}/g

    let newMatch

    newMatch = removePunctuationFromStart(match)
    newMatch = newMatch.replace(regex1, '<b>')
    newMatch = newMatch.replace(regex2, '</b>')

    return newMatch
}

// String -> String
// Removes all punctation from the beginning of the string except for { which is handled by formatMatch
export function removePunctuationFromStart(match) {
    const regex = /^[^a-zA-Z0-9{]*/

    return match.replace(regex, '')
}

// String -> String
// Removes spaces from string and replaces them with underscores
export function replaceSpace(string) {
    const regex = /[" "]/

    return string.replace(regex, '_')
}

