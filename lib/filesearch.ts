import fs from 'fs'
import Q from 'q'
import os from 'os'

// Get directory and return all files to be searched

// Search each file asynchronously

// string -> array of strings
// takes a file path and returns an array of strings composed of all of the lines of text in the file.
// assumes utf-8 encoding
export function readFile(path: string) {
    return fs.readFileSync(path, 'utf8').split(/\r\n|\n/)
}

// !! What about a function that does match on the whole file...
// Possibly 1.5 - 2 seconds faster than findMatches when searching Melville for a high match phrase
export function findMatchesWholeFile(path, phrase): string[] {
    let file = fs.readFileSync(path, 'utf8')
    console.log(file.length)
    const rawMatches = [... file.matchAll(phrase)]
    let matches: Array<string> = []
    
    for (const match of rawMatches) {
        console.log(`Found ${match[0]} start=${match.index} end=${match.index + match[0].length}.`);
        // process each match
        // back and forward 600 characters, assuming around 60 characters a line
        const start = Math.max(0, match.index - 600)
        const end = Math.min(match.index + match[0].length + 600, file.length)
        console.log(`start: ${start} and end: ${end}`)
        const matchContext = file.slice(start, end)
        const formatMatch = buildFullMatchWholeFile()
        if (formatMatch !== "")
        {
            matches.push(formatMatch)
        }
        
    }
    return matches
}

// need new functions that take blobs of text instead of array

// Takes in an array of strings and a regex expression to search for and returns an array of matches
export function findMatches(lines: Array<string>, phrase: string): string[]
{
    // if either the search is empty or the text is empty return immediately
    if (lines.length === 0 || phrase.length === 0) return [""]

    let matches: Array<string> = []
    
    for(let i: number = 0; i < lines.length; i++)
    {
        const match = findRegExpMatch(phrase, lines[i])
        //console.log(match)

        // if there is a match we begin searching for the full string
        if (match !== -1) 
        {
            //console.log('match: ', match)
            const fullMatch: string = buildFullMatch(phrase, match, lines, i)
            matches.push(fullMatch) 
        }
    }
    return matches
}

// returns the index of the first match in the given line
export function findRegExpMatch(phrase: string, line: string)
{
    let searchPhrase: RegExp = new RegExp(phrase, 'i')
    //console.log(line.search(searchPhrase))
    return line.search(searchPhrase)
}

// takes the word or phrase match, and finds the preceding two periods and succeeding two periods and returns all the text between these periods
            // If the match is at the start of the line, ie index 0 we look at the line before for the second period before the match, and continue until we find it
            // we must ignore periods that match this format: x.x. 
            // we also must ignore blank lines and lines that are titles, which would mean they are all caps and short

            // then we do the same thing going forwards

            // Finally we concatinate the lines together into one line, creating a match, and push it to matches.
export function buildFullMatch(phrase: string, match: number, lines: Array<string>, startLineIndex: number)
{
    const backStarter = Math.max(0, startLineIndex - 10)

    // remove period and white space before the first part of the match.
    const backtwo: string = findNextTwoSentences(lines.slice(backStarter, startLineIndex + 1), startLineIndex - backStarter, match, 'back').replace(/^[\!\?\.]\s*\n*/, '')
    const forwardtwo: string = findNextTwoSentences(lines.slice(0, startLineIndex + 10), startLineIndex, match + phrase.length, 'forward')

    return backtwo + '{{{' + lines[startLineIndex].slice(match, match + phrase.length) + '}}}' + forwardtwo

}

// traverses through matches to find either the preceeding or succeeding two periods and the sentences between them.
// returns string from surrounding sentences, up to but not including match
export function findNextTwoSentences(lines: Array<string>, startLineIndex: number, startIndex: number, direction: string)
{
    //console.log('lines: ', lines)
    //console.log('line 0 length', lines[0].length)
    if(lines.length <= 1 && lines[0].length <= 0)
    {
        return ''
    }

    let currentLineIndex: number = startLineIndex
    let currentLine: string

    let currentIndex: number = startIndex

    let periodCount: number = 0
    let firstPeriodIndex: number
    let firstPeriodLine: number

    let d: number = (direction === 'back') ? -1 : 1

    //console.log('lines length: ', lines.length)
    // if we haven't found the two periods yet, keep searching

        // check we are in bounds in lines and within the line
        while(currentLineIndex >= 0 && currentLineIndex < lines.length)
        {
            currentLine = lines[currentLineIndex]
            //console.log('current line index: ', currentLineIndex)
            //console.log('current line: ', lines[currentLineIndex])
            //console.log('period count: ', periodCount)

            if (currentLineIndex === 0)
            {
                console.log('at 0 index', currentIndex)
                console.log(lines[currentLineIndex].length)
            }

            while(currentIndex >= 0 && currentIndex <= lines[currentLineIndex].length)
            {
                // check for periods, increment if needed
                //console.log('currentIndex', currentIndex)
                let periodCheck = filterPeriods(currentIndex, currentLine, d)
                if (periodCheck === true)
                {
                    periodCount++;
                    
                    if (periodCount === 2)
                    {
                        if (d === 1) currentIndex++ 
                        break
                    }
                    currentIndex += d
                    
                    //console.log('period count: ', periodCount)
                    if (periodCount === 1)
                    {
                        firstPeriodIndex = currentIndex
                        firstPeriodLine = currentLineIndex
                    }

                    
                }
                else if(typeof periodCheck === 'number')
                {
                    currentIndex = periodCheck
                }
                else
                {
                    currentIndex += d
                }
            }
            
            if (periodCount === 2) 
            {
                //console.log('current index at break ', currentIndex)
                //console.log('period count: ', periodCount)
                break
            }

            currentLineIndex += d
            // reset index
            if (currentLineIndex >= 0)
            {
                d === 1 ? currentIndex = 0 : currentIndex = lines[currentLineIndex].length
            }

        }
        // if all lines have been traversed and there was only one period, return just the one sentence
        if (periodCount === 1)
        {
            return buildMatchString(lines, firstPeriodLine, firstPeriodIndex, startLineIndex, startIndex, d)
        }
        // if all lines have been traversed and there are no periods return the first two lines before the given index.
        else if (periodCount === 0)
        {
            let thisIndex
            let thisLineIndex 
            
            if (d === -1)
            {
                thisLineIndex = Math.max(0, (startLineIndex + (2 * d)))
                thisIndex = 0
            }
            else 
            {
                thisLineIndex = Math.min(lines.length - 1, (startLineIndex + (2 * d)))
                thisIndex = lines[thisLineIndex].length
            }
            return buildMatchString(lines, thisLineIndex, thisIndex, startLineIndex, startIndex, d)
        }
    // return the string after the periods have been found

    return buildMatchString(lines, currentLineIndex, currentIndex, startLineIndex, startIndex, d)
    
}

