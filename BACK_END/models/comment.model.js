const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    body: {type: String, required: true},
    chapterId: {type: String, required: true},
    userId: {type: String, required: true}
},{
    timestamps: true
});

const Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;