const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const historySchema = new Schema({
    userId: {type: String, required: true},
    mangaIds: {type: [String], required: false}
    },
    {
        timestamps: true
});

const History = mongoose.model('History',historySchema);

module.exports = History;