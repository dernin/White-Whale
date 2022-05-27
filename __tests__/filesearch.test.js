import { readFile, findMatches, filterPeriods, buildMatchString, findNextTwoSentences, buildFullMatch, findRegExpMatch } from '../lib/filesearch'

// tests for readFile

test('test for reading empty file', () => {
    expect(readFile('./public/data/tests/test1.txt')).toEqual([""])
})

test('test for reading file with three lines and one empty line', () => {
    expect(readFile('./public/data/tests/test2.txt')).toEqual(["lorem ", "ipsum ", "", "dolem "])
})

// tests for findMatches

test('test for searching an empty file', () => {
    expect(findMatches(readFile('./public/data/tests/test1.txt'), 'lorem')).toEqual([])
})

test('test with empty phrase', () => {
    expect(findMatches(readFile('./public/data/tests/test1.txt'), '')).toEqual([""])
})

test('test searching for something that isn\'t there in a file', () => {
    expect(findMatches(readFile('./public/data/tests/test2.txt'), 'dream')).toEqual([])
})

test('test searching for lorem in a text with lorem', () => {
    expect(findMatches(readFile('./public/data/tests/test2.txt'), 'lorem')).toEqual(["{{{lorem}}} ipsum "])
})

test('test searching for Lorem in a text with lorem', () => {
    expect(findMatches(readFile('./public/data/tests/test2.txt'), 'Lorem')).toEqual(["{{{lorem}}} ipsum "])
})

test('findMatches: search lorem ipsum in text with multiple occurences', () => {
    expect(findMatches(readFile('./public/data/tests/test3.txt'), 'lorem ipsum')).toEqual(["{{{Lorem ipsum}}} dolor sit amet, consectetur adipiscing elit. Ut quis consequat sapien, at bibendum ipsum.", "Duis vel nibh quis tellus dictum feugiat. {{{Lorem ipsum}}} dolor sit amet, consectetur adipiscing elit. Nulla gravida maximus lectus, et dictum orci malesuada a."])
})

test('findMatches: tests in full size book with a few matches', () => {
    expect(findMatches(readFile('./public/data/melville/redburnhisfirstv00melv_0_djvu.txt'), 'jonah')).toEqual(["It was a bitter disappointment, from which I was long in recovering. I lost all respect for whales ; and began to be a little dubious about the story of {{{Jonah}}} ; for how could Jonah reside in such an insignificant tenement ; how could he have had elbow-room there ? But perhaps, thought I, the whale, which according to Rabbinical traditions was a female one, might have expanded to receive him like an anaconda, when it swallows an elk and leaves the antlers sticking out of its mouth.",
    "It was a bitter disappointment, from which I was long in recovering. I lost all respect for whales ; and began to be a little dubious about the story of Jonah ; for how could {{{Jonah}}} reside in such an insignificant tenement ; how could he have had elbow-room there ? But perhaps, thought I, the whale, which according to Rabbinical traditions was a female one, might have expanded to receive him like an anaconda, when it swallows an elk and leaves the antlers sticking out of its mouth.",
                                "And, doubtless. \n\nHIS FIRST VOYAGE, \n\n127 \n\n{{{Jonah}}} himself must have been disappointed when he looked up to the domed midriff surmounting the whale’s belly, and surveyed the ribbed pillars around him. A pretty large belly, to be sure, thought he, but not so big as it might have been."])
})

// test buildFullMatch

// tests without period
test('buildFullMatch with test2 at start', () => {
    expect(buildFullMatch('lorem',0, readFile('./public/data/tests/test2.txt'), 0)).toEqual("{{{lorem}}} ipsum ")
})

test('buildFullMatch with test2 at from middle', () => {
    expect(buildFullMatch('ipsum',0, readFile('./public/data/tests/test2.txt'), 1)).toEqual("lorem {{{ipsum}}} \ndolem ")
})

test('buildFullMatch with test2 at end', () => {
    expect(buildFullMatch('dolem',0, readFile('./public/data/tests/test2.txt'), 3)).toEqual("ipsum \n{{{dolem}}} ")
})

// small tests with period
test('buildFullMatch with test3 for first word', () => {
    expect(buildFullMatch('lorem', 0, readFile('./public/data/tests/test3.txt'), 0)).toEqual("{{{Lorem}}} ipsum dolor sit amet, consectetur adipiscing elit. Ut quis consequat sapien, at bibendum ipsum.")
})

test('buildFullMatch with test3 for word in middle of first sentence', () => {
    expect(buildFullMatch('amet', 22, readFile('./public/data/tests/test3.txt'), 0)).toEqual("Lorem ipsum dolor sit {{{amet}}}, consectetur adipiscing elit. Ut quis consequat sapien, at bibendum ipsum.")
})

