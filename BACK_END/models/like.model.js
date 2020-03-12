const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newLike = new Schema({
    mangaId: {type: String, required: true},
    userId: {type: String, required: true}
    },{
        timestamps: true
});

const Like = mongoose.model('Like', newLike);

module.exports = Like;
