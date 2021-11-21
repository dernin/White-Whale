import { formatMatch, getPageNumber, pullPage, pullPageData, pullPageSpread, strip } from '../lib/util'
import fs from 'fs'

/* Tests for pullPageData, pullPage, and pullPageSpread */

const pageData = [
    {
        width: 1749,
        height: 2481,
        uri: 'https://ia600304.us.archive.org/BookReader/BookReaderImages.php?zip=/26/items/typee28656gut/28656-pdf_jp2.zip&file=28656-pdf_jp2/28656-pdf_0001.jp2&id=typee28656gut',
        leafNum: 1,
        uri_2: {
            link: 'https://archive.org/download/typee28656gut/28656-pdf_jp2.zip/28656-pdf_jp2%2F28656-pdf_0001.jp2',
            base_params: 'ext=jpg',
        },
        pageType: 'Normal',
        pageSide: 'L',
    },
    {
        width: 1600,
        height: 2638,
        uri: 'https://ia800300.us.archive.org/BookReader/BookReaderImages.php?zip=/4/items/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip&file=mobydickorwhale01melv_jp2/mobydickorwhale01melv_0086.jp2&id=mobydickorwhale01melv',
        leafNum: 86,
        uri_2: {
            link: 'https://archive.org/download/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip/mobydickorwhale01melv_jp2%2Fmobydickorwhale01melv_0086.jp2',
            base_params: 'ext=jpg',
        },
        pageNum: 54,
        pageType: 'Normal',
        ppi: 400,
        pageSide: 'L',
    },
]

const singlePage = [
        {
            width: 1749,
            height: 2481,
            uri: 'https://ia600304.us.archive.org/BookReader/BookReaderImages.php?zip=/26/items/typee28656gut/28656-pdf_jp2.zip&file=28656-pdf_jp2/28656-pdf_0001.jp2&id=typee28656gut',
            leafNum: 1,
            uri_2: {
                link: 'https://archive.org/download/typee28656gut/28656-pdf_jp2.zip/28656-pdf_jp2%2F28656-pdf_0001.jp2',
                base_params: 'ext=jpg',
            },
            pageType: 'Normal',
            pageSide: 'L',
        },
]

const multiPage = [
        {
            width: 1749,
            height: 2481,
            uri: 'https://ia600304.us.archive.org/BookReader/BookReaderImages.php?zip=/26/items/typee28656gut/28656-pdf_jp2.zip&file=28656-pdf_jp2/28656-pdf_0001.jp2&id=typee28656gut',
            leafNum: 1,
            uri_2: {
                link: 'https://archive.org/download/typee28656gut/28656-pdf_jp2.zip/28656-pdf_jp2%2F28656-pdf_0001.jp2',
                base_params: 'ext=jpg',
            },
            pageType: 'Normal',
            pageSide: 'L',
        },
        {
            width: 1749,
            height: 2481,
            uri: 'https://ia600304.us.archive.org/BookReader/BookReaderImages.php?zip=/26/items/typee28656gut/28656-pdf_jp2.zip&file=28656-pdf_jp2/28656-pdf_0001.jp2&id=typee28656gut',
            leafNum: 2,
            uri_2: {
                link: 'https://archive.org/download/typee28656gut/28656-pdf_jp2.zip/28656-pdf_jp2%2F28656-pdf_0001.jp2',
                base_params: 'ext=jpg',
            },
            pageType: 'Normal',
            pageSide: 'L',
        },
]