test('buildFullMatch with test3 for word in middle of first paragraph', () => {
    expect(buildFullMatch('Nam', 26, readFile('./public/data/tests/test3.txt'), 2)).toEqual("Maecenas a dapibus lorem. {{{Nam}}} ornare tincidunt sapien, eget feugiat dolor vulputate convallis. Etiam varius lacus pharetra, rutrum quam id, consectetur nisl.")
})

test('buildFullMatch with test3 for word in end of first paragraph', () => {
    expect(buildFullMatch('felis', 110, readFile('./public/data/tests/test3.txt'), 4)).toEqual("Praesent fermentum ex sem, sit amet rutrum lectus congue euismod. Aliquam nec luctus {{{felis}}}.\nDonec venenatis metus nisl, sed ullamcorper ligula laoreet porta.")
})

// tests on Melville

test('buildFullMatch with battle pieces checking against the first poem', () => {
    expect(buildFullMatch('Shenandoah', 0, readFile('./public/data/melville/battlepiecesanda00melvrich_djvu.txt'), 273)).toEqual("(1859-) \n\n\nHanging from the beam, \nSlowly swaying (such the law). Gaunt the shadow on your green, \n{{{Shenandoah}}} ! The cut is on the crown (Lo, John Brown), And the stabs shall heal no more.")
})

test('buildFullMatch with moby dick at beginning', () => {
    expect(buildFullMatch('Ishmael', 10, readFile('./public/data/melville/mobydickorwhitew00melv_1_djvu.txt'), 52)).toEqual("LOOMINGS. \nCall  me  {{{Ishmael}}}.  Some  years  ago — never  mind  how  long precisely — having  little  or  no  money  in  my  purse,  and  nothing particular  to  interest  me  on  shore,  I thought  I would sail  about  a little  and  see  the  watery  part  of  the  world.")
})

test('buildFullMatch with moby dick at middle of second page', () => {
    expect(buildFullMatch('China', 53, readFile('./public/data/melville/mobydickorwhitew00melv_1_djvu.txt'), 95)).toEqual("silent  sentinels  all  around  the  town,  stand  thousands  upon thousands  of  mortal  men  fixed  in  ocean  reveries.  Some leaning  against  the  spiles ; some  seated  upon  the  pier-heads  ; some  looking  over  the  bulwarks  of  ships  from  {{{China}}} ; some high  aloft  in  the  rigging,  as  if  striving  to  get  a still  better seaward  peep.  But  these  are  all  landsmen ; of  week  days pent  up  in  lath  and  plaster — tied  to  counters,  nailed  to benches,  clinched  to  desks.")
})

//test findRegExpMatch
const regString = "one two three four five"

test('findRegExpMatch: empty search phrase empty string', () => {
    expect(findRegExpMatch('', '')).toBe(0)
})

test('findRegExpMatch: empty search phrase with string', () => {
    expect(findRegExpMatch("", regString)).toBe(0)
})

test('findRegExpMatch: search for word not in string ', () => {
    expect(findRegExpMatch('lorem', regString)).toBe(-1)
})

test('findRegExpMatch: search for word in string ', () => {
    expect(findRegExpMatch('one', regString)).toBe(0)
})

// tests for findNextTwoSentences
test('findNextTwoSentences: test empty text file', () => {
    expect(findNextTwoSentences(readFile('./public/data/tests/test1.txt'), 0, 0, 'forward')).toEqual('')
})

test('findNextTwoSentences: test file with no periods', () => {
    expect(findNextTwoSentences(readFile('./public/data/tests/test4.txt'), 0, 0, 'forward')).toEqual('one two three four five six seven eight night ten ')
})

test('findNextTwoSentences: test file with no periods from end going back', () => {
    expect(findNextTwoSentences(readFile('./public/data/tests/test4.txt'), 4, 15, 'back')).toEqual('eight night ten eleven day ten twelve day ten ')
})

test('findNextTwoSentences: test file with period from beginning', () => {
    expect(findNextTwoSentences(readFile('./public/data/tests/test3.txt'), 0, 0, 'forward')).toEqual('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut quis consequat sapien, at bibendum ipsum.')
})

test('findNextTwoSentences: test file with period from middle of line two going backwards', () => {
    expect(findNextTwoSentences(readFile('./public/data/tests/test3.txt'), 1, 49, 'back')).toEqual('. Ut quis consequat sapien, at bibendum ipsum. Morbi vel nulla ultrices, rutrum eros ac, blandit')
})

test('findNextTwoSentences: test file with period from middle of line five going forwads', () => {
    expect(findNextTwoSentences(readFile('./public/data/tests/test3.txt'), 4, 52, 'forward')).toEqual('sit amet rutrum lectus congue euismod. Aliquam nec luctus felis.')
})

