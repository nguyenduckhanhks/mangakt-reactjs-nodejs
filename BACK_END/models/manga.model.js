const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mangaSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    author: {type: String, required: true},
    chapters: {type:[String], required: true},
    chapterCount: {type: Number, required: true},
    status: {type: Boolean, required: true},
    catalogy: {type: [String], required: false},
    imageUrl: {type: String, required: true},
    likeCount: { type: Number, required: true},
    commentCount: {type: Number, required: true}
    },{
        timestamps: true
});

const Manga = mongoose.model('Manga',mangaSchema);

module.exports = Manga;