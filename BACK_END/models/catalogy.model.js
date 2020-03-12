const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const catalogySchema = new Schema({
    name:{type:String,required:true}
    },
    {
        timestamps: true
    }
)

const Catalogy = mongoose.model('Catalogy',catalogySchema);

module.exports = Catalogy;