# White Whale Readme

## Overview

White Whale is a tool for comparing the works of an author. The repetition of ideas, language, and allusions have struck me, as I have made my way through Herman Melville's complete works. Not only can you draw lines between the works on topics like sailing, searching, and travel, but in classical allusions to Ovid and Homer in *White Jacket* and *Mardi* or Biblical allusions in *Moby-Dick* and *Clarel* (which unfortunately could not be included in the search. See below). I thought it would be helpful to new and seasoned academics and admirer's of literature to be able to quickly cross reference between and within works to aid their scholarship and understanding of these texts. 

For more about White Whale and the authors included in the search, visit the about page.

## Technical Brief

Originally, White Whale's search was based off of <a href="https://archive.org">archive.org</a> and <a href="https://openlibrary.org">Open Library's </a>APIs. Unfortunately this led to slow searches, and working with the API's can be quite difficult, so I have since rebuilt a search algorithm from scratch using TypeScript and implemented it in place of the API. 

The front-end is built with <a href="https://nextjs.org/">Next.js</a> and the <a href="https://bulma.io/">Bulma.io</a> CSS framework. The data is stored in a noSQL database with <a href="https://www.macrometa.com" >Macrometa.</a>

### Archive.org APIs

The <a href="https://openlibrary.org/developers/api">API documentation</a> on Open Library is a bit opaque and out of date. I originally intended to use a combination of their search and <a href="https://openlibrary.org/dev/docs/api/search_inside">search inside</a> APIs to allow users to search for an author they were interested in and then search within all of their books. I quickly realized this wasn't possible as there are many editions of a given book and furthermore the editions are not always labeled correctly or well. That left me with hand picking volumes and using the search inside API. 

The documentation gives the parameters and an example call, but doesn't explain what many of the parameters are or where one would find them. 
The parameters needed in addition to the search query are 
- hostname
- item_id
- doc
- path
All of these parameters are available with the **item_id** by querying archive.org/metadata/**item_id** and parsing the response. 

The documentation fails to note a few things about this query however. It does note that the **doc** parameter is often, but not always the same as the **item_id**. **doc** is not an item in the metadata, but I was able to discover through trial and error that books that were scanned and processed with Djvu and that had a Djvu XML file associated with their metadata, have a separate **doc** value. This **doc** value is retrieved from the filename of the Djvu XML file name by removing the file format information. 

That was the first hurdle I came across in working with the API. The second came from wanting to link directly to the page in a given book that a match in a search comes from. What I assumed to be a fairly simple task became one of the most time consuming elements of the project because the page numbers given from the search inside API do not line up with the page numbers used in the URL structure archive.org uses to navigate between the pages of a book. 

I could not find documentation on this issue anywhere, but it turns out that the search inside API gives you the **leaf number** that a match appears on. This **leaf number** is the number of scanned images inside the book you are in, but the URL structure uses a separate page number that is based on the page numbers actually included inside the book. Therefore, things like the title page, copyright page, forward, introduction, and any other page without a number, are not found with a page number. Instead they are referenced by the string **nx** where xx is **leaf number** minus one (because the first leaf of a book doesn't have any reference number). Note, sometimes books do have page numbers, but they aren't included in the metadata for some reason, so every page is referenced by **nx**.

You are able to query this page number information by using the following API call:

https://**hostname**/BookReader/BookReaderJSIA.php?id=**item_id**&itemPath=**path**&server=**hostname**&format=json&subPrefix=**doc**

What it returns is not easy to navigate or index into, so I opted to use the information given to recreate a simple JSON file to store leaf numbers against their page numbers. One other thing to watch out for, that I still do not understand, is that some books skip leaf numbers, which means you cannot assume leaf numbers are accurate to the number of scanned images in the book.

### Other Things I Learned

This was a learning project for me. I had never used Node.js, Next.js, or Bulma before. In addition, I had never built anything that relied on APIs and had never built an API before. I learned a lot about asynchronous JavaScript, parsing and building JSON objects and writing files. I specifically chose to not use a database and instead rely on JSON files as a learning experience and because of the relative simplicity of the need data storage. 

I initially developed the program to store data as local JSON files, without realizing that when in production Next.js does not support writing files to the server. In order to keep the same basic data structures, I switched to a noSQL database for storage.

This is the first major project where I have used a testing library to build tests as I went along. There are still some inconsistencies in the code - for example sometimes I used React classes for components and other times used functional components that I would like to clean up when I have the time.