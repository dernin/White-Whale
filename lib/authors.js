import authors from '../public/data/authors.json'
import { createBookReaderFile, isEmpty, getData } from './util'
import fs from 'fs'

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
    // tries to load JSON file of author
    try {
        let file = fs.readFileSync(
            'public/data/' + authors[author]['folder'] + '/' + author + '.json',
            'utf8'
        )

        // If the author data needs to be rebuilt (either by flagging it in searchPhrase or by checking the file's date), do so and then return the author data
        const authorFileDateBoolean = authorValidity(author, file)
        console.log(authorFileDateBoolean)
        if (authorFileDateBoolean) {
            //console.log("rebuild? " + rebuildAuthor || authorFileDateBoolean)
            //console.log("setting author data")
            const authorData = await setAuthorData(author)
            file = fs.readFileSync(
                'public/data/' + authors[author]['folder'] + '/' + author + '.json',
                'utf8'
            )
        }
        console.log('Reading file in getAuthorWorks')

        return file
    } catch(e) {
        // if the JSON file doesn't exist, build it and return it
        const authorData = await setAuthorData(author)
        console.log(e)
        console.log('CAUGHT: Reading file in getAuthorWorks')
        return fs.readFileSync(
            'public/data/' + authors[author]['folder'] + '/' + author + '.json',
            'utf8'
        )
    }
}

// Author -> JSON file
// Creates a JSON file by using the given author data to fill in the needed metadata (which may change over time)
export async function setAuthorData(author) {
    console.log("setAuthorData is running for " + author)

    // find the author in the authors.json
    const authorData = authors[author]['works']

    const dir = process.cwd() + '/public/data/' + authors[author]['folder'] + '/'

    // create author directory and searches directory, if it doesn't exit
    fs.mkdir(dir + '/searches', { recursive: true }, (err) => {
        if (err) throw err
    })

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


    // finally, write the file
    const fileName = dir + author + '.json'

    return fs.writeFileSync(fileName, fullAuthorString, 'utf8', function (err) {
        if (err) {
            console.log('An error occured when writing fullAuthorData.json')
            return console.log(err)
        }
        console.log(author + 'file is written')
    })
}

// Author(string), JSON data -> Boolean
// Checks if the filetime is older than 1 week or if the time in authors.json is greater than the author's own json file. Returns true if either condition is met.
export function authorValidity(author, data) {
    const authorData = JSON.parse(data)
    console.log('validating ' + author)
    const authorsTimeBoolean = authors[author]['time'] > authorData['time']
    console.log("authorsTimeB " + authorsTimeBoolean)
    const offset = 1000 * 60 * 60 * 24 * 4

    const fileTime = authorData['time'] + offset
    //console.log('Current time is ' + Date.now())
    //console.log('File time is ' + fileTime)
    //console.log(Date.now() <= fileTime)

    const offsetFileTimeBoolean = Date.now() > fileTime

    console.log("FileTimeB " + offsetFileTimeBoolean)

    if (authorsTimeBoolean || offsetFileTimeBoolean) {
        return true
    } else {
        return false
    }
}

