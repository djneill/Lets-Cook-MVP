const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
    favPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        require: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

//MongoDB Collection named here - will give lowercase plural of name 
module.exports = mongoose.model("Favorite", FavoriteSchema);
