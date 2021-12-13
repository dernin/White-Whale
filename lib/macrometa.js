import jsc8 from 'jsc8'
const client = new jsc8({url: "https://gdn.paas.macrometa.io", apiKey: process.env.MACROMETA_API_KEY, fabricName: '_system'})

//  Creates client connection with macrometa. 
// Must be called before any database queries
export async function getFabric() {
    try {
        console.log('Getting fabric details...')
        let result = await client.get()

        console.log('result is: ', result)
    } catch(e) {
        console.log('Fabric details could not be fetched because ' + e)
    }
}



// Collection, document -> Database
// Inserts the given document into the given collection
export async function populateCollection(collection, doc) {
    console.log('Creating document in: ', collection)
    await client.insertDocument(collection, doc)
    console.log('Finished populating ', collection)
}

export async function updateDoc(collection, docHandle, data) {
    await client.updateDocument(collection, docHandle, data)
}



// Collection, key -> Database
// Creates a hash index for the given key in the given collection
export async function createIndex(collection, key) {
    console.log('creating index on ' + collection)
    let index
    try {
        index = await client.addHashIndex(collection, key)
        console.log('the index details are: ', index)
    } catch(e) {
        console.log("Index creation did not succeed to due to" + e)
        return 
    }

    return 
}

// String -> Database
// Runs the given query in the database and returns the result.
export async function runQuery(query) {
    console.log('Running ', query)
    const result = await client.executeQuery(query)
    return result
}