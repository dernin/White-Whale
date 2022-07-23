import fs from 'fs'

// Get directory and return all files to be searched

// Search each file asynchronously

// string -> array of strings
// takes a file path and returns an array of strings composed of all of the lines of text in the file.
// assumes utf-8 encoding
export function readFile(path: string) {
    return fs.readFileSync(path, 'utf8')
    //.split(/\r\n|\n/)
}

// !! What about a function that does match on the whole file...
// Possibly 1.5 - 2 seconds faster than findMatches when searching Melville for a high match phrase
export function findMatchesWholeFile(path: string, phrase: string): string[] {

    if (phrase === '') return ['']
    //console.log(path)
    let file = fs.readFileSync(path, 'utf8')

    if (file === '' || undefined) return ['']

    phrase = '\\b' + phrase + '\\b'
    console.log(phrase)
    const regPhrase: RegExp = new RegExp(phrase , 'gi')
    console.log(regPhrase)
    const rawMatches = [... file.matchAll(regPhrase)]
    let matches: Array<string> = []
    
    for (const match of rawMatches) {
        //console.log(`Found ${match[0]} start=${match.index} end=${match.index + match[0].length}.`);
        // process each match
        // back and forward 600 characters, assuming around 60 characters a line
        //const start = Math.max(0, match.index - 600)
        //const end = Math.min(match.index + match[0].length + 600, file.length)
        //console.log(`start: ${start} and end: ${end}`)
        //const matchContext = file.slice(start, end)
        const formatMatch = buildFullMatchWholeFile(file, match)
        if (formatMatch !== "")
        {
            matches.push(formatMatch)
        }
        
    }
    return matches
}

// creates a 2-3 sentence match from surrounding text of given match
export function buildFullMatchWholeFile(file: string, match: RegExpMatchArray): string
{
    const backtwo: string = findNextTwoSentencesWholeFile(file, match, -1)
    const forwardtwo: string = findNextTwoSentencesWholeFile(file, match, 1)

    const fullMatch = backtwo + '<b>' + match[0] + '</b>' + forwardtwo

    return fullMatch.replace(/\n{3,}/gi, '\n\n')
}

// finds the next two periods before or after the given match and returns a substring of the text between the match and the period
// travels at max 600 characters
// direction is a number; -1 is back; 1 is forward.
export function findNextTwoSentencesWholeFile(file: string, match: RegExpMatchArray, direction: number): string
{
    let currentIndex: number
    if (direction === 1) {
        currentIndex = match.index + match[0].length
    }
    else 
    {
        currentIndex = Math.max(0, match.index - 1)
    }
    //console.log('direction: ' + direction)
    //console.log('start index: ', currentIndex)

    let periodCount: number = 0
    let firstPeriodIndex: number

    let searchDistance: number = 0
    const maxSearchDistance: number = 600

    let addTrail: boolean = false

    // if we haven't found the two periods yet, keep searching

        // check we are in bounds in lines and within the line
        while(searchDistance < maxSearchDistance && currentIndex > 0 && currentIndex < file.length)
        {
            searchDistance++
            let periodCheck = filterPeriodsWholeFile(currentIndex, file, direction)
            if (periodCheck === true)
            {
                periodCount++
                
                // stop incrementing if two periods have been found
                if (periodCount === 2)
                {
                    if (direction === 1) currentIndex++ 
                    break
                }

                // increment current index
                currentIndex += direction
                
                // get the index of the first period in case there turns out to only be one? !!! Do we need this?
                if (periodCount === 1)
                {
                    firstPeriodIndex = currentIndex
                }
            }
            else
            {
                currentIndex += direction
            }
            //console.log('current line index: ', currentLineIndex)
            //console.log('current line: ', lines[currentLineIndex])
            //console.log('period count: ', periodCount)
        }

        // if two periods were found, the index will be where the second period was found. 
        if (periodCount === 2)
        {
            return buildMatchStringWholeFile(file, match, currentIndex, direction, addTrail)
        } 

        // Otherwise it will be after the max characters have been traversed and '...' will be appended to the beginning or end of the string.
        if (currentIndex > 0 && currentIndex < file.length)
        {
            addTrail = true
        }
        //currentIndex = Math.max(0, currentIndex)
        //console.log('endIndex: ', currentIndex)
        return buildMatchStringWholeFile(file, match, currentIndex, direction, addTrail)
        
}

// creates a substring of the given string, indexes, and direction. Adds a trail of three dots to the beginning or end depending on need.
export function buildMatchStringWholeFile(file: string, match: RegExpMatchArray, currentIndex: number, direction: number, addTrail: boolean): string
{
    //console.log(match)
    let builtString: string = ''

    if (direction === 1)
    {
        builtString += file.slice(match.index + match[0].length, currentIndex + 1).replace(/\s+$/, '')
        if (addTrail) builtString += ' ...'
    }

    else
    {
        builtString += file.slice(currentIndex, match.index).replace(/^[\!\?\.]\s*\n*/, '')
        if (addTrail) builtString = '... ' + builtString
        
    }

    return builtString
}

// checks a character to see if it is punctuation. If it is the end of a sentence, it returns true. Otherwise is returns false.
export function filterPeriodsWholeFile(currentIndex: number, file: string, direction: number): boolean | number
{
    let currentChar: string = file[currentIndex]
    let subString: string
    const punctuation = ['.', '?', '!']
    
    // check if the current character is a punctuation.
    if (punctuation.includes(currentChar))
    {
        // searches for something in the line with the format x.x. which would not be the end of a sentence.
        if(currentChar === '.')
        {
            subString = file.slice(currentIndex - 3, currentIndex + 3)
            
            let checkDots = subString.match(/(.\.){2,}/i)
        
            if (checkDots !== null)
            {
                return false
            }
        }

        // otherwise it is the end of a sentence.
        return true

    }
    else 
    {
        return false
    }
}
