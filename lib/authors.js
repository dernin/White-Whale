import authors from '../public/data/authors.json'
import { createBookReaderFile, isEmpty, getData } from './util'
import fs from 'fs'
import { populateCollection, runQuery } from './macrometa'
require('./macrometa.js')

// json -> array
// Returns an array of authors from reading authors.json
export function getAuthors() {
    const authorList = []
    for (var key in authors) {
        authorList.push(key)
    }

    return authorList
}

// Author -> Array of works (names, OLID, hostname, item_id, doc, and path)
// Takes an author and a boolean of whether or not to rebuild the author's data
// Returns an array of works (names, OLID, hostname, item_id, doc, and path) for the given author
export async function getAuthorWorks(author) {
    try {
        // Run query and check for data
        let queryData = await runQuery(
            `FOR author IN authors FILTER author.name == '${author}' RETURN author`
        )

        // Check that data exists
        // Check if the author data is valid
        if (queryData.length != 0 || authorValid(author, queryData)) {
            return queryData
        } else {
            // If the data doesn't exist, insert it into the database
            if (queryData.length == 0) {
                return await setAuthorData(author, false)
            }
            // Otherwise, just update it
            else {
                return await setAuthorData(author)
            }
        }
    } catch {
        return
    }
}

// Author, Boolean -> Database
// Creates a document or updates a document in the database using the given author data to fill in the needed metadata (which may change over time)
export async function setAuthorData(author, update = true) {
    console.log('setAuthorData is running for ' + author)

    // find the author in the authors.json
    const authorData = authors[author]['works']
    authorData['name'] = author

    //const dir = process.cwd() + '/public/data/' + authors[author]['folder'] + '/'
    const dir = '/data/' + authors[author]['folder'] + '/'
    // create author directory and searches directory, if it doesn't exit
    /*fs.mkdir(dir + '/searches', { recursive: true }, (err) => {
        if (err) throw err
    }) */

    // for each work, query internet archive's meta page and extract needed metadata, create book reader page data file
    // archive.org/metadata/ID
    for (var key in authorData) {
        // remove time and empty lines in array
        if (
            typeof authorData[key] != 'number' &&
            !isEmpty(authorData[key]['item_id'])
        ) {
            const url =
                'https://archive.org/metadata/' + authorData[key]['item_id']

            const bookMeta = await getData(url)
            //console.log(bookMeta)

            authorData[key]['dir'] = bookMeta['dir']
            authorData[key]['server'] = bookMeta['server']

            // check for OCR to make sure the doc property is set correctly
            if (bookMeta['metadata'].hasOwnProperty('ocr')) {
                // filter for Djvu XML since those works with Djvu XML have a seperate string for their doc sometimes.
                const filteredBook = bookMeta['files'].filter((file) => {
                    return file['format'] == 'Djvu XML'
                    //return file['format'] == 'DjVu' || file['format'] == 'Djvu XML'
                })
                if (filteredBook.length != 0) {
                    authorData[key]['doc'] = filteredBook[0]['name'].slice(
                        0,
                        -9
                    )
                } else {
                    authorData[key]['doc'] = authorData[key]['item_id']
                }
            } else {
                authorData[key]['doc'] = authorData[key]['item_id']
            }

            //console.log("workData[key]")
            //console.log(workData)
            // create book reader page data file
            await createBookReaderFile(authorData, key, author)
        }
    }

    // set the current time in the author data file
    authorData['time'] = Date.now()

    // create json file with complete metadata
    const fullAuthorString = JSON.stringify(authorData)

    // finally, write the file to the database
    if (update == true) {
        const key = await runQuery(
            `FOR author IN authors FILTER author.name == ${author} RETURN author._key`
        )
        return await updateDoc('authors', key, fullAuthorString)
    } else {
        return await populateCollection('authors', fullAuthorString)
    }
}

// Author(string), JSON data -> Boolean
// Checks if the filetime is older than 1 week or if the time in authors.json is greater than the author's own json file. Returns true if either condition is met.
export function authorValid(author, data) {
    const authorData = data
    console.log('validating ' + author)
    const authorsTimeBoolean = authors[author]['time'] > authorData['time']
    console.log('authorsTimeB ' + authorsTimeBoolean)
    const offset = 1000 * 60 * 60 * 24 * 4

    const fileTime = authorData['time'] + offset
    //console.log('Current time is ' + Date.now())
    //console.log('File time is ' + fileTime)
    //console.log(Date.now() <= fileTime)

    const offsetFileTimeBoolean = Date.now() > fileTime

    console.log('FileTimeB ' + offsetFileTimeBoolean)

    if (authorsTimeBoolean || offsetFileTimeBoolean) {
        return true
    } else {
        return false
    }
}
