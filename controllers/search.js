const Post = require("../models/Post");
const { MongoClient, Db } = require('mongodb');
// const recipeApi = require('recipe-api-library');

const mongoURL = process.env.DB_STRING
const dbName = 'test'
const collectionName = 'posts';
const apiKey = process.env.SPOON_API_KEY;

// Connect to MongoDB
const client = new MongoClient(mongoURL, { useUnifiedTopology: true });
client.connect();

// Search function
async function search(req, res) {
    const search = req.body.search;

    try {
        // Search in MongoDB
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const mongoResults = await collection.find({ $text: { $search: search } }).toArray();

        // Search in Spoonacular API
        const spoonacularEndpoint = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${search}`;
        const spoonacularResponse = await fetch(spoonacularEndpoint);
        const spoonacularData = await spoonacularResponse.json();
        const apiResults = spoonacularData.results;

        // Combine and format the results
        const combinedResults = { mongoResults, apiResults };

        // Set the response header
        res.setHeader('Content-Type', 'application/json');

        // Send the JSON response
        res.json(combinedResults);
    } catch (error) {
        console.error('Error during search:', error);
        res.status(500).json({ error: 'An error occurred during search' });
    }
}

module.exports = { search };
