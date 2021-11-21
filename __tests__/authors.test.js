import { authorValidity } from "../lib/authors";
import authors from '../data/authors.json'
import fs from 'fs'

// Tests for authorValidity
// Because of the nature of these tests, they may fail in the future, but they have passed as of 11/13/2021

const austenData = fs.readFileSync('data/austen/Jane Austen.json', 'utf8')

test("tests for author validity on the condition that one week has passed since an author file has been built on the Jane Austen data.", () => {
    expect(authorValidity("Jane Austen", austenData)).toBe(true)
})

const melvilleData = fs.readFileSync('data/melville/Herman Melville.json', 'utf8')

test("tests for if the authors.json row for Melville has been updated since Melville's json data has been built.", () => {
    expect(authorValidity("Herman Melville", melvilleData)).toBe(true)
})

const bronteData = fs.readFileSync('data/brontec/Charlotte Bronte.json', 'utf8')

test('tests if Charlotte Bronte\'s time in authors.json has been updated and is under a week old, and this should be false.', () => {
    expect(authorValidity("Charlotte Bronte", bronteData)).toBe(false)
})