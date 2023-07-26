const express = require("express")
const router = express.Router()
const searchController = require("../controllers/search")
const { ensureAuth, ensureGuest } = require("../middleware/auth")

// Regular route for rendering the search page
router.get("/", (req, res) => {
    res.render("search"); // This renders the search.ejs view
});

// Route for handling AJAX search requests from the client-side
router.post("/", searchController.search);

module.exports = router