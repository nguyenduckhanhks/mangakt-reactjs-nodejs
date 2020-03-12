const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true },
    username: { type: String, required: true},
    password: { type:  String, required: true},
    imageUrl: { type: String },
    admin: { type: Boolean, required: false },
    },
    {
        timestamps: true,
});

const User = mongoose.model('User',userSchema);

module.exports = User;