// checks a position in the line for if it is a period or exclamation point or question mark. If it is, it checks that is actually the start of a sentence.
// returns true if it is the start of a sentence, false if there is no period, or the position of the start of the extraneous string if it exists
export function filterPeriods(currentIndex: number, currentLine: string, d: number): boolean | number
{
    let currentChar: string = currentLine[currentIndex]
    let subString: string
    const punctuation = ['.', '?', '!']
    if (d === 1)
    {   
        subString = currentLine.slice(currentIndex - 1)
    }
    else
    {
        subString = currentLine.slice(0, currentIndex + 3)
    }
    
    // check if the current character is a punctuation.
    if (punctuation.includes(currentChar))
    {
        
        // searches for something in the line with the format x.x. which would not be the end of a sentence.
        if(currentChar === '.')
        {
            let checkDots = subString.match(/(.\.){2,}/i)
        
            if (checkDots !== null)
            {
                return currentIndex + ((checkDots[0].length - 1) * d)
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

// builds and returns a string based on the start and end indexes of the lines array
// !!! if direction is backwards, need to filter out the period and space at beginning of the string. (can't assume, have to replace with regex)
export function buildMatchString(lines: Array<string>, currentLineIndex: number, currentIndex: number, startLineIndex: number, startIndex: number, d: number): string
{
    let endIndex: number
    let endLineIndex: number

    let startSliceIndex: number
    let startSliceLineIndex: number

    let builtString = ''

    //console.log('direction is: ', d)
    console.log(lines)
    //console.log('currentLineIndex: ', currentLineIndex)
    //console.log('startLineIndex: ', startLineIndex)
    //console.log('currentIndex: ', currentIndex)
    

    if (d === -1)
    {
        startSliceIndex = currentIndex
        startSliceLineIndex = Math.max(0, currentLineIndex)

        endIndex = startIndex
        endLineIndex = startLineIndex
    }
    else
    {
        startSliceIndex = startIndex
        startSliceLineIndex = Math.min(startLineIndex, lines.length - 1)

        endIndex = currentIndex
        endLineIndex = Math.min(currentLineIndex, lines.length - 1)
    }

    //console.log('buildMatchString startSliceLineIndex: ', startSliceLineIndex)

    let currentSliceLineIndex: number = startSliceLineIndex

    if(currentSliceLineIndex === endLineIndex)
    {
        if(lines[endLineIndex].length > 0)
        {
            return lines[endLineIndex].slice(startSliceIndex, endIndex)
        }
        
        return ''
        
    }

    //console.log('startSliceLineIndex: ', startSliceLineIndex)
    //console.log('startSliceIndex: ', startSliceIndex)
    //console.log('endLineIndex: ', endLineIndex)
    let firstBuiltLine = lines[startSliceLineIndex]
    firstBuiltLine = firstBuiltLine.slice(startSliceIndex).replace(/-\s$/, '')
    //console.log('firstBuiltLine: ' + '"' + firstBuiltLine + '"')
    builtString += firstBuiltLine 

    currentSliceLineIndex++
    //console.log('currentSliceLineIndex: ' + currentSliceLineIndex)
    
    while(currentSliceLineIndex < endLineIndex)
    {
        if (lines[currentSliceLineIndex] === "")
        {
            builtString += "\n"
        }
        builtString += lines[currentSliceLineIndex].replace(/-\s$/, '')
        //console.log('current build: ', builtString)
        currentSliceLineIndex++
    }

    let endBuiltLine = lines[currentSliceLineIndex]
    
    endBuiltLine = endBuiltLine.slice(0, endIndex).replace(/-\s$/, '')
    //console.log(endIndex)
    //console.log(endBuiltLine)

    builtString += endBuiltLine 
    //console.log('builtString: ' + '"' + builtString + '"')


    return builtString
}
    // go line by line through file
    // find matches using String.match()
    // Work backwards to the second period before the match, get that position.
    // Then work forwards to ths second period after the match, get that position.
    // splice a new string from those positions and insert it into a list of matches

    // return all matches

// return object of items, with all matches
