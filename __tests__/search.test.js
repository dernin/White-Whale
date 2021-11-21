import { cacheValidity, searchPhrase, setAuthorData } from '../lib/search.js'
import fs from 'fs'

// test search
/*
test("test searching for Ocean in Melville", () => {
    return searchPhrase("Ocean", "Herman Melville").then(data => {
        expect(data).toBe(JSON.parse(fs.readFileSync('data/melville/searches/Ocean.json')))
    })
}) */

// test cacheValidity checking
// Due to the nature of this test, it will fail in the future, but
// test passed as of 11/13/2021
test("tests for cache validity of the river search in Bronte", () => {
    return cacheValidity('data/brontec/searches/river.json', 'Charlotte Bronte').then(data => {
        expect(data).toBe(true)
    })

})