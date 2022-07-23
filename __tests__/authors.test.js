import { getAuthors, getAuthorData } from "../lib/authors";
import authors from '../public/data/authors.json'
import fs from 'fs'

// test for getAuthors
test('tests getAtuhors', () => {
    expect(getAuthors()).toEqual(["Herman Melville", "William Shakespeare", "Jane Austen", "Nathaniel Hawthorne", "Oscar Wilde", "Charlotte Bronte"])
})

// tests for getAuthorData
test('tests Herman Melville', () => {
    expect(getAuthorData('Herman Melville')).toEqual({"folder": "melville",
    "id": "OL29497A",
    "name": "Herman Melville",
    "summary": "All of Melville's works are available, except for *Clarel*, *Timoleon*, *Weeds and Wildings Chiefly*, *Parthenope*, and other uncollected poetry and prose. Excerpts from *Clarel* and *Timoleon* are included in *John Marr and Other Poems*. If you work at an institution with a copy of any of these works, please consider uploading them to archive.org.",
    "time": 1636936395510,
    "works": {
        "Typee: A Peep at Polynesian Life": {
            "item_id": "typeeromanceofso00melvuoft"
        },
        "Omoo: A Narrative of Adventures in the South Seas": {
            "item_id": "omoonarrativeofa00melviala"
        },
        "Mardi: And a Voyage Thither Vol 1": {
            "item_id": "mardiandvoyageth_01melv"
        },
        "Mardi: And a Voyage Thither Vol 2": {
            "item_id": "mardiandvoyageth02melv"
        },
        "Redburn: His First Voyage": {
            "item_id": "redburnhisfirstv00melv_0"
        },
        "White-Jacket; or, The World in a Man-of-War": {
            "item_id": "whitejacket00melvrich"
        },
        "Moby-Dick; or, The Whale": {
            "item_id": "mobydickorwhitew00melv_1"
        },
        "Pierre; or, The Ambiguities": {
            "item_id": "pierreorambiguit00melvuoft"
        },
        "Israel Potter: His Fifty Years of Exile": {
            "item_id": "israelpotterhisf0000melv_l0m5"
        },
        "The Confidence-Man: His Masquerade": {
            "item_id": "confidencemanhis00melvrich"
        },
        "Billy Budd, Sailor (An Inside Narrative)": {
            "item_id": "melville_herman_1819_1891_billy_budd"
        },
        "Battle Pieces and Aspects of The War": {
            "item_id": "battlepiecesanda00melvrich"
        },
        "Clarel: A Poem and Pilgrimage in the Holy Land": {
            "item_id": ""
        },
        "John Marr and Other Poems": {
            "item_id": "johnmarrotherpoe00melvrich"
        },
        "Timoleon": {
            "item_id": ""
        },
        "The Apple-Tree Table and Other Sketches": {
            "item_id": "appletreetable00melvrich"
        },
        "The Piazza Tales": {
            "item_id": "piazztales00melvrich"
        },
        "Some Personal Letters of Herman Melville": {
            "item_id": "cu31924022066900"
        }
    }})
})