import { strip, getTitle, authorFolder, removePunctuationFromStart, replaceSpace } from '../lib/util'
import fs from 'fs'

// tests stripping
test('test stripping HTML elements from string', () => {
    expect(strip("<b>Harry</b> Potter")).toBe("Harry Potter")
})

// tests getTitle
test('tests getting the title of moby dick with the id', () => {
    expect(getTitle('mobydickorwhitew00melv_1', 'Herman Melville')).toBe("Moby-Dick; or, The Whale")
})

// tests authorFolder
test('tests getting the author folder for Melville', () => {
    expect(authorFolder('Herman Melville')).toBe('melville')
})

// tests removePunctuationFromStart
test('tests removing all punctuation characters from the start of the string', () => {
    expect(removePunctuationFromStart('.?!,help')).toBe('help')
})

// tests replaceSpace
test('tests removing the spaces and replacing them with _ in a string', () => {
    expect(replaceSpace('Herman Melville')).toBe("Herman_Melville")
})