test('findNextTwoSentences: test file with period from middle of line five going backwards', () => {
    expect(findNextTwoSentences(readFile('./public/data/tests/test3.txt'), 4, 51, 'back')).toEqual('. Nulla nec consectetur dui, sed laoreet tellus. Praesent fermentum ex sem,')
})

test('findnextTwoSentences: test file with only one period', () => {
    expect(findNextTwoSentences(readFile('./public/data/tests/test5.txt'), 0, 0, 'forward')).toEqual('one period only.')
})

test('findnextTwoSentences: test file with an acronym', () => {
    expect(findNextTwoSentences(readFile('./public/data/tests/test6.txt'), 0, 0, 'forward')).toEqual('this has an a.c.r.o. in it. so there.')
})

// tests for filterPeriods
test('test filterPeriods for checking an empty string', () => {
    expect(filterPeriods(0, "", 1)).toBe(false)
})

test('test filterPeriods for an out of bounds position in a string', () => {
    expect(filterPeriods(100, 'Hello', 1)).toBe(false)
})

test('test filterPeriods for a sentence with no period', () => {
    expect(filterPeriods(5, 'This is a sentence without a period', 1)).toBe(false)
})

test('test filterPeriods for a period position in two sentences with a period between going forwards', () => {
    expect(filterPeriods(10, 'Sentence 1. Sentence 2.', 1)).toBe(true)
})

test('test filterPeriods for two sentences with a period between going backwards from before the first period', () => {
    expect(filterPeriods(5, 'Sentence 1. Sentence 2.', -1)).toBe(false)
})

test('test filterPeriods for two sentences with a period between going backwards from after the first period', () => {
    expect(filterPeriods(12, 'Sentence 1. Sentence 2.', -1)).toBe(false)
})

test('test filterPeriods for sentences with an acronym, at the start of the acronym going forward', () => {
    expect(filterPeriods(10, 'sentence r.o.c.k.s. am i right.', 1)).toBe(19)
})

test('test filterPeriods for sentences with an acronym, at the start of the acronym going backwards', () => {
    expect(filterPeriods(10, 'sentence r.o.c.k.s. am i right.', -1)).toBe(7)
})

test('test filterPeriods for sentences with an acronym, after the acronym going forward', () => {
    expect(filterPeriods(20, 'sentence r.o.c.k.s. am i right.', 1)).toBe(false)
})

test('filterPeriods for sentence with ! in it', () => {
    expect(filterPeriods(5, 'Ready! I am.', 1)).toBe(true)
})

test('filterPeriods for sentence with ?', () => {
    expect(filterPeriods(5, 'Ready? I am.', 1)).toBe(true)
})

test('filterPeriods for sentence with exclemation mark after an acronym going forward', () => {
    expect(filterPeriods(30, 'sentence r.o.c.k.s. am I right? huh?', 1)).toBe(true)
})
test('filterPeriods for sentence with exclemation mark after an acronym going forward', () => {
    expect(filterPeriods(30, 'sentence r.o.c.k.s. am I right? huh?', -1)).toBe(true)
})


// test for buildMatchString
const testArray = ['one string. ', 'two string. ', 'three string. ', 'four string. ', 'five string. ']
const testSingleLine = ['one string. two string. three string.']
const noPeriod = ['one two three four ' ,'five six seven ', 'eight night ten ']

test('buildMatchString: tests an empty array of lines', () => {
    expect(buildMatchString([''], 0, 0, 0, 0, 1)).toBe('')
})

test('buildMatchString: tests an array of one line with no string to build', () => {
    expect(buildMatchString(['a string'], 0, 0, 0, 0, 1)).toBe('')
})

test('buildMatchString: tests with a single line with backward search', () => {
    expect(buildMatchString(testSingleLine, 0, 0, 0, testSingleLine[0].length, -1)).toBe(testSingleLine[0])
})

test('buildMatchString: tests with a single line with forward search', () => {
    expect(buildMatchString(testSingleLine, 0, testSingleLine[0].length, 0, 0, testSingleLine[0].length, -1)).toBe(testSingleLine[0])
})

test('buildMatchString: tests a simple array of strings concatinating the 2nd through fourth starting at the 2nd assuming a backwards search', () => {
    expect(buildMatchString(testArray, 1, 0, 3, testArray[3].length -1, -1)).toBe('two string. three string. four string.')
})

test('buildMatchString: tests noPeriod from beginning going forward', () => {
    expect(buildMatchString(noPeriod, 2, 15, 0, 0, 1)).toBe('one two three four five six seven eight night ten')
})
