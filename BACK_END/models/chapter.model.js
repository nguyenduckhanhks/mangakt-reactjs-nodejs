const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newChapter = new Schema({
    mangaId: {type: String, required: true},
    listImage: {type: [String],required: true},
    stt:{type: String, required: true},
    },
    {
        timestamps: true
});

const Chapter = mongoose.model('Chapter',newChapter);

module.exports = Chapter;