const sampleBookReaderData = [
    [
        {
            width: 1768,
            height: 2840,
            uri: 'https://ia800300.us.archive.org/BookReader/BookReaderImages.php?zip=/4/items/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip&file=mobydickorwhale01melv_jp2/mobydickorwhale01melv_0001.jp2&id=mobydickorwhale01melv',
            leafNum: 1,
            uri_2: {
                link: 'https://archive.org/download/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip/mobydickorwhale01melv_jp2%2Fmobydickorwhale01melv_0001.jp2',
                base_params: 'ext=jpg',
            },
            pageType: 'Cover',
            ppi: 400,
            pageSide: 'R',
        },
    ],
    [
        {
            width: 1600,
            height: 2638,
            uri: 'https://ia800300.us.archive.org/BookReader/BookReaderImages.php?zip=/4/items/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip&file=mobydickorwhale01melv_jp2/mobydickorwhale01melv_0002.jp2&id=mobydickorwhale01melv',
            leafNum: 2,
            uri_2: {
                link: 'https://archive.org/download/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip/mobydickorwhale01melv_jp2%2Fmobydickorwhale01melv_0002.jp2',
                base_params: 'ext=jpg',
            },
            pageType: 'Normal',
            ppi: 400,
            pageSide: 'L',
        },
        {
            width: 1600,
            height: 2638,
            uri: 'https://ia800300.us.archive.org/BookReader/BookReaderImages.php?zip=/4/items/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip&file=mobydickorwhale01melv_jp2/mobydickorwhale01melv_0003.jp2&id=mobydickorwhale01melv',
            leafNum: 3,
            uri_2: {
                link: 'https://archive.org/download/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip/mobydickorwhale01melv_jp2%2Fmobydickorwhale01melv_0003.jp2',
                base_params: 'ext=jpg',
            },
            pageType: 'Normal',
            ppi: 400,
            pageSide: 'R',
        },
    ],
    [
        {
            width: 1600,
            height: 2638,
            uri: 'https://ia800300.us.archive.org/BookReader/BookReaderImages.php?zip=/4/items/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip&file=mobydickorwhale01melv_jp2/mobydickorwhale01melv_0004.jp2&id=mobydickorwhale01melv',
            leafNum: 4,
            uri_2: {
                link: 'https://archive.org/download/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip/mobydickorwhale01melv_jp2%2Fmobydickorwhale01melv_0004.jp2',
                base_params: 'ext=jpg',
            },
            pageType: 'Normal',
            ppi: 400,
            pageSide: 'L',
        },
        {
            width: 1600,
            height: 2638,
            uri: 'https://ia800300.us.archive.org/BookReader/BookReaderImages.php?zip=/4/items/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip&file=mobydickorwhale01melv_jp2/mobydickorwhale01melv_0005.jp2&id=mobydickorwhale01melv',
            leafNum: 5,
            uri_2: {
                link: 'https://archive.org/download/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip/mobydickorwhale01melv_jp2%2Fmobydickorwhale01melv_0005.jp2',
                base_params: 'ext=jpg',
            },
            pageType: 'Normal',
            ppi: 400,
            pageSide: 'R',
        },
    ],
    [
        {
            width: 1600,
            height: 2638,
            uri: 'https://ia800300.us.archive.org/BookReader/BookReaderImages.php?zip=/4/items/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip&file=mobydickorwhale01melv_jp2/mobydickorwhale01melv_0006.jp2&id=mobydickorwhale01melv',
            leafNum: 6,
            uri_2: {
                link: 'https://archive.org/download/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip/mobydickorwhale01melv_jp2%2Fmobydickorwhale01melv_0006.jp2',
                base_params: 'ext=jpg',
            },
            pageType: 'Normal',
            ppi: 400,
            pageSide: 'L',
        },
        {
            width: 1600,
            height: 2638,
            uri: 'https://ia800300.us.archive.org/BookReader/BookReaderImages.php?zip=/4/items/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip&file=mobydickorwhale01melv_jp2/mobydickorwhale01melv_0007.jp2&id=mobydickorwhale01melv',
            leafNum: 7,
            uri_2: {
                link: 'https://archive.org/download/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip/mobydickorwhale01melv_jp2%2Fmobydickorwhale01melv_0007.jp2',
                base_params: 'ext=jpg',
            },
            pageType: 'Normal',
            ppi: 400,
            pageSide: 'R',
        },
    ],
    [
        {
            width: 1600,
            height: 2638,
            uri: 'https://ia800300.us.archive.org/BookReader/BookReaderImages.php?zip=/4/items/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip&file=mobydickorwhale01melv_jp2/mobydickorwhale01melv_0008.jp2&id=mobydickorwhale01melv',
            leafNum: 8,
            uri_2: {
                link: 'https://archive.org/download/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip/mobydickorwhale01melv_jp2%2Fmobydickorwhale01melv_0008.jp2',
                base_params: 'ext=jpg',
            },
            pageType: 'Normal',
            ppi: 400,
            pageSide: 'L',
        },
        {
            width: 1600,
            height: 2638,
            uri: 'https://ia800300.us.archive.org/BookReader/BookReaderImages.php?zip=/4/items/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip&file=mobydickorwhale01melv_jp2/mobydickorwhale01melv_0009.jp2&id=mobydickorwhale01melv',
            leafNum: 9,
            uri_2: {
                link: 'https://archive.org/download/mobydickorwhale01melv/mobydickorwhale01melv_jp2.zip/mobydickorwhale01melv_jp2%2Fmobydickorwhale01melv_0009.jp2',
                base_params: 'ext=jpg',
            },
            pageType: 'Title',
            ppi: 400,
            pageSide: 'R',
        },
    ],
]

test('tests pulling the first page from ReadBook data', () => {
    expect(pullPage(pageData[0], 0)).toStrictEqual("")
})

test('tests pulling a page from ReadBook data with page numbers', () => {
    expect(pullPage(pageData[1], 86)).toStrictEqual(54)
})

test('tests pull page spread on data without a spread', () => {
    expect(pullPageSpread(new Array(), singlePage, 0)).toStrictEqual([, ''
    ])
})

test('test pullPageSpread on example data from Moby Dick with a spread', () => {
    expect(pullPageSpread(new Array(), sampleBookReaderData[1], 1)).toStrictEqual([
        , , "n1", "n2"
    ])
})


// Test getPageNumber
const pageDataFile = fs.readFileSync('data/melville/mobydickorwhitew00melv_1.json', 'utf-8')
const pageSerialData = JSON.parse(pageDataFile)

test('test getting a standard page number from moby dick', () => {
    expect(getPageNumber(100, pageSerialData)).toBe('98')
})

test('test for a forward matter page from moby dick', () => {
    expect(getPageNumber(5, pageSerialData)).toBe('n4')
})


// tests stripping
test('test stripping HTML elements from string', () => {
    expect(strip("<b>Harry</b> Potter")).toBe("Harry Potter")
})

// tests formatMatch
test("tests phrase with brackets and no punctuation at start", () => {
    expect(formatMatch("{{{Ready or not}}} here I come.")).toBe("<b>Ready or not</b> here I come.")
})

test("tests string above with punctuation before the brackets", () => {
    expect(formatMatch("..{{{Ready or not}}} here I come.")).toBe("<b>Ready or not</b> here I come.")